
import React from 'react';
import type { Personnel } from '../../types';
import { UserPlusIcon } from '../icons/UserPlusIcon';
import { MagnifyingGlassIcon } from '../icons/MagnifyingGlassIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { SearchX } from 'lucide-react';

interface Props {
  personnelList: Personnel[];
  selectedPersonnelId?: string;
  onSelectPersonnel: (personnel: Personnel) => void;
  onAddPersonnel: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const PersonnelList: React.FC<Props> = ({
  personnelList,
  selectedPersonnelId,
  onSelectPersonnel,
  onAddPersonnel,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-700">لیست پرسنل</h3>
          <button
            onClick={onAddPersonnel}
            className="bg-primary-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 space-x-reverse"
            title="افزودن پرسنل جدید"
          >
            <UserPlusIcon />
            <span className="hidden sm:inline">جدید</span>
          </button>
        </div>
      </div>
       <div className="p-4 border-b border-slate-200/80">
        <div className="relative">
          <input
            type="search"
            placeholder="جستجو (نام، کد ملی...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <MagnifyingGlassIcon />
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {personnelList.length > 0 ? (
          <ul>
            {personnelList.map((personnel) => (
              <li key={personnel.id}>
                <button
                  onClick={() => onSelectPersonnel(personnel)}
                  className={`w-full text-right p-4 border-b border-slate-100 flex items-center space-x-3 space-x-reverse transition-colors ${
                    selectedPersonnelId === personnel.id
                      ? 'bg-primary-100/50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <UserCircleIcon className="h-10 w-10 text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {personnel.firstName} {personnel.lastName}
                    </p>
                    <p className="text-sm text-slate-500">کد پرسنلی: {personnel.personnelId}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-slate-500 p-10 flex flex-col items-center justify-center h-full">
            <SearchX className="h-16 w-16 text-slate-300 mb-4" />
            <p className="font-bold text-slate-600">پرسنلی یافت نشد</p>
            <p className="text-sm mt-1">با جستجوی عبارت دیگر امتحان کنید یا پرسنل جدیدی اضافه کنید.</p>
        </div>
        )}
      </div>
    </div>
  );
};