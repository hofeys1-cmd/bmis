import React, { useState } from 'react';
import type { Incident, ChecklistCategory, Checklist, ChecklistSubmission } from '../../types';
import { IncidentLog } from './IncidentLog';
import { Checklists } from './Checklists';
import { ShieldAlert, ListChecks } from 'lucide-react';

interface Props {
  incidents: Incident[];
  onAddIncident: (incident: Omit<Incident, 'id'>) => void;
  // Checklist Submissions
  checklistCategories: ChecklistCategory[];
  checklists: Checklist[];
  checklistSubmissions: ChecklistSubmission[];
  onAddChecklistSubmission: (submission: Omit<ChecklistSubmission, 'id'>) => void;
  // Checklist & Category Management
  onAddCategory: (category: Omit<ChecklistCategory, 'id'>) => void;
  onEditCategory: (category: ChecklistCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddChecklist: (checklist: Omit<Checklist, 'id'>) => void;
  onEditChecklist: (checklist: Checklist) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

type SafetyTab = 'incidents' | 'checklists';

export const Safety: React.FC<Props> = (props) => {
  const [activeTab, setActiveTab] = useState<SafetyTab>('incidents');
  
  const TABS = [
      { 
        id: 'incidents', 
        label: 'گزارش حوادث', 
        icon: <ShieldAlert className="h-5 w-5" />, 
        component: <IncidentLog incidents={props.incidents} onAddIncident={props.onAddIncident} /> 
      },
      { 
        id: 'checklists', 
        label: 'چک لیست ها', 
        icon: <ListChecks className="h-5 w-5" />, 
        component: (
          <Checklists 
            categories={props.checklistCategories}
            checklists={props.checklists}
            submissions={props.checklistSubmissions}
            onAddSubmission={props.onAddChecklistSubmission}
            onAddCategory={props.onAddCategory}
            onEditCategory={props.onEditCategory}
            onDeleteCategory={props.onDeleteCategory}
            onAddChecklist={props.onAddChecklist}
            onEditChecklist={props.onEditChecklist}
            onDeleteChecklist={props.onDeleteChecklist}
          />
        )
      },
  ];
  
  const activeComponent = TABS.find(tab => tab.id === activeTab)?.component;
  
  return (
    <div className="animate-fade-in-scale">
       <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-100 p-2 inline-block">
        <nav className="flex items-center justify-start space-x-1 space-x-reverse" aria-label="Safety Sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SafetyTab)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`py-2 px-4 flex items-center space-x-2 space-x-reverse rounded-lg text-base font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div role="tabpanel">
        {activeComponent}
      </div>
    </div>
  );
};