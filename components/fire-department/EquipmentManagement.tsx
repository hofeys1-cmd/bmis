import React, { useState, useMemo } from 'react';
import type { FireEquipment, FireEquipmentTypeConfig } from '../../types';
import { Modal } from '../common/Modal';
import { EquipmentForm } from './EquipmentForm';
import { useNotification } from '../../hooks/useNotification';
import { PlusCircle, Search, Archive, Pencil, Trash2 } from 'lucide-react';

interface Props {
  equipmentList: FireEquipment[];
  equipmentTypes: FireEquipmentTypeConfig[];
  onAddEquipment: (equipment: Omit<FireEquipment, 'id'>) => void;
  onEditEquipment: (equipment: FireEquipment) => void;
  onDeleteEquipment: (equipmentId: string) => void;
}

const statusMap: { [key in FireEquipment['status']]: { text: string; className: string } } = {
  operational: { text: 'سالم', className: 'bg-success-100 text-success-800' },
  needs_service: { text: 'نیاز به سرویس', className: 'bg-warning-100 text-warning-800' },
  out_of_service: { text: 'خراب', className: 'bg-danger-100 text-danger-700' },
};

export const EquipmentManagement: React.FC<Props> = ({ equipmentList, equipmentTypes, onAddEquipment, onEditEquipment, onDeleteEquipment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<FireEquipment | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState<FireEquipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotification();
  
  const getTypeName = (typeId: string) => {
    return equipmentTypes.find(t => t.id === typeId)?.name || 'نامشخص';
  };

  const handleOpenModal = (equipment: FireEquipment | null) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  const handleSubmit = (formData: Omit<FireEquipment, 'id'>) => {
    if (editingEquipment) {
      onEditEquipment({ ...formData, id: editingEquipment.id });
      addNotification('تجهیزات با موفقیت ویرایش شد.', 'success');
    } else {
      onAddEquipment(formData);
      addNotification('تجهیزات جدید با موفقیت ثبت شد.', 'success');
    }
    handleCloseModal();
  };

  const handleConfirmDelete = () => {
    if (equipmentToDelete) {
      onDeleteEquipment(equipmentToDelete.id);
      addNotification(`تجهیزات '${equipmentToDelete.tag}' با موفقیت حذف شد.`, 'success');
      setEquipmentToDelete(null);
    }
  };

  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipmentList;
    const lowercasedTerm = searchTerm.toLowerCase();
    return equipmentList.filter(
      (eq) =>
        eq.tag.toLowerCase().includes(lowercasedTerm) ||
        eq.location.toLowerCase().includes(lowercasedTerm) ||
        getTypeName(eq.typeId).toLowerCase().includes(lowercasedTerm)
    );
  }, [equipmentList, searchTerm, equipmentTypes]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 min-h-[calc(100vh-350px)] flex flex-col">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
          <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-700">لیست تجهیزات آتش نشانی</h3>
              <button onClick={() => handleOpenModal(null)} className="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center space-x-2 space-x-reverse disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={equipmentTypes.length === 0}>
                  <PlusCircle className="h-5 w-5" />
                  <span>افزودن تجهیزات</span>
              </button>
          </div>
           {equipmentTypes.length === 0 && (
             <p className="text-sm text-warning-800 bg-warning-50 p-2 rounded-md mt-2">
                برای افزودن تجهیزات، ابتدا باید از بخش "مدیریت انواع تجهیزات" یک نوع تجهیز ثبت کنید.
            </p>
           )}
        </div>
        <div className="p-4 border-b border-slate-200/80">
            <div className="relative">
                <input
                    type="search"
                    placeholder="جستجو در تجهیزات (شناسه، مکان، نوع...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {filteredEquipment.length > 0 ? (
            <div className="overflow-x-auto relative border rounded-lg">
                <table className="w-full text-sm text-right text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                    <tr>
                    <th scope="col" className="px-6 py-3">شناسه</th>
                    <th scope="col" className="px-6 py-3">نوع</th>
                    <th scope="col" className="px-6 py-3">مکان</th>
                    <th scope="col" className="px-6 py-3">تاریخ بازرسی بعدی</th>
                    <th scope="col" className="px-6 py-3">وضعیت</th>
                    <th scope="col" className="px-6 py-3">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipment.map(eq => (
                    <tr key={eq.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{eq.tag}</td>
                        <td className="px-6 py-4">{getTypeName(eq.typeId)}</td>
                        <td className="px-6 py-4">{eq.location}</td>
                        <td className="px-6 py-4">{eq.nextInspectionDate}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusMap[eq.status].className}`}>{statusMap[eq.status].text}</span></td>
                        <td className="px-6 py-4 space-x-2 space-x-reverse whitespace-nowrap">
                          <button onClick={() => handleOpenModal(eq)} className="p-1.5 text-slate-500 hover:text-secondary-600 hover:bg-secondary-100 rounded-md transition-colors" title="ویرایش"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setEquipmentToDelete(eq)} className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-100 rounded-md transition-colors" title="حذف"><Trash2 className="h-4 w-4" /></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : (
              <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
                  <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="font-semibold text-slate-600">هیچ تجهیزاتی یافت نشد</p>
                  <p className="text-sm mt-1">برای شروع، اولین تجهیزات خود را ثبت کنید.</p>
              </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEquipment ? 'ویرایش تجهیزات' : 'افزودن تجهیزات جدید'} size="3xl">
        <EquipmentForm 
            onSubmit={handleSubmit}
            editingEquipment={editingEquipment}
            equipmentTypes={equipmentTypes}
            onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={!!equipmentToDelete} onClose={() => setEquipmentToDelete(null)} title="تایید حذف تجهیزات" size="md">
          <div className="text-center">
              <p className="text-lg text-slate-700">آیا از حذف تجهیزات با شناسه <span className="font-bold">{equipmentToDelete?.tag}</span> اطمینان دارید؟</p>
              <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                  <button onClick={() => setEquipmentToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                  <button onClick={handleConfirmDelete} className="px-6 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700">حذف</button>
              </div>
          </div>
      </Modal>
    </>
  );
};