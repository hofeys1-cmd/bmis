import React, { useState } from 'react';
import type { User, Role } from '../../types';
import { Modal } from '../common/Modal';
import { useNotification } from '../../hooks/useNotification';
import { UserPlus } from 'lucide-react';


interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const ROLES: { id: Role; name: string }[] = [
    { id: 'admin', name: 'مدیر سیستم' },
    { id: 'occupationalMedicine', name: 'طب کار' },
    { id: 'treatment', name: 'درمان' },
    { id: 'safety', name: 'ایمنی' },
    { id: 'fireDepartment', name: 'آتش نشانی' },
    { id: 'environment', name: 'محیط زیست' },
];

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";


export const UserManagement: React.FC<Props> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{username: string, roles: Role[], password?: string}>({ username: '', roles: [] });
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { addNotification } = useNotification();

  const handleOpenModal = (user: User | null) => {
    setEditingUser(user);
    setFormData(user ? { username: user.username, roles: [...user.roles] } : { username: '', roles: [], password: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '', roles: [] });
  };

  const handleRoleChange = (role: Role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) {
        addNotification('نام کاربری نمی‌تواند خالی باشد.', 'error');
        return;
    }

    if (editingUser) {
      setUsers(users.map(u => {
        if (u.id === editingUser.id) {
          // FIX: The previous logic was implicitly dropping the password.
          // This ensures all original properties (like password) are preserved,
          // and only the form data fields are updated.
          return { 
            ...u, 
            username: formData.username, 
            roles: formData.roles 
          };
        }
        return u;
      }));
      addNotification('کاربر با موفقیت ویرایش شد.', 'success');
    } else {
      if (!formData.password) {
        addNotification('رمز عبور برای کاربر جدید الزامی است.', 'error');
        return;
      }
      const newUser: User = { id: crypto.randomUUID(), username: formData.username, password: formData.password, roles: formData.roles };
      setUsers([...users, newUser]);
      addNotification('کاربر جدید با موفقیت اضافه شد.', 'success');
    }
    handleCloseModal();
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
    addNotification(`کاربر '${userToDelete.username}' با موفقیت حذف شد.`, 'success');
    setUserToDelete(null); // Close the modal
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80">
      <div className="flex justify-between items-center p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
        <h2 className="text-2xl font-bold text-slate-700">مدیریت کاربران</h2>
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 space-x-reverse"
        >
            <UserPlus className="h-5 w-5" />
            <span>کاربر جدید</span>
        </button>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                <th scope="col" className="px-6 py-3">نام کاربری</th>
                <th scope="col" className="px-6 py-3">نقش‌ها</th>
                <th scope="col" className="px-6 py-3">عملیات</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                    <td className="px-6 py-4">{user.roles.map(r => ROLES.find(role => role.id === r)?.name).join('، ')}</td>
                    <td className="px-6 py-4 space-x-4 space-x-reverse">
                    <button onClick={() => handleOpenModal(user)} className="font-medium text-secondary-600 hover:underline">ویرایش</button>
                    <button onClick={() => setUserToDelete(user)} className="font-medium text-danger-600 hover:underline">حذف</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'ویرایش کاربر' : 'افزودن کاربر'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">نام کاربری</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={baseInputClasses}
              required
            />
          </div>
           {!editingUser && (
            <div>
              <label htmlFor="password_modal" className="block text-sm font-medium text-slate-700 mb-1.5">رمز عبور</label>
              <input
                type="password"
                id="password_modal"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={baseInputClasses}
                required
              />
            </div>
           )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">نقش‌ها</label>
            <div className="grid grid-cols-2 gap-2">
                {ROLES.map(role => (
                    <label key={role.id} className="flex items-center space-x-2 space-x-reverse p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.roles.includes(role.id)}
                            onChange={() => handleRoleChange(role.id)}
                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>{role.name}</span>
                    </label>
                ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingUser ? 'ذخیره تغییرات' : 'ایجاد کاربر'}</button>
          </div>
        </form>
      </Modal>

      <Modal 
          isOpen={!!userToDelete} 
          onClose={() => setUserToDelete(null)} 
          title="تایید حذف کاربر"
          size="md"
      >
          <div className="text-center">
              <p className="text-lg text-slate-700">
                  آیا از حذف کاربر <span className="font-bold">{userToDelete?.username}</span> اطمینان دارید؟
              </p>
              <p className="text-sm text-slate-500 mt-2">این عملیات قابل بازگشت نیست.</p>
              <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                  <button 
                      onClick={() => setUserToDelete(null)} 
                      className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
                  >
                      انصراف
                  </button>
                  <button 
                      onClick={handleDeleteUser} 
                      className="px-6 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700"
                  >
                      حذف
                  </button>
              </div>
          </div>
      </Modal>
    </div>
  );
};