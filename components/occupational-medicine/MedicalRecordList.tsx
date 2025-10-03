import React from 'react';
import type { Personnel, MedicalRecord } from '../../types';
import { DocumentPlusIcon } from '../icons/DocumentPlusIcon';

interface Props {
  personnel: Personnel | null;
  records: MedicalRecord[];
  onAddRecord: () => void;
}

export const MedicalRecordList: React.FC<Props> = ({ personnel, records, onAddRecord }) => {
  if (!personnel) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border h-full flex items-center justify-center">
        <p className="text-gray-500">لطفا برای مشاهده سوابق پزشکی، یک پرسنل را انتخاب کنید.</p>
      </div>
    );
  }

  const getStatusChip = (status: 'unrestricted' | 'conditional') => {
    const isUnrestricted = status === 'unrestricted';
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
        isUnrestricted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isUnrestricted ? 'بلامانع' : 'مشروط'}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-700">سوابق پزشکی: {personnel.firstName} {personnel.lastName}</h3>
        <button
          onClick={onAddRecord}
          className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors shadow hover:shadow-lg flex items-center space-x-2 space-x-reverse"
          aria-label="افزودن سابقه جدید"
        >
          <DocumentPlusIcon />
          <span>ثبت پرونده جدید</span>
        </button>
      </div>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {records.length === 0 ? (
          <p className="text-center text-gray-500 py-4">هیچ سابقه پزشکی برای این پرسنل ثبت نشده است.</p>
        ) : (
          records.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()).map(record => (
            <div key={record.id} className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">معاینه مورخ: {new Date(record.examDate).toLocaleDateString('fa-IR')}</p>
                {getStatusChip(record.physicianOpinion.status)}
              </div>
               <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium text-gray-800">نظر پزشک: </span>
                {record.physicianOpinion.specialistOpinion || 'ثبت نشده'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-800">توصیه‌ها: </span>
                {record.physicianOpinion.recommendations || 'ثبت نشده'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
