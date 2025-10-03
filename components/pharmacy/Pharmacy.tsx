
import React, { useState, useEffect } from 'react';
import type { Medicine } from '../../types';
import { Modal } from '../common/Modal';
import { useNotification } from '../../hooks/useNotification';
import { PlusCircle, Search } from 'lucide-react';


interface Props {
  medicines: Medicine[];
  onAddMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  onEditMedicine: (medicine: Medicine) => void;
}

const INITIAL_FORM_STATE = { name: '', type: '', stock: 0 };

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";


export const Pharmacy: React.FC<Props> = ({ medicines, onAddMedicine, onEditMedicine }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (editingMedicine) {
      setFormData({ name: editingMedicine.name, type: editingMedicine.type, stock: editingMedicine.stock });
      setIsModalOpen(true);
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [editingMedicine]);

  const handleOpenAddModal = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingMedicine(null); // Also reset editing state on close
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type && formData.stock >= 0) {
      if (editingMedicine) {
        onEditMedicine({ ...editingMedicine, ...formData });
        addNotification('دارو با موفقیت ویرایش شد.', 'success');
      } else {
        onAddMedicine(formData);
        addNotification('داروی جدید با موفقیت اضافه شد.', 'success');
      }
      handleCloseModal();
    } else {
        addNotification('لطفا تمام فیلدها را به درستی پر کنید.', 'error');
    }
  };
  
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-700">موجودی داروخانه</h3>
                <button onClick={handleOpenAddModal} className="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center space-x-2 space-x-reverse">
                    <PlusCircle className="h-5 w-5" />
                    <span>افزودن داروی جدید</span>
                </button>
            </div>
        </div>
        <div className="p-4 border-b border-slate-200/80">
            <div className="relative">
                <input
                    type="search"
                    placeholder="جستجوی دارو..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </div>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="overflow-x-auto relative border rounded-lg">
            <table className="w-full text-sm text-right text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                <th scope="col" className="px-6 py-3">نام دارو</th>
                <th scope="col" className="px-6 py-3">نوع</th>
                <th scope="col" className="px-6 py-3">موجودی</th>
                <th scope="col" className="px-6 py-3">عملیات</th>
                </tr>
            </thead>
            <tbody>
                {filteredMedicines.map(med => (
                <tr key={med.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{med.name}</td>
                    <td className="px-6 py-4">{med.type}</td>
                    <td className={`px-6 py-4 font-semibold ${med.stock < 10 ? 'text-danger-600' : 'text-slate-800'}`}>{med.stock}</td>
                    <td className="px-6 py-4">
                    <button onClick={() => setEditingMedicine(med)} className="font-medium text-secondary-600 hover:underline">ویرایش</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMedicine ? "ویرایش دارو" : "افزودن داروی جدید"}>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">نام دارو</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={baseInputClasses} required />
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">نوع دارو (قرص، شربت...)</label>
                  <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={baseInputClasses} required />
              </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">موجودی</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value, 10)})} className={baseInputClasses} required min="0" />
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingMedicine ? 'ذخیره تغییرات' : 'افزودن'}</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};