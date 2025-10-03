import React, { useState } from 'react';
import type { FireEquipmentTypeConfig, FireEquipment } from '../../types';
import { Modal } from '../common/Modal';
import { useNotification } from '../../hooks/useNotification';
import { PlusCircle, Archive, Pencil, Trash2 } from 'lucide-react';

interface Props {
  equipmentTypes: FireEquipmentTypeConfig[];
  onAddEquipmentType: (type: Omit<FireEquipmentTypeConfig, 'id'>) => void;
  onEditEquipmentType: (type: FireEquipmentTypeConfig) => void;
  onDeleteEquipmentType: (typeId: string) => void;
  equipmentList: FireEquipment[];
}

export const EquipmentTypeManagement: React.FC<Props> = ({
  equipmentTypes,
  onAddEquipmentType,
  onEditEquipmentType,
  onDeleteEquipmentType,
  equipmentList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<FireEquipmentTypeConfig | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<FireEquipmentTypeConfig | null>(null);
  const [name, setName] = useState('');
  const { addNotification } = useNotification();

  const handleOpenModal = (type: FireEquipmentTypeConfig | null) => {
    setEditingType(type);
    setName(type ? type.name : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addNotification('نام نوع تجهیز نمی‌تواند خالی باشد.', 'error');
      return;
    }
    if (editingType) {
      onEditEquipmentType({ ...editingType, name });
      addNotification('نوع تجهیز با موفقیت ویرایش شد.', 'success');
    } else {
      onAddEquipmentType({ name });
      addNotification('نوع تجهیز جدید با موفقیت افزوده شد.', 'success');
    }
    handleCloseModal();
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      onDeleteEquipmentType(typeToDelete.id);
      addNotification(`نوع '${typeToDelete.name}' با موفقیت حذف شد.`, 'success');
      setTypeToDelete(null);
    }
  };

  const handleDeleteClick = (type: FireEquipmentTypeConfig) => {
    const isUsed = equipmentList.some(eq => eq.typeId === type.id);
    if(isUsed) {
        addNotification(`امکان حذف '${type.name}' وجود ندارد زیرا در حال استفاده است.`, 'error');
        return;
    }
    setTypeToDelete(type);
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 min-h-[calc(100vh-350px)] flex flex-col">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-700">انواع تجهیزات آتش نشانی</h3>
            <button onClick={() => handleOpenModal(null)} className="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center space-x-2 space-x-reverse">
              <PlusCircle className="h-5 w-5" />
              <span>افزودن نوع جدید</span>
            </button>
          </div>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {equipmentTypes.length > 0 ? (
            <div className="overflow-x-auto relative border rounded-lg">
              <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3">نام نوع تجهیز</th>
                    <th scope="col" className="px-6 py-3">تعداد تجهیزات</th>
                    <th scope="col" className="px-6 py-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentTypes.map(type => (
                    <tr key={type.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{type.name}</td>
                      <td className="px-6 py-4">{equipmentList.filter(eq => eq.typeId === type.id).length}</td>
                      <td className="px-6 py-4 space-x-2 space-x-reverse whitespace-nowrap">
                        <button onClick={() => handleOpenModal(type)} className="p-1.5 text-slate-500 hover:text-secondary-600 hover:bg-secondary-100 rounded-md transition-colors" title="ویرایش"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteClick(type)} className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-100 rounded-md transition-colors" title="حذف"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
              <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="font-semibold text-slate-600">هیچ نوع تجهیزی یافت نشد</p>
              <p className="text-sm mt-1">برای شروع، اولین نوع تجهیزات خود را ثبت کنید.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingType ? 'ویرایش نوع تجهیز' : 'افزودن نوع جدید'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="typeName" className="block text-sm font-medium text-slate-700 mb-1.5">نام نوع تجهیز</label>
            <input
              type="text"
              id="typeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingType ? 'ذخیره تغییرات' : 'افزودن'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!typeToDelete} onClose={() => setTypeToDelete(null)} title="تایید حذف نوع تجهیز" size="md">
        <div className="text-center">
          <p className="text-lg text-slate-700">آیا از حذف نوع <span className="font-bold">{typeToDelete?.name}</span> اطمینان دارید؟</p>
          <div className="flex justify-center space-x-4 space-x-reverse pt-6">
            <button onClick={() => setTypeToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
            <button onClick={handleConfirmDelete} className="px-6 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700">حذف</button>
          </div>
        </div>
      </Modal>
    </>
  );
};