import React, { useState, useMemo } from 'react';
import type { Personnel, MedicalRecord } from '../../types';
import { PersonnelList } from './PersonnelList';
import { PersonnelDetailView } from './PersonnelDetailView';
import { PersonnelForm } from './PersonnelForm';
import { MedicalRecordForm } from './MedicalRecordForm';
import { Modal } from '../common/Modal';
import { UpcomingCheckups } from './UpcomingCheckups';
import { useNotification } from '../../hooks/useNotification';

interface Props {
  personnelList: Personnel[];
  medicalRecords: MedicalRecord[];
  onAddPersonnel: (personnel: Omit<Personnel, 'id'>) => void;
  onAddMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
}

export const OccupationalMedicine: React.FC<Props> = ({
  personnelList,
  medicalRecords,
  onAddPersonnel,
  onAddMedicalRecord,
}) => {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'details' | 'addPersonnel' | 'addRecord'>('details');
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotification();

  const handleSelectPersonnel = (personnel: Personnel) => {
    setSelectedPersonnelId(personnel.id);
  };
  
  const selectedPersonnel = useMemo(
    () => personnelList.find(p => p.id === selectedPersonnelId),
    [personnelList, selectedPersonnelId]
  );

  const recordsForSelected = useMemo(
    () => medicalRecords.filter(r => r.personnelId === selectedPersonnelId),
    [medicalRecords, selectedPersonnelId]
  );
  
  const filteredPersonnel = useMemo(() => {
      if (!searchTerm) return personnelList;
      const lowercasedTerm = searchTerm.toLowerCase();
      return personnelList.filter(p => 
          p.firstName.toLowerCase().includes(lowercasedTerm) ||
          p.lastName.toLowerCase().includes(lowercasedTerm) ||
          p.personnelId.toLowerCase().includes(lowercasedTerm) ||
          p.nationalId.toLowerCase().includes(lowercasedTerm)
      );
  }, [personnelList, searchTerm]);
  
  const duePersonnel = useMemo(() => {
    const personnelWithRecordsIds = new Set(medicalRecords.map(r => r.personnelId));
    
    const needsFirst = personnelList
      .filter(p => !personnelWithRecordsIds.has(p.id))
      .map(p => ({
        personnel: p, 
        status: 'needsFirst' as const, 
        nextDueDate: null
      }));

    const personnelWithUpcomingCheckups = Array.from(personnelWithRecordsIds)
      .map(personnelId => {
        const personRecords = medicalRecords.filter(r => r.personnelId === personnelId);
        if (personRecords.length === 0) return null;
        
        // Sort by Jalali date string (YYYY/MM/DD) to find the latest record
        const latestRecord = personRecords.sort((a, b) => b.examDate.localeCompare(a.examDate))[0];
        
        const personnel = personnelList.find(p => p.id === personnelId);
        if (!personnel) return null;

        return {
          personnel,
          status: 'dueSoon' as const, // Using a generic status for display purposes
          nextDueDate: latestRecord.nextExamDate,
        };
      })
      .filter(Boolean);

    return [...personnelWithUpcomingCheckups, ...needsFirst].slice(0, 10);
  }, [personnelList, medicalRecords]);

  const handleAddPersonnelSubmit = (personnel: Omit<Personnel, 'id'>) => {
    onAddPersonnel(personnel);
    addNotification('پرسنل جدید با موفقیت ثبت شد.', 'success');
    setViewMode('details');
  };

  const handleAddRecordSubmit = (record: Omit<MedicalRecord, 'id'>) => {
    onAddMedicalRecord(record);
    addNotification('پرونده پزشکی جدید با موفقیت ثبت شد.', 'success');
    setViewMode('details');
  };
  
  const isModalOpen = viewMode === 'addPersonnel' || viewMode === 'addRecord';
  const closeModal = () => setViewMode('details');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <UpcomingCheckups duePersonnel={duePersonnel} onSelectPersonnel={handleSelectPersonnel} />
        <PersonnelList 
            personnelList={filteredPersonnel} 
            selectedPersonnelId={selectedPersonnelId}
            onSelectPersonnel={handleSelectPersonnel}
            onAddPersonnel={() => setViewMode('addPersonnel')}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
        />
      </div>

      <div className="lg:col-span-2 h-full">
        <PersonnelDetailView 
            personnel={selectedPersonnel || null} 
            records={recordsForSelected}
            onAddRecord={() => {
                if(selectedPersonnelId) {
                    setViewMode('addRecord');
                } else {
                    addNotification('لطفا ابتدا یک پرسنل را انتخاب کنید.', 'info');
                }
            }}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={viewMode === 'addPersonnel' ? 'افزودن پرسنل جدید' : 'ثبت پرونده پزشکی جدید'}
        size={viewMode === 'addRecord' ? '3xl' : '2xl'}
      >
          {viewMode === 'addPersonnel' && <PersonnelForm onAddPersonnel={handleAddPersonnelSubmit} onClose={closeModal} />}
          {viewMode === 'addRecord' && selectedPersonnel && <MedicalRecordForm personnelId={selectedPersonnel.id} onAddMedicalRecord={handleAddRecordSubmit} onClose={closeModal} />}
      </Modal>

    </div>
  );
};