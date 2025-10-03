import React, { useState, useMemo } from 'react';
import type { Checklist, ChecklistSubmission } from '../../types';
import { Search, Archive } from 'lucide-react';

interface Props {
  submissions: ChecklistSubmission[];
  checklists: Checklist[];
  onViewDetails: (submission: ChecklistSubmission) => void;
}

export const SubmissionHistory: React.FC<Props> = ({ submissions, checklists, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const submissionsWithDetails = useMemo(() => {
    return submissions.map(sub => {
      const checklist = checklists.find(c => c.id === sub.checklistId);
      return {
        ...sub,
        checklistTitle: checklist?.title || 'چک‌لیست حذف شده',
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [submissions, checklists]);

  const filteredSubmissions = useMemo(() => {
    if (!searchTerm) return submissionsWithDetails;
    const lowercasedTerm = searchTerm.toLowerCase();
    return submissionsWithDetails.filter(sub =>
      sub.checklistTitle.toLowerCase().includes(lowercasedTerm) ||
      sub.location.toLowerCase().includes(lowercasedTerm) ||
      sub.performedBy.toLowerCase().includes(lowercasedTerm)
    );
  }, [submissionsWithDetails, searchTerm]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 min-h-[calc(100vh-350px)] flex flex-col">
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
        <div className="relative">
          <input
            type="search"
            placeholder="جستجو در سوابق (نام چک‌لیست، مکان، بازرس...)"
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
        {filteredSubmissions.length > 0 ? (
          <div className="space-y-3">
            {filteredSubmissions.map(sub => (
              <div
                key={sub.id}
                onClick={() => onViewDetails(sub)}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800">{sub.checklistTitle}</h4>
                    <p className="text-sm text-slate-500">بازرس: {sub.performedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{sub.location}</p>
                    <p className="text-xs text-slate-500">{sub.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
            <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="font-semibold text-slate-600">هیچ سابقه‌ای یافت نشد</p>
            <p className="text-sm mt-1">با جستجوی عبارت دیگر امتحان کنید یا یک بازرسی جدید انجام دهید.</p>
          </div>
        )}
      </div>
    </div>
  );
};
