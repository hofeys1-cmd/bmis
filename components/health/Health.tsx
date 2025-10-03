import React, { useState } from 'react';
import type { Personnel, MedicalRecord } from '../../types';
import { OccupationalMedicine } from '../occupational-medicine/OccupationalMedicine';
import { Monitoring } from './Monitoring';
import { Stethoscope, BarChart3 } from 'lucide-react';

interface Props {
  personnelList: Personnel[];
  medicalRecords: MedicalRecord[];
  onAddPersonnel: (personnel: Omit<Personnel, 'id'>) => void;
  onAddMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
}

type HealthTab = 'occupationalMedicine' | 'monitoring';

export const Health: React.FC<Props> = ({ personnelList, medicalRecords, onAddPersonnel, onAddMedicalRecord }) => {
  const [activeTab, setActiveTab] = useState<HealthTab>('occupationalMedicine');

  const TABS = [
    {
      id: 'occupationalMedicine',
      label: 'طب کار پرسنل',
      icon: <Stethoscope className="h-5 w-5" />,
      component: (
        <OccupationalMedicine
          personnelList={personnelList}
          medicalRecords={medicalRecords}
          onAddPersonnel={onAddPersonnel}
          onAddMedicalRecord={onAddMedicalRecord}
        />
      ),
    },
    {
      id: 'monitoring',
      label: 'پایش ها',
      icon: <BarChart3 className="h-5 w-5" />,
      component: <Monitoring />,
    },
  ];

  const activeComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="animate-fade-in-scale">
      <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-100 p-2 inline-block">
        <nav className="flex items-center justify-start space-x-1 space-x-reverse" aria-label="Health Sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HealthTab)}
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