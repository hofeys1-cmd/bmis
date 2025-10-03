
import React from 'react';
import type { Personnel, MedicalRecord } from '../../types';
import { DocumentPlusIcon } from '../icons/DocumentPlusIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { FileText } from 'lucide-react';

interface Props {
  personnel: Personnel | null;
  records: MedicalRecord[];
  onAddRecord: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-base text-slate-800 font-semibold">{value || '-'}</p>
    </div>
);

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

export const PersonnelDetailView: React.FC<Props> = ({ personnel, records, onAddRecord }) => {
  if (!personnel) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 h-full flex flex-col items-center justify-center text-center p-8">
        <UserCircleIcon className="h-20 w-20 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">انتخاب پرسنل</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          برای مشاهده اطلاعات و سوابق پزشکی، لطفا یک شخص را از لیست پرسنل انتخاب کنید.
        </p>
      </div>
    );
  }

  const sortedRecords = [...records].sort((a, b) => b.examDate.localeCompare(a.examDate));

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 h-full flex flex-col">
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
            <h2 className="text-xl font-bold text-slate-700">
                پرونده پزشکی: {personnel.firstName} {personnel.lastName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 mt-2">
                <DetailItem label="کد ملی" value={personnel.nationalId} />
                <DetailItem label="کد پرسنلی" value={personnel.personnelId} />
                <DetailItem label="سمت" value={personnel.position} />
                <DetailItem label="تاریخ استخدام" value={personnel.hireDate || '-'} />
            </div>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-700">تاریخچه معاینات</h3>
                <button
                  onClick={onAddRecord}
                  className="bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors shadow hover:shadow-lg flex items-center space-x-2 space-x-reverse"
                  aria-label="افزودن سابقه جدید"
                >
                  <DocumentPlusIcon />
                  <span>ثبت پرونده جدید</span>
                </button>
            </div>
             <div className="space-y-3">
                {sortedRecords.length === 0 ? (
                  <div className="text-center text-slate-500 py-10">
                    <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <p className="font-semibold text-slate-600">هیچ سابقه پزشکی ثبت نشده است</p>
                    <p className="text-sm mt-1">برای شروع، یک پرونده پزشکی جدید برای این پرسنل ثبت کنید.</p>
                  </div>
                ) : (
                  sortedRecords.map(record => (
                    <div key={record.id} className="bg-slate-50 p-4 rounded-md shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-slate-800">معاینه مورخ: {record.examDate}</p>
                        {getStatusChip(record.physicianOpinion.status)}
                      </div>
                       <p className="text-sm text-slate-600 mt-2">
                        <span className="font-medium text-slate-800">نظر پزشک: </span>
                        {record.physicianOpinion.specialistOpinion || 'ثبت نشده'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium text-slate-800">توصیه‌ها: </span>
                        {record.physicianOpinion.recommendations || 'ثبت نشده'}
                      </p>
                       <p className="text-sm text-slate-500 mt-2">معاینه بعدی: {record.nextExamDate}</p>
                    </div>
                  ))
                )}
            </div>
        </div>
    </div>
  );
};