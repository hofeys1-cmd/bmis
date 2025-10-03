import React from 'react';
import type { Checklist, ChecklistSubmission, ChecklistSubmissionStatus } from '../../types';
import { Check, X, Minus, MessageSquare } from 'lucide-react';

interface Props {
  submission: ChecklistSubmission;
  checklist: Checklist;
  categoryName: string;
}

const StatusDisplay: React.FC<{ status: ChecklistSubmissionStatus }> = ({ status }) => {
  const statusConfig = {
    pass: { icon: <Check className="h-5 w-5" />, text: 'مطلوب', className: 'bg-success-100 text-success-800' },
    fail: { icon: <X className="h-5 w-5" />, text: 'نامطلوب', className: 'bg-danger-100 text-danger-700' },
    na: { icon: <Minus className="h-5 w-5" />, text: 'مورد ندارد', className: 'bg-slate-200 text-slate-600' },
  };
  const config = statusConfig[status];
  return (
    <span className={`flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full font-semibold text-sm ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

export const SubmissionDetail: React.FC<Props> = ({ submission, checklist, categoryName }) => {

  const itemsMap = new Map(checklist.items.map(item => [item.id, item.text]));

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">بازرس</p>
          <p className="text-base text-slate-800 font-semibold">{submission.performedBy}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">مکان</p>
          <p className="text-base text-slate-800 font-semibold">{submission.location}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">تاریخ</p>
          <p className="text-base text-slate-800 font-semibold">{submission.date}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">دسته بندی</p>
          <p className="text-base text-slate-800 font-semibold">{categoryName}</p>
        </div>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 border-t pt-4">
        <h4 className="text-lg font-bold text-slate-800 mb-2">آیتم‌های بررسی شده</h4>
        {submission.items.map((item, index) => {
          const itemText = itemsMap.get(item.itemId) || 'آیتم حذف شده';
          return (
            <div key={item.itemId} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-700">{index + 1}. {itemText}</p>
                <StatusDisplay status={item.status} />
              </div>
              {item.status === 'fail' && item.comment && (
                <div className="mt-2 p-2 bg-warning-50 border-r-4 border-warning-500 flex items-start space-x-2 space-x-reverse">
                    <MessageSquare className="h-4 w-4 text-warning-800 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{item.comment}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
