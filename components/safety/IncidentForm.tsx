import React, { useState } from 'react';
import type { Incident, IncidentParty } from '../../types';
import { useNotification } from '../../hooks/useNotification';


interface Props {
  onAddIncident: (incident: Omit<Incident, 'id'>) => void;
  onClose: () => void;
}

const toJalaliString = (date: Date): string => {
    return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date).replace(/\//g, '/');
};

const validateJalaliDateString = (input: string): string => {
    let value = input.replace(/[^\d/]/g, '');
    const parts = value.split('/');

    if (parts[0]) parts[0] = parts[0].substring(0, 4);
    if (parts[1]) {
        parts[1] = parts[1].substring(0, 2);
        if (parseInt(parts[1], 10) > 12) parts[1] = '12';
    }
    if (parts[2]) {
        parts[2] = parts[2].substring(0, 2);
        if (parseInt(parts[2], 10) > 31) parts[2] = '31';
    }
    return parts.slice(0, 3).join('/');
};


const getInitialState = (): Omit<Incident, 'id' | 'date'> => ({
    party: 'complex',
    location: '',
    description: '',
    severity: 'minor',
    correctiveActions: '',
    status: 'open',
    contractorName: '',
});

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";
const FormSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) => (
    <fieldset className="p-4 border rounded-md shadow-sm"><legend className="text-lg font-medium text-slate-800 px-2">{title}</legend><div className={`grid ${gridCols} gap-x-6 gap-y-4 pt-2`}>{children}</div></fieldset>
);
const InputField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (<div className={className}><label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>{children}</div>);

export const IncidentForm: React.FC<Props> = ({ onAddIncident, onClose }) => {
    const [formData, setFormData] = useState(getInitialState);
    const [jalaliIncidentDate, setJalaliIncidentDate] = useState(() => toJalaliString(new Date()));
    const [incidentTime, setIncidentTime] = useState(() => new Date().toTimeString().slice(0, 5));
    const { addNotification } = useNotification();

    const handlePartyChange = (party: IncidentParty) => setFormData(prev => ({ ...prev, party, contractorName: '' }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.location || !formData.description) {
            addNotification('مکان و شرح حادثه الزامی است.', 'error'); return;
        }
        if (formData.party === 'contractor' && !formData.contractorName) {
            addNotification('نام پیمانکار الزامی است.', 'error'); return;
        }
        const fullIncidentDate = `${jalaliIncidentDate} ${incidentTime}`;
        onAddIncident({ ...formData, date: fullIncidentDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="اطلاعات کلی حادثه" gridCols="grid-cols-1 md:grid-cols-2">
                 <div className="md:col-span-2 flex items-center space-x-4 space-x-reverse"><p className="text-sm font-medium text-slate-700">مربوط به:</p>{['complex', 'contractor'].map(type => <label key={type} className="flex items-center"><input type="radio" name="party" value={type} checked={formData.party === type} onChange={() => handlePartyChange(type as IncidentParty)} className="ml-2" /> {type === 'complex' ? 'مجتمع' : 'پیمانکار'}</label>)}</div>
                
                {formData.party === 'contractor' && (
                    <InputField label="نام شرکت پیمانکار" className="md:col-span-2">
                        <input type="text" value={formData.contractorName} onChange={e => setFormData({...formData, contractorName: e.target.value})} className={baseInputClasses} required />
                    </InputField>
                )}

                <InputField label="تاریخ حادثه"><input type="text" value={jalaliIncidentDate} onChange={e => setJalaliIncidentDate(validateJalaliDateString(e.target.value))} placeholder="مثال: 1403/05/21" className={baseInputClasses} required /></InputField>
                <InputField label="ساعت حادثه"><input type="time" value={incidentTime} onChange={e => setIncidentTime(e.target.value)} className={baseInputClasses} required /></InputField>
                <InputField label="مکان دقیق حادثه" className="md:col-span-2"><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={baseInputClasses} required /></InputField>

            </FormSection>

             <FormSection title="جزئیات و وضعیت" gridCols="grid-cols-1 md:grid-cols-2">
                 <InputField label="شدت حادثه">
                    <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value as any})} className={baseInputClasses}>
                        <option value="minor">جزئی</option>
                        <option value="moderate">متوسط</option>
                        <option value="serious">جدی</option>
                        <option value="fatal">مرگبار</option>
                    </select>
                </InputField>
                 <InputField label="وضعیت حادثه">
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={baseInputClasses}>
                        <option value="open">باز</option>
                        <option value="investigating">در حال بررسی</option>
                        <option value="closed">بسته شده</option>
                    </select>
                </InputField>
                 <InputField label="شرح کامل حادثه" className="md:col-span-2"><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={baseInputClasses} rows={4} required /></InputField>
                 <InputField label="اقدامات اصلاحی انجام شده" className="md:col-span-2"><textarea value={formData.correctiveActions} onChange={e => setFormData({...formData, correctiveActions: e.target.value})} className={baseInputClasses} rows={3} /></InputField>
            </FormSection>

            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">ثبت حادثه</button>
            </div>
        </form>
    );
};