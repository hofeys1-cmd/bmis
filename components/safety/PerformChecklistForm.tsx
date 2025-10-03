import React, { useState } from 'react';
// FIX: Add ChecklistSubmission to type imports to resolve 'Cannot find name' errors.
import type { Checklist, ChecklistSubmission, ChecklistSubmissionItem, ChecklistSubmissionStatus } from '../../types';
import { Check, X, Minus } from 'lucide-react';

interface Props {
  checklist: Checklist;
  onSubmit: (submission: Omit<ChecklistSubmission, 'id'>) => void;
  onClose: () => void;
}

type AnswersState = Record<string, { status: ChecklistSubmissionStatus; comment: string }>;

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";

const StatusButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  activeClass: string;
}> = ({ label, icon, isActive, onClick, activeClass }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 px-3 rounded-md font-semibold transition-all duration-200 border-2 ${
      isActive ? `${activeClass} shadow` : 'bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);


export const PerformChecklistForm: React.FC<Props> = ({ checklist, onSubmit, onClose }) => {
  const [answers, setAnswers] = useState<AnswersState>(() => {
    const initialState: AnswersState = {};
    checklist.items.forEach(item => {
      initialState[item.id] = { status: 'na', comment: '' };
    });
    return initialState;
  });
  const [location, setLocation] = useState('');
  const [performedBy, setPerformedBy] = useState('');


  const handleStatusChange = (itemId: string, status: ChecklistSubmissionStatus) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], status },
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment },
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionItems: ChecklistSubmissionItem[] = Object.entries(answers).map(([itemId, answer]) => ({
      itemId,
      status: answer.status,
      comment: answer.comment,
    }));

    const submission: Omit<ChecklistSubmission, 'id'> = {
      checklistId: checklist.id,
      date: new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date()),
      location,
      performedBy,
      items: submissionItems,
    };
    onSubmit(submission);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5">مکان بازرسی</label>
                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className={baseInputClasses} required />
            </div>
            <div>
                <label htmlFor="performedBy" className="block text-sm font-medium text-slate-700 mb-1.5">بازرس</label>
                <input type="text" id="performedBy" value={performedBy} onChange={e => setPerformedBy(e.target.value)} className={baseInputClasses} required />
            </div>
       </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {checklist.items.map((item, index) => (
          <div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="font-semibold text-slate-800 mb-3">{index + 1}. {item.text}</p>
            <div className="flex items-center space-x-2 space-x-reverse">
                <StatusButton
                    label="مطلوب"
                    icon={<Check className="h-5 w-5" />}
                    isActive={answers[item.id].status === 'pass'}
                    onClick={() => handleStatusChange(item.id, 'pass')}
                    activeClass="bg-success-500 border-success-800 text-white"
                />
                <StatusButton
                    label="نامطلوب"
                    icon={<X className="h-5 w-5" />}
                    isActive={answers[item.id].status === 'fail'}
                    onClick={() => handleStatusChange(item.id, 'fail')}
                    activeClass="bg-danger-500 border-danger-700 text-white"
                />
                <StatusButton
                    label="مورد ندارد"
                    icon={<Minus className="h-5 w-5" />}
                    isActive={answers[item.id].status === 'na'}
                    onClick={() => handleStatusChange(item.id, 'na')}
                    activeClass="bg-slate-500 border-slate-700 text-white"
                />
            </div>
            {answers[item.id].status === 'fail' && (
              <div className="mt-3">
                 <label htmlFor={`comment-${item.id}`} className="block text-sm font-medium text-slate-700 mb-1.5">توضیحات/اقدام اصلاحی</label>
                <textarea
                  id={`comment-${item.id}`}
                  value={answers[item.id].comment}
                  onChange={e => handleCommentChange(item.id, e.target.value)}
                  placeholder="توضیحات مورد نیاز را اینجا وارد کنید..."
                  className={baseInputClasses}
                  rows={2}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">ثبت چک‌لیست</button>
      </div>
    </form>
  );
};