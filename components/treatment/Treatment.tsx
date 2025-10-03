
import React, { useState, useMemo } from 'react';
import type { Personnel, VisitRecord, Medicine } from '../../types';
import { VisitForm } from './VisitForm';
import { Pharmacy } from '../pharmacy/Pharmacy';
import { Modal } from '../common/Modal';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { PillIcon } from '../icons/PillIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { Search, Archive, Pencil, Trash2 } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

interface Props {
  personnelList: Personnel[];
  visitRecords: VisitRecord[];
  medicines: Medicine[];
  onAddVisit: (visit: Omit<VisitRecord, 'id'>) => void;
  onEditVisit: (visit: VisitRecord) => void;
  onDeleteVisit: (visitId: string) => void;
  onAddMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  onEditMedicine: (medicine: Medicine) => void;
}

const VisitHistory: React.FC<{
    visitRecords: VisitRecord[]; 
    personnelList: Personnel[];
    onEdit: (visit: VisitRecord) => void;
    onDelete: (visit: VisitRecord) => void;
}> = ({ visitRecords, personnelList, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getPatientName = (record: VisitRecord) => {
        if (record.patientType === 'complex' && record.personnelId) {
          const personnel = personnelList.find(p => p.id === record.personnelId);
          return personnel ? `${personnel.firstName} ${personnel.lastName}` : 'پرسنل یافت نشد';
        }
        if (record.patientType === 'contractor' && record.contractorInfo) {
          return `${record.contractorInfo.firstName} ${record.contractorInfo.lastName} (پیمانکار)`;
        }
        return 'نامشخص';
    };

    const filteredRecords = useMemo(() => {
        if (!searchTerm) return visitRecords;
        const lowercasedTerm = searchTerm.toLowerCase();
        return visitRecords.filter(record => {
            const patientName = getPatientName(record).toLowerCase();
            const reason = record.reason.toLowerCase();
            const diagnosis = record.diagnosis.toLowerCase();
            return patientName.includes(lowercasedTerm) || reason.includes(lowercasedTerm) || diagnosis.includes(lowercasedTerm);
        });
    }, [visitRecords, searchTerm, personnelList]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
                <h3 className="text-xl font-bold text-slate-700">تاریخچه مراجعات</h3>
            </div>
            <div className="p-4 border-b border-slate-200/80">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="جستجو در مراجعات (نام بیمار، علت، تشخیص...)"
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
                {filteredRecords.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRecords.map(record => (
                            <div key={record.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-800">{getPatientName(record)}</p>
                                        <p className="text-sm text-slate-500">{record.visitDate}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <button onClick={() => onEdit(record)} className="p-1.5 text-slate-500 hover:text-secondary-600 hover:bg-secondary-100 rounded-md transition-colors" title="ویرایش"><Pencil className="h-4 w-4" /></button>
                                        <button onClick={() => onDelete(record)} className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-100 rounded-md transition-colors" title="حذف"><Trash2 className="h-4 w-4" /></button>
                                        <span className="text-xs font-semibold px-2 py-1 bg-primary-100 text-primary-800 rounded-full">{record.reason}</span>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">تشخیص:</span> {record.diagnosis}</p>
                                <p className="mt-1 text-sm text-slate-600"><span className="font-semibold">توصیه‌ها:</span> {record.recommendations || 'ندارد'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center text-slate-500 py-10">
                        <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <p className="font-semibold text-slate-600">هیچ مراجعه‌ای یافت نشد</p>
                        <p className="text-sm mt-1">با جستجوی عبارت دیگر امتحان کنید یا یک مراجعه جدید ثبت کنید.</p>
                     </div>
                )}
            </div>
        </div>
    )
};

type TreatmentView = 'history' | 'pharmacy';

export const Treatment: React.FC<Props> = (props) => {
  const [view, setView] = useState<TreatmentView>('history');
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<VisitRecord | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<VisitRecord | null>(null);
  const { addNotification } = useNotification();

  const handleOpenAddModal = () => {
      setEditingVisit(null);
      setIsVisitModalOpen(true);
  }

  const handleOpenEditModal = (visit: VisitRecord) => {
      setEditingVisit(visit);
      setIsVisitModalOpen(true);
  }

  const handleCloseVisitModal = () => {
      setIsVisitModalOpen(false);
      setEditingVisit(null);
  }

  const handleConfirmDelete = () => {
    if (visitToDelete) {
        props.onDeleteVisit(visitToDelete.id);
        addNotification('مراجعه با موفقیت حذف شد.', 'success');
        setVisitToDelete(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">بخش درمان</h3>
            <div className="space-y-2">
                <button 
                    onClick={() => setView('history')}
                    className={`w-full flex items-center space-x-2 space-x-reverse p-3 rounded-lg text-right transition-colors ${view === 'history' ? 'bg-primary-100/80 text-primary-700' : 'hover:bg-slate-100'}`}
                >
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                    <span className="font-semibold">تاریخچه مراجعات</span>
                </button>
                 <button 
                    onClick={() => setView('pharmacy')}
                    className={`w-full flex items-center space-x-2 space-x-reverse p-3 rounded-lg text-right transition-colors ${view === 'pharmacy' ? 'bg-primary-100/80 text-primary-700' : 'hover:bg-slate-100'}`}
                >
                    <PillIcon />
                    <span className="font-semibold">داروخانه</span>
                </button>
            </div>
        </div>
        <button 
            onClick={handleOpenAddModal}
            className="w-full bg-primary-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 space-x-reverse shadow-lg"
        >
            <PlusCircleIcon />
            <span>ثبت مراجعه جدید</span>
        </button>
      </div>

      <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 min-h-[calc(100vh-250px)]">
            {view === 'history' && <VisitHistory visitRecords={props.visitRecords} personnelList={props.personnelList} onEdit={handleOpenEditModal} onDelete={setVisitToDelete} />}
            {view === 'pharmacy' && <Pharmacy medicines={props.medicines} onAddMedicine={props.onAddMedicine} onEditMedicine={props.onEditMedicine} />}
          </div>
      </div>
      
      <Modal 
        isOpen={isVisitModalOpen} 
        onClose={handleCloseVisitModal}
        title={editingVisit ? "ویرایش مراجعه" : "ثبت مراجعه جدید"}
        size="3xl"
      >
        <VisitForm 
            onAddVisit={props.onAddVisit}
            onEditVisit={props.onEditVisit}
            editingVisit={editingVisit}
            personnelList={props.personnelList} 
            medicines={props.medicines}
            onClose={handleCloseVisitModal}
        />
      </Modal>

       <Modal 
          isOpen={!!visitToDelete} 
          onClose={() => setVisitToDelete(null)} 
          title="تایید حذف مراجعه"
          size="md"
      >
          <div className="text-center">
              <p className="text-lg text-slate-700">
                  آیا از حذف این مراجعه اطمینان دارید؟
              </p>
              <p className="text-sm text-slate-500 mt-2">این عملیات موجودی داروهای تجویز شده را به انبار باز می‌گرداند.</p>
              <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                  <button 
                      onClick={() => setVisitToDelete(null)} 
                      className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
                  >
                      انصراف
                  </button>
                  <button 
                      onClick={handleConfirmDelete} 
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