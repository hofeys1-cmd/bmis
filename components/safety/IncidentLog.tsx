import React, { useState, useMemo } from 'react';
import type { Incident } from '../../types';
import { Modal } from '../common/Modal';
import { IncidentForm } from './IncidentForm';
import { useNotification } from '../../hooks/useNotification';
import { PlusCircle, Search, Archive } from 'lucide-react';

interface Props {
  incidents: Incident[];
  onAddIncident: (incident: Omit<Incident, 'id'>) => void;
}

const severityMap: { [key in Incident['severity']]: { text: string; className: string } } = {
  minor: { text: 'جزئی', className: 'bg-green-100 text-green-800' },
  moderate: { text: 'متوسط', className: 'bg-yellow-100 text-yellow-800' },
  serious: { text: 'جدی', className: 'bg-orange-100 text-orange-800' },
  fatal: { text: 'مرگبار', className: 'bg-red-100 text-red-800' },
};

const statusMap: { [key in Incident['status']]: { text: string; className: string } } = {
  open: { text: 'باز', className: 'bg-blue-100 text-blue-800' },
  investigating: { text: 'در حال بررسی', className: 'bg-purple-100 text-purple-800' },
  closed: { text: 'بسته شده', className: 'bg-slate-200 text-slate-800' },
};


export const IncidentLog: React.FC<Props> = ({ incidents, onAddIncident }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotification();

  const handleAddIncidentSubmit = (incident: Omit<Incident, 'id'>) => {
    onAddIncident(incident);
    addNotification('حادثه با موفقیت ثبت شد.', 'success');
    setIsModalOpen(false);
  };

  const filteredIncidents = useMemo(() => {
    if (!searchTerm) return incidents;
    const lowercasedTerm = searchTerm.toLowerCase();
    return incidents.filter(
      (incident) =>
        incident.location.toLowerCase().includes(lowercasedTerm) ||
        incident.description.toLowerCase().includes(lowercasedTerm) ||
        incident.correctiveActions.toLowerCase().includes(lowercasedTerm) ||
        (incident.party === 'contractor' && incident.contractorName?.toLowerCase().includes(lowercasedTerm))
    );
  }, [incidents, searchTerm]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 min-h-[calc(100vh-350px)] flex flex-col">
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-700">لیست حوادث ثبت شده</h3>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center space-x-2 space-x-reverse">
                <PlusCircle className="h-5 w-5" />
                <span>ثبت حادثه جدید</span>
            </button>
        </div>
      </div>
       <div className="p-4 border-b border-slate-200/80">
          <div className="relative">
              <input
                  type="search"
                  placeholder="جستجو در حوادث (مکان، توضیحات...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
              </div>
          </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {filteredIncidents.length > 0 ? (
          <div className="space-y-4">
            {filteredIncidents.map(incident => (
              <div key={incident.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                        <p className="font-bold text-slate-800">مکان: {incident.location}</p>
                        <p className="text-sm text-slate-500">{incident.date}</p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityMap[incident.severity].className}`}>{severityMap[incident.severity].text}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusMap[incident.status].className}`}>{statusMap[incident.status].text}</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-800 rounded-full">{incident.party === 'complex' ? 'مجتمع' : `پیمانکار: ${incident.contractorName}`}</span>
                    </div>
                </div>
                <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">شرح حادثه:</span> {incident.description}</p>
                <p className="mt-1 text-sm text-slate-600"><span className="font-semibold">اقدامات اصلاحی:</span> {incident.correctiveActions || 'ثبت نشده'}</p>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
                <Archive className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="font-semibold text-slate-600">هیچ حادثه‌ای یافت نشد</p>
                <p className="text-sm mt-1">با جستجوی عبارت دیگر امتحان کنید یا یک حادثه جدید ثبت کنید.</p>
            </div>
        )}
      </div>

       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="ثبت حادثه جدید"
        size="3xl"
      >
        <IncidentForm 
            onAddIncident={handleAddIncidentSubmit}
            onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};