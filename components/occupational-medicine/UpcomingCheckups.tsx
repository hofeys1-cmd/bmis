
import React from 'react';
import type { DuePersonnelInfo, Personnel } from '../../types';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

interface Props {
  duePersonnel: DuePersonnelInfo[];
  onSelectPersonnel: (personnel: Personnel) => void;
}

const getStatusInfo = (status: 'overdue' | 'dueSoon' | 'needsFirst') => {
  switch (status) {
    case 'overdue':
      return {
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-danger-500" />,
        text: 'معوق',
        className: 'text-danger-600',
      };
    case 'dueSoon':
      return {
        icon: <CalendarDaysIcon className="h-5 w-5 text-yellow-500" />,
        text: 'نزدیک',
        className: 'text-yellow-600',
      };
    case 'needsFirst':
      return {
        icon: <CheckCircleIcon className="h-5 w-5 text-blue-500" />,
        text: 'معاینه بدو استخدام',
        className: 'text-blue-600',
      };
  }
};

export const UpcomingCheckups: React.FC<Props> = ({ duePersonnel, onSelectPersonnel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80">
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
        <h3 className="text-xl font-bold text-slate-700">معاینات پیش رو</h3>
      </div>
      <div className="p-2">
        <div className="space-y-1 max-h-[25vh] overflow-y-auto">
            {duePersonnel.length > 0 ? (
            duePersonnel.map(({ personnel, status, nextDueDate }) => {
                const statusInfo = getStatusInfo(status);
                return (
                <button
                    key={personnel.id}
                    onClick={() => onSelectPersonnel(personnel)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-100 transition-colors text-right"
                >
                    <div className="flex items-center space-x-3 space-x-reverse">
                    {statusInfo.icon}
                    <div>
                        <p className="font-semibold text-sm text-slate-700">{personnel.firstName} {personnel.lastName}</p>
                        <p className={`text-xs font-medium ${statusInfo.className}`}>{statusInfo.text}</p>
                    </div>
                    </div>
                    {nextDueDate && (
                    <p className="text-xs text-slate-500">{nextDueDate}</p>
                    )}
                </button>
                );
            })
            ) : (
            <p className="text-center text-slate-500 py-4 text-sm">موردی برای نمایش وجود ندارد.</p>
            )}
        </div>
      </div>
    </div>
  );
};