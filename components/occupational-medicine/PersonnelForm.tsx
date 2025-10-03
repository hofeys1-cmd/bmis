
import React, { useState } from 'react';
import type { Personnel } from '../../types';

interface Props {
  onAddPersonnel: (personnel: Omit<Personnel, 'id'>) => void;
  onClose: () => void;
}

const initialState = {
  firstName: '',
  lastName: '',
  nationalId: '',
  personnelId: '',
  hireDate: '',
  position: '',
};

const validateJalaliDateString = (input: string): string => {
    let value = input.replace(/[^\d/]/g, '');
    const parts = value.split('/');

    if (parts[0]) parts[0] = parts[0].substring(0, 4);

    if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
        if (parts[1].length === 2 && parseInt(parts[1], 10) === 0) parts[1] = '01';
        if (parseInt(parts[1], 10) > 12) parts[1] = '12';
    }

    if (parts[2]) {
        parts[2] = parts[2].substring(0, 2);
        if (parts[2].length === 2 && parseInt(parts[2], 10) === 0) parts[2] = '01';
        if (parseInt(parts[2], 10) > 31) parts[2] = '31';
    }
    
    return parts.slice(0, 3).join('/');
};


export const PersonnelForm: React.FC<Props> = ({ onAddPersonnel, onClose }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'hireDate') {
        setFormData(prev => ({ ...prev, hireDate: validateJalaliDateString(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPersonnel(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">نام</label>
          <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">نام خانوادگی</label>
          <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-slate-700 mb-1.5">کد ملی</label>
          <input type="text" name="nationalId" id="nationalId" value={formData.nationalId} onChange={handleChange} className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="personnelId" className="block text-sm font-medium text-slate-700 mb-1.5">کد پرسنلی</label>
          <input type="text" name="personnelId" id="personnelId" value={formData.personnelId} onChange={handleChange} className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
         <div>
          <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1.5">سمت</label>
          <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
        <div>
          <label htmlFor="hireDate" className="block text-sm font-medium text-slate-700 mb-1.5">تاریخ استخدام</label>
          <input type="text" name="hireDate" id="hireDate" value={formData.hireDate} onChange={handleChange} placeholder="مثال: 1403/05/21" className="block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500" required />
        </div>
      </div>
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">ثبت پرسنل</button>
      </div>
    </form>
  );
};