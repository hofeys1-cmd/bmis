import React, { useState } from 'react';
import type { FireEquipment, FireEquipmentTypeConfig } from '../../types';
import { EquipmentManagement } from './EquipmentManagement';
import { TrainingDrills } from './TrainingDrills';
import { EquipmentTypeManagement } from './EquipmentTypeManagement';
import { HardHat, GraduationCap, Settings } from 'lucide-react';

interface Props {
  equipmentList: FireEquipment[];
  onAddEquipment: (equipment: Omit<FireEquipment, 'id'>) => void;
  onEditEquipment: (equipment: FireEquipment) => void;
  onDeleteEquipment: (equipmentId: string) => void;
  equipmentTypes: FireEquipmentTypeConfig[];
  onAddEquipmentType: (type: Omit<FireEquipmentTypeConfig, 'id'>) => void;
  onEditEquipmentType: (type: FireEquipmentTypeConfig) => void;
  onDeleteEquipmentType: (typeId: string) => void;
}

type FireDeptTab = 'equipment' | 'types' | 'training';

export const FireDepartment: React.FC<Props> = (props) => {
  const [activeTab, setActiveTab] = useState<FireDeptTab>('equipment');
  
  const TABS = [
      { 
        id: 'equipment', 
        label: 'مدیریت تجهیزات', 
        icon: <HardHat className="h-5 w-5" />, 
        component: <EquipmentManagement 
            equipmentList={props.equipmentList}
            equipmentTypes={props.equipmentTypes}
            onAddEquipment={props.onAddEquipment}
            onEditEquipment={props.onEditEquipment}
            onDeleteEquipment={props.onDeleteEquipment}
        /> 
      },
      { 
        id: 'types', 
        label: 'مدیریت انواع تجهیزات', 
        icon: <Settings className="h-5 w-5" />, 
        component: <EquipmentTypeManagement 
            equipmentTypes={props.equipmentTypes}
            onAddEquipmentType={props.onAddEquipmentType}
            onEditEquipmentType={props.onEditEquipmentType}
            onDeleteEquipmentType={props.onDeleteEquipmentType}
            equipmentList={props.equipmentList}
        />
      },
      { 
        id: 'training', 
        label: 'آموزش و مانور', 
        icon: <GraduationCap className="h-5 w-5" />, 
        component: <TrainingDrills />
      },
  ];
  
  const activeComponent = TABS.find(tab => tab.id === activeTab)?.component;
  
  return (
    <div className="animate-fade-in-scale">
       <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-100 p-2 inline-block">
        <nav className="flex items-center justify-start space-x-1 space-x-reverse" aria-label="Fire Dept Sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FireDeptTab)}
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