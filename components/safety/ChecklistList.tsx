import React, { useState, useMemo, useEffect } from 'react';
import type { Checklist, ChecklistCategory } from '../../types';
import { ClipboardCheck, ChevronLeft, PlusCircle, FolderPlus, Pencil, Trash2, FilePlus } from 'lucide-react';

interface Props {
  categories: ChecklistCategory[];
  checklists: Checklist[];
  onPerformChecklist: (checklist: Checklist) => void;
  // Management handlers
  onAddCategory: () => void;
  onEditCategory: (category: ChecklistCategory) => void;
  onDeleteCategory: (category: ChecklistCategory) => void;
  onAddChecklist: (checklist: null, categoryId: string) => void;
  onEditChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (checklist: Checklist) => void;
}

export const ChecklistList: React.FC<Props> = (props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    // If there's no selected category or the selected one got deleted, select the first available one.
    if (!selectedCategoryId || !props.categories.find(c => c.id === selectedCategoryId)) {
      setSelectedCategoryId(props.categories[0]?.id || null);
    }
  }, [props.categories, selectedCategoryId]);

  const filteredChecklists = useMemo(() => {
    if (!selectedCategoryId) return [];
    return props.checklists.filter(c => c.categoryId === selectedCategoryId);
  }, [props.checklists, selectedCategoryId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[calc(100vh-350px)]">
      {/* Categories Column */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-lg border border-slate-200/80 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-slate-700">دسته‌بندی‌ها</h3>
          <button onClick={props.onAddCategory} className="p-2 text-primary-600 hover:bg-primary-100 rounded-full transition-colors" title="ایجاد دسته بندی جدید">
            <FolderPlus className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto">
          {props.categories.length > 0 ? props.categories.map(category => (
            <div
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`w-full text-right p-2 pr-3 rounded-lg font-semibold flex justify-between items-center transition-colors cursor-pointer group ${
                selectedCategoryId === category.id
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{category.name}</span>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => props.onEditCategory(category)} className="p-1.5 hover:bg-black/10 rounded-md" title="ویرایش"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => props.onDeleteCategory(category)} className="p-1.5 hover:bg-black/10 rounded-md" title="حذف"><Trash2 className="h-4 w-4" /></button>
                {selectedCategoryId === category.id && <ChevronLeft className="h-5 w-5" />}
              </div>
               {selectedCategoryId === category.id && <ChevronLeft className="h-5 w-5 group-hover:hidden" />}
            </div>
          )) : (
            <div className="text-center text-slate-500 pt-10">
              <p>هیچ دسته‌بندی یافت نشد.</p>
              <button onClick={props.onAddCategory} className="mt-4 text-primary-600 font-semibold">یک دسته بندی جدید بسازید</button>
            </div>
          )}
        </nav>
      </div>

      {/* Checklists Column */}
      <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-lg border border-slate-200/80 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="text-xl font-bold text-slate-700">
            {props.categories.find(c => c.id === selectedCategoryId)?.name || 'چک لیست ها'}
            </h3>
            {selectedCategoryId && (
                <button onClick={() => props.onAddChecklist(null, selectedCategoryId)} className="bg-secondary-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-secondary-600 transition flex items-center space-x-2 space-x-reverse">
                    <FilePlus className="h-5 w-5" />
                    <span>چک لیست جدید</span>
                </button>
            )}
        </div>
        <div className="flex-grow overflow-y-auto">
            {selectedCategoryId ? (
            filteredChecklists.length > 0 ? (
            <div className="space-y-3">
                {filteredChecklists.map(checklist => (
                <div key={checklist.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center group">
                    <div>
                    <h4 className="font-bold text-slate-800">{checklist.title}</h4>
                    <p className="text-sm text-slate-500">{checklist.items.length} آیتم</p>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => props.onEditChecklist(checklist)} className="p-1.5 text-slate-500 hover:text-secondary-600 hover:bg-secondary-100 rounded-md transition-colors" title="ویرایش"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => props.onDeleteChecklist(checklist)} className="p-1.5 text-slate-500 hover:text-danger-600 hover:bg-danger-100 rounded-md transition-colors" title="حذف"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <button onClick={() => props.onPerformChecklist(checklist)} className="bg-secondary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-600 transition flex items-center space-x-2 space-x-reverse">
                            <ClipboardCheck className="h-5 w-5" />
                            <span>اجرا</span>
                        </button>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center text-slate-500 py-10">
                <p>هیچ چک‌لیستی در این دسته یافت نشد.</p>
            </div>
            )
        ) : (
            <div className="text-center text-slate-500 py-10">
                <p>برای مشاهده یا ایجاد چک لیست، لطفا یک دسته‌بندی را انتخاب کنید.</p>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};
