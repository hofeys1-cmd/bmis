import React, { useState, useEffect } from 'react';
import type { Checklist, ChecklistItem } from '../../types';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Props {
  onSubmit: (checklist: Omit<Checklist, 'id' | 'categoryId'>) => void;
  editingChecklist: Checklist | null;
  onClose: () => void;
}

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";
type FormItem = Omit<ChecklistItem, 'id'> & { tempId: number };

export const ChecklistForm: React.FC<Props> = ({ onSubmit, editingChecklist, onClose }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<FormItem[]>([]);

  useEffect(() => {
    if (editingChecklist) {
      setTitle(editingChecklist.title);
      setItems(editingChecklist.items.map((item, index) => ({ text: item.text, tempId: index })));
    } else {
      setTitle('');
      setItems([{ text: '', tempId: 0 }]);
    }
  }, [editingChecklist]);

  const handleItemChange = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index].text = text;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { text: '', tempId: Date.now() }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
        setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItems = items.filter(item => item.text.trim() !== '').map(({text}) => ({ text, id: ''})); // Remove tempId and empty items, id will be set in parent
    if (title.trim() && finalItems.length > 0) {
      onSubmit({ title, items: finalItems });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="checklistTitle" className="block text-sm font-medium text-slate-700 mb-1.5">
          عنوان چک لیست
        </label>
        <input
          type="text"
          id="checklistTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={baseInputClasses}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          آیتم های چک لیست
        </label>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {items.map((item, index) => (
            <div key={item.tempId} className="flex items-center space-x-2 space-x-reverse">
              <span className="text-slate-500 font-semibold">{index + 1}.</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className={baseInputClasses}
                placeholder={`متن آیتم شماره ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-2 text-danger-500 hover:bg-danger-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length <= 1}
                title="حذف آیتم"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-4 flex items-center space-x-2 space-x-reverse text-primary-600 font-semibold hover:text-primary-800"
        >
          <PlusCircle className="h-5 w-5" />
          <span>افزودن آیتم جدید</span>
        </button>
      </div>

      <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">
          انصراف
        </button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          {editingChecklist ? 'ذخیره تغییرات' : 'ایجاد چک لیست'}
        </button>
      </div>
    </form>
  );
};
