import React, { useState } from 'react';
import type { Checklist, ChecklistCategory, ChecklistSubmission } from '../../types';
import { Modal } from '../common/Modal';
import { ChecklistList } from './ChecklistList';
import { PerformChecklistForm } from './PerformChecklistForm';
import { CategoryForm } from './CategoryForm';
import { ChecklistForm } from './ChecklistForm';
import { useNotification } from '../../hooks/useNotification';
import { SubmissionHistory } from './SubmissionHistory';
import { SubmissionDetail } from './SubmissionDetail';
import { ListChecks, History } from 'lucide-react';

interface Props {
  categories: ChecklistCategory[];
  checklists: Checklist[];
  submissions: ChecklistSubmission[];
  onAddSubmission: (submission: Omit<ChecklistSubmission, 'id'>) => void;
  // Management Props
  onAddCategory: (category: Omit<ChecklistCategory, 'id'>) => void;
  onEditCategory: (category: ChecklistCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddChecklist: (checklist: Omit<Checklist, 'id'>) => void;
  onEditChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

type ChecklistView = 'management' | 'history';

export const Checklists: React.FC<Props> = (props) => {
  const [view, setView] = useState<ChecklistView>('management');
  const [checklistToPerform, setChecklistToPerform] = useState<Checklist | null>(null);
  const [submissionToView, setSubmissionToView] = useState<ChecklistSubmission | null>(null);
  
  // State for management modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ChecklistCategory | null>(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [activeCategoryIdForNewChecklist, setActiveCategoryIdForNewChecklist] = useState<string | null>(null);
  
  // State for delete confirmation modals
  const [categoryToDelete, setCategoryToDelete] = useState<ChecklistCategory | null>(null);
  const [checklistToDelete, setChecklistToDelete] = useState<Checklist | null>(null);

  const { addNotification } = useNotification();

  // --- Modal Handlers ---
  const handleOpenCategoryModal = (category: ChecklistCategory | null) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };
  
  const handleOpenChecklistModal = (checklist: Checklist | null, categoryId: string) => {
    setEditingChecklist(checklist);
    setActiveCategoryIdForNewChecklist(categoryId);
    setIsChecklistModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setIsChecklistModalOpen(false);
    setEditingChecklist(null);
    setChecklistToPerform(null);
    setCategoryToDelete(null);
    setChecklistToDelete(null);
    setSubmissionToView(null);
  };

  // --- Submission Handlers ---
  const handleSubmitChecklist = (submission: Omit<ChecklistSubmission, 'id'>) => {
    props.onAddSubmission(submission);
    addNotification('چک‌لیست با موفقیت ثبت شد.', 'success');
    handleCloseModals();
  };

  // --- Management Form Handlers ---
  const handleCategorySubmit = (categoryData: Omit<ChecklistCategory, 'id'>) => {
    if (editingCategory) {
      props.onEditCategory({ ...categoryData, id: editingCategory.id });
      addNotification('دسته بندی با موفقیت ویرایش شد.', 'success');
    } else {
      props.onAddCategory(categoryData);
      addNotification('دسته بندی جدید با موفقیت ایجاد شد.', 'success');
    }
    handleCloseModals();
  };
  
  const handleChecklistSubmit = (checklistData: Omit<Checklist, 'id' | 'categoryId'>, categoryId: string) => {
    if (editingChecklist) {
        props.onEditChecklist({ ...checklistData, id: editingChecklist.id, categoryId: editingChecklist.categoryId });
        addNotification('چک لیست با موفقیت ویرایش شد.', 'success');
    } else {
        props.onAddChecklist({ ...checklistData, categoryId });
        addNotification('چک لیست جدید با موفقیت ایجاد شد.', 'success');
    }
    handleCloseModals();
  };
  
  // --- Delete Handlers ---
  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      props.onDeleteCategory(categoryToDelete.id);
      addNotification(`دسته بندی '${categoryToDelete.name}' حذف شد.`, 'success');
      handleCloseModals();
    }
  };

  const handleConfirmDeleteChecklist = () => {
    if (checklistToDelete) {
      props.onDeleteChecklist(checklistToDelete.id);
      addNotification(`چک لیست '${checklistToDelete.title}' حذف شد.`, 'success');
      handleCloseModals();
    }
  };

  const checklistForSubmission = submissionToView ? props.checklists.find(c => c.id === submissionToView.checklistId) : null;
  const categoryForSubmission = checklistForSubmission ? props.categories.find(c => c.id === checklistForSubmission.categoryId) : null;

  return (
    <>
      <div className="mb-4 bg-white rounded-xl shadow-lg border border-slate-100 p-2 inline-block">
        <nav className="flex items-center justify-start space-x-1 space-x-reverse" aria-label="Checklist Sections">
            <button
              onClick={() => setView('management')}
              className={`py-2 px-4 flex items-center space-x-2 space-x-reverse rounded-lg text-base font-medium transition-colors duration-200 ${
                view === 'management' ? 'bg-secondary-500 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ListChecks className="h-5 w-5" />
              <span>مدیریت چک‌لیست‌ها</span>
            </button>
            <button
              onClick={() => setView('history')}
              className={`py-2 px-4 flex items-center space-x-2 space-x-reverse rounded-lg text-base font-medium transition-colors duration-200 ${
                view === 'history' ? 'bg-secondary-500 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="h-5 w-5" />
              <span>سوابق بازرسی</span>
            </button>
        </nav>
      </div>

      {view === 'management' ? (
        <ChecklistList
            categories={props.categories}
            checklists={props.checklists}
            onPerformChecklist={setChecklistToPerform}
            onAddCategory={() => handleOpenCategoryModal(null)}
            onEditCategory={handleOpenCategoryModal}
            onDeleteCategory={setCategoryToDelete}
            onAddChecklist={handleOpenChecklistModal}
            onEditChecklist={(checklist) => handleOpenChecklistModal(checklist, checklist.categoryId)}
            onDeleteChecklist={setChecklistToDelete}
        />
      ) : (
        <SubmissionHistory
            submissions={props.submissions}
            checklists={props.checklists}
            onViewDetails={setSubmissionToView}
        />
      )}

      {/* Perform Checklist Modal */}
      <Modal isOpen={!!checklistToPerform} onClose={handleCloseModals} title={`اجرای چک‌لیست: ${checklistToPerform?.title}`} size="3xl">
        {checklistToPerform && <PerformChecklistForm checklist={checklistToPerform} onSubmit={handleSubmitChecklist} onClose={handleCloseModals} />}
      </Modal>

       {/* View Submission Details Modal */}
      <Modal isOpen={!!submissionToView} onClose={handleCloseModals} title={`جزئیات بازرسی: ${checklistForSubmission?.title}`} size="3xl">
        {submissionToView && checklistForSubmission && (
          <SubmissionDetail 
            submission={submissionToView}
            checklist={checklistForSubmission}
            categoryName={categoryForSubmission?.name || 'نامشخص'}
          />
        )}
      </Modal>

      {/* Add/Edit Category Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={handleCloseModals} title={editingCategory ? 'ویرایش دسته بندی' : 'ایجاد دسته بندی جدید'}>
        <CategoryForm onSubmit={handleCategorySubmit} editingCategory={editingCategory} onClose={handleCloseModals} />
      </Modal>

      {/* Add/Edit Checklist Modal */}
      <Modal isOpen={isChecklistModalOpen} onClose={handleCloseModals} title={editingChecklist ? 'ویرایش چک لیست' : 'ایجاد چک لیست جدید'} size="3xl">
        {(editingChecklist || activeCategoryIdForNewChecklist) && 
          <ChecklistForm 
            onSubmit={(data) => handleChecklistSubmit(data, editingChecklist ? editingChecklist.categoryId : activeCategoryIdForNewChecklist!)} 
            editingChecklist={editingChecklist} 
            onClose={handleCloseModals} 
          />
        }
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal isOpen={!!categoryToDelete} onClose={handleCloseModals} title="تایید حذف دسته بندی" size="md">
        <div className="text-center">
            <p className="text-lg text-slate-700">آیا از حذف دسته بندی <span className="font-bold">{categoryToDelete?.name}</span> اطمینان دارید؟</p>
            <p className="text-sm text-slate-500 mt-2">با این کار، تمام چک لیست های داخل این دسته بندی نیز حذف خواهند شد.</p>
            <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                <button onClick={handleCloseModals} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button onClick={handleConfirmDeleteCategory} className="px-6 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700">حذف</button>
            </div>
        </div>
      </Modal>
      
      {/* Delete Checklist Confirmation Modal */}
      <Modal isOpen={!!checklistToDelete} onClose={handleCloseModals} title="تایید حذف چک لیست" size="md">
        <div className="text-center">
            <p className="text-lg text-slate-700">آیا از حذف چک لیست <span className="font-bold">{checklistToDelete?.title}</span> اطمینان دارید؟</p>
            <div className="flex justify-center space-x-4 space-x-reverse pt-6">
                <button onClick={handleCloseModals} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button onClick={handleConfirmDeleteChecklist} className="px-6 py-2 bg-danger-600 text-white rounded-md hover:bg-danger-700">حذف</button>
            </div>
        </div>
      </Modal>
    </>
  );
};
