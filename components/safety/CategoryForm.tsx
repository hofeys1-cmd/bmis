import React, { useState, useEffect } from 'react';
import type { ChecklistCategory } from '../../types';

interface Props {
  onSubmit: (category: Omit<ChecklistCategory, 'id'>) => void;
  editingCategory: ChecklistCategory | null;
  onClose: () => void;
}

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";

export const CategoryForm: React.FC<Props> = ({ onSubmit, editingCategory, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-1.5">
          نام دسته بندی
        </label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={baseInputClasses}
          required
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
          انصراف
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          {editingCategory ? 'ذخیره تغییرات' : 'ایجاد'}
        </button>
      </div>
    </form>
  );
};
