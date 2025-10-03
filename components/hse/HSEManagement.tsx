import React, { useState, useMemo } from 'react';
import type { User, Role, Personnel, MedicalRecord, VisitRecord, Medicine, Incident, ChecklistCategory, Checklist, ChecklistSubmission, FireEquipment, FireEquipmentTypeConfig } from '../../types';
import { Health } from '../health/Health';
import { Treatment } from '../treatment/Treatment';
import { Safety } from '../safety/Safety';
import { FireDepartment } from '../fire-department/FireDepartment';
import { Environment } from '../environment/Environment';
import { AccessDenied } from '../auth/AccessDenied';
import { Stethoscope, Pill, Shield, Flame, Leaf } from 'lucide-react';

// MOCK DATA - Initial data for the application state
const MOCK_PERSONNEL: Personnel[] = [
  { id: 'p1', firstName: 'علی', lastName: 'رضایی', nationalId: '1234567890', personnelId: '1001', hireDate: '1398/02/15', position: 'اپراتور' },
  { id: 'p2', firstName: 'سارا', lastName: 'محمدی', nationalId: '0987654321', personnelId: '1002', hireDate: '1400/11/01', position: 'تکنسین' },
];
const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [];
const MOCK_VISIT_RECORDS: VisitRecord[] = [];
const MOCK_MEDICINES: Medicine[] = [
    { id: 'm1', name: 'استامینوفن', type: 'قرص', stock: 150 },
    { id: 'm2', name: 'ایبوپروفن', type: 'قرص', stock: 80 },
    { id: 'm3', name: 'شربت دیفن هیدرامین', type: 'شربت', stock: 45 },
];
const MOCK_INCIDENTS: Incident[] = [];

interface Props {
  user: User;
}

const TABS_CONFIG: { id: Role; label: string; icon: React.ReactNode; component: React.FC<any> }[] = [
  { id: 'occupationalMedicine', label: 'بهداشت و طب کار', icon: <Stethoscope className="h-5 w-5" />, component: Health },
  { id: 'treatment', label: 'درمان', icon: <Pill className="h-5 w-5" />, component: Treatment },
  { id: 'safety', label: 'ایمنی', icon: <Shield className="h-5 w-5" />, component: Safety },
  { id: 'fireDepartment', label: 'آتش نشانی', icon: <Flame className="h-5 w-5" />, component: FireDepartment },
  { id: 'environment', label: 'محیط زیست', icon: <Leaf className="h-5 w-5" />, component: Environment },
];

export const HSEManagement: React.FC<Props> = ({ user }) => {
  // Mocking state management at this top-level component
  const [personnelList, setPersonnelList] = useState(MOCK_PERSONNEL);
  const [medicalRecords, setMedicalRecords] = useState(MOCK_MEDICAL_RECORDS);
  const [visitRecords, setVisitRecords] = useState(MOCK_VISIT_RECORDS);
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [checklistCategories, setChecklistCategories] = useState<ChecklistCategory[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [checklistSubmissions, setChecklistSubmissions] = useState<ChecklistSubmission[]>([]);
  const [fireEquipmentList, setFireEquipmentList] = useState<FireEquipment[]>([]);
  const [fireEquipmentTypes, setFireEquipmentTypes] = useState<FireEquipmentTypeConfig[]>([]);


  const userTabs = useMemo(() => {
    // FIX: Admins should have access to all tabs.
    if (user.roles.includes('admin')) {
      return TABS_CONFIG;
    }
    return TABS_CONFIG.filter(tab => user.roles.includes(tab.id));
  }, [user.roles]);

  const [activeTab, setActiveTab] = useState<Role | undefined>(userTabs[0]?.id);

  if (userTabs.length === 0) {
    return <AccessDenied onBack={() => {}} />; // onBack can be improved based on routing
  }
  
  const handleAddPersonnel = (personnel: Omit<Personnel, 'id'>) => {
    const newPersonnel = { ...personnel, id: crypto.randomUUID() };
    setPersonnelList(prev => [...prev, newPersonnel]);
  };

  const handleAddMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord = { ...record, id: crypto.randomUUID() };
    setMedicalRecords(prev => [...prev, newRecord]);
  };
  
  const handleAddVisit = (visit: Omit<VisitRecord, 'id'>) => {
    visit.prescribedMedications?.forEach(pm => {
      setMedicines(prevMeds => prevMeds.map(med => med.id === pm.medicineId ? { ...med, stock: med.stock - pm.quantity } : med));
    });
    const newVisit = { ...visit, id: crypto.randomUUID() } as VisitRecord;
    setVisitRecords(prev => [newVisit, ...prev]);
  };
  
  const handleEditVisit = (editedVisit: VisitRecord) => {
    const originalVisit = visitRecords.find(v => v.id === editedVisit.id);
    if (!originalVisit) return;

    const stockAdjustments = new Map<string, number>();

    originalVisit.prescribedMedications?.forEach(pm => {
        stockAdjustments.set(pm.medicineId, (stockAdjustments.get(pm.medicineId) || 0) + pm.quantity);
    });
    
    editedVisit.prescribedMedications?.forEach(pm => {
        stockAdjustments.set(pm.medicineId, (stockAdjustments.get(pm.medicineId) || 0) - pm.quantity);
    });

    setMedicines(prevMeds => prevMeds.map(med => {
        if(stockAdjustments.has(med.id)){
            return {...med, stock: med.stock + (stockAdjustments.get(med.id) || 0)}
        }
        return med;
    }));

    setVisitRecords(prev => prev.map(v => v.id === editedVisit.id ? editedVisit : v));
  };
  
  const handleDeleteVisit = (visitId: string) => {
    const visitToDelete = visitRecords.find(v => v.id === visitId);
    if (!visitToDelete) return;
    
    visitToDelete.prescribedMedications?.forEach(pm => {
       setMedicines(prevMeds => prevMeds.map(med => med.id === pm.medicineId ? { ...med, stock: med.stock + pm.quantity } : med));
    });

    setVisitRecords(prev => prev.filter(v => v.id !== visitId));
  };

  const handleAddMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine = { ...medicine, id: crypto.randomUUID() };
    setMedicines(prev => [newMedicine, ...prev]);
  };

  const handleEditMedicine = (editedMedicine: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === editedMedicine.id ? editedMedicine : m));
  };
  
  const handleAddIncident = (incident: Omit<Incident, 'id'>) => {
      const newIncident = { ...incident, id: crypto.randomUUID() };
      setIncidents(prev => [newIncident, ...prev]);
  };

  const handleAddChecklistSubmission = (submission: Omit<ChecklistSubmission, 'id'>) => {
    const newSubmission = { ...submission, id: crypto.randomUUID() };
    setChecklistSubmissions(prev => [newSubmission, ...prev]);
  };

  // Checklist Category Handlers
  const handleAddCategory = (category: Omit<ChecklistCategory, 'id'>) => {
    setChecklistCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);
  };
  const handleEditCategory = (editedCategory: ChecklistCategory) => {
    setChecklistCategories(prev => prev.map(c => c.id === editedCategory.id ? editedCategory : c));
  };
  const handleDeleteCategory = (categoryId: string) => {
    setChecklistCategories(prev => prev.filter(c => c.id !== categoryId));
    setChecklists(prev => prev.filter(c => c.categoryId !== categoryId)); // Also delete associated checklists
  };

  // Checklist Handlers
  const handleAddChecklist = (checklist: Omit<Checklist, 'id'>) => {
    const newItems = checklist.items.map(item => ({...item, id: crypto.randomUUID()}));
    setChecklists(prev => [...prev, { ...checklist, id: crypto.randomUUID(), items: newItems }]);
  };
  const handleEditChecklist = (editedChecklist: Checklist) => {
    const newItems = editedChecklist.items.map(item => item.id ? item : ({...item, id: crypto.randomUUID()}));
    setChecklists(prev => prev.map(c => c.id === editedChecklist.id ? {...editedChecklist, items: newItems} : c));
  };
  const handleDeleteChecklist = (checklistId: string) => {
    setChecklists(prev => prev.filter(c => c.id !== checklistId));
  };

  // Fire Equipment Handlers
  const handleAddFireEquipment = (equipment: Omit<FireEquipment, 'id'>) => {
    setFireEquipmentList(prev => [...prev, { ...equipment, id: crypto.randomUUID() }]);
  };
  const handleEditFireEquipment = (editedEquipment: FireEquipment) => {
    setFireEquipmentList(prev => prev.map(e => e.id === editedEquipment.id ? editedEquipment : e));
  };
  const handleDeleteFireEquipment = (equipmentId: string) => {
    setFireEquipmentList(prev => prev.filter(e => e.id !== equipmentId));
  };
  
  // Fire Equipment Type Handlers
  const handleAddFireEquipmentType = (type: Omit<FireEquipmentTypeConfig, 'id'>) => {
    setFireEquipmentTypes(prev => [...prev, { ...type, id: crypto.randomUUID() }]);
  };
  const handleEditFireEquipmentType = (editedType: FireEquipmentTypeConfig) => {
    setFireEquipmentTypes(prev => prev.map(t => t.id === editedType.id ? editedType : t));
  };
  const handleDeleteFireEquipmentType = (typeId: string) => {
    setFireEquipmentTypes(prev => prev.filter(t => t.id !== typeId));
    // Optional: Also remove equipment of this type, or re-assign them. For now, we just remove the type.
    setFireEquipmentList(prev => prev.filter(eq => eq.typeId !== typeId));
  };


  const ActiveComponent = TABS_CONFIG.find(tab => tab.id === activeTab)?.component;
  const componentProps: { [key in Role]?: any } = {
      'occupationalMedicine': { personnelList, medicalRecords, onAddPersonnel: handleAddPersonnel, onAddMedicalRecord: handleAddMedicalRecord },
      'treatment': { personnelList, visitRecords, medicines, onAddVisit: handleAddVisit, onEditVisit: handleEditVisit, onDeleteVisit: handleDeleteVisit, onAddMedicine: handleAddMedicine, onEditMedicine: handleEditMedicine },
      'safety': { 
          incidents, 
          onAddIncident: handleAddIncident,
          checklistCategories,
          checklists,
          checklistSubmissions,
          onAddChecklistSubmission: handleAddChecklistSubmission,
          onAddCategory: handleAddCategory,
          onEditCategory: handleEditCategory,
          onDeleteCategory: handleDeleteCategory,
          onAddChecklist: handleAddChecklist,
          onEditChecklist: handleEditChecklist,
          onDeleteChecklist: handleDeleteChecklist,
       },
      'fireDepartment': {
          equipmentList: fireEquipmentList,
          onAddEquipment: handleAddFireEquipment,
          onEditEquipment: handleEditFireEquipment,
          onDeleteEquipment: handleDeleteFireEquipment,
          equipmentTypes: fireEquipmentTypes,
          onAddEquipmentType: handleAddFireEquipmentType,
          onEditEquipmentType: handleEditFireEquipmentType,
          onDeleteEquipmentType: handleDeleteFireEquipmentType,
      },
      'environment': {},
  };


  return (
    <div className="animate-fade-in-scale">
        <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-100 p-2 inline-block">
            <nav className="flex items-center justify-start space-x-1 space-x-reverse" aria-label="HSE Sections">
                {userTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
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
            {ActiveComponent && <ActiveComponent {...componentProps[activeTab!]} />}
        </div>
    </div>
  );
};