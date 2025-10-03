import React, { useState, useEffect } from 'react';
import type { VisitRecord, PrescribedMedication, Personnel, Medicine, PatientType } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  onAddVisit: (visit: Omit<VisitRecord, 'id'>) => void;
  onEditVisit: (visit: VisitRecord) => void;
  editingVisit: VisitRecord | null;
  personnelList: Personnel[];
  medicines: Medicine[];
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
        if (parts[1].length === 2 && parseInt(parts[1], 10) === 0) parts[1] = '01';
        if (parseInt(parts[1], 10) > 12) parts[1] = '12';
    }

    if (parts[2]) {
        parts[2] = parts[2].substring(0, 2);
        if (parts[2].length === 2 && parseInt(parts[2], 10) === 0) parts[2] = '01';
        if (parseInt(parts[2], 10) > 31) parts[2] = '31';
    }
    
    return parts.slice(0, 3).join('/');
};


const getInitialState = (): Omit<VisitRecord, 'id' | 'visitDate'> => ({
    reason: '',
    diagnosis: '',
    recommendations: '',
    physicianName: '',
    patientType: 'complex',
    prescribedMedications: [],
    personnelId: '',
    contractorInfo: { firstName: '', lastName: '', age: '', nationalId: '', company: '' },
    actionResult: 'returnToWork',
    hospitalDispatchDetails: { driverName: '', dispatchTime: '' },
    consultingPhysicianName: '',
    hasElectronicPrescription: false,
    electronicPrescriptionCode: ''
});

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";
const FormSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) => (
    <fieldset className="p-4 border rounded-md shadow-sm"><legend className="text-lg font-medium text-slate-800 px-2">{title}</legend><div className={`grid ${gridCols} gap-x-6 gap-y-4 pt-2`}>{children}</div></fieldset>
);
const InputField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (<div className={className}><label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>{children}</div>);

export const VisitForm: React.FC<Props> = ({ onAddVisit, onEditVisit, editingVisit, personnelList, medicines, onClose }) => {
    const [formData, setFormData] = useState(getInitialState);
    const [jalaliVisitDate, setJalaliVisitDate] = useState(() => toJalaliString(new Date()));
    const [visitTime, setVisitTime] = useState(() => new Date().toTimeString().slice(0, 5));
    const [currentPrescription, setCurrentPrescription] = useState<{ medicineId: string; quantity: string }>({ medicineId: '', quantity: '1' });
    const { addNotification } = useNotification();

    useEffect(() => {
        if (editingVisit) {
            const { visitDate, ...rest } = editingVisit;
            const [datePart, timePart] = visitDate.split(' ');
            setFormData(rest);
            setJalaliVisitDate(datePart || toJalaliString(new Date()));
            setVisitTime(timePart || new Date().toTimeString().slice(0, 5));
        } else {
            setFormData(getInitialState());
            setJalaliVisitDate(toJalaliString(new Date()));
            setVisitTime(new Date().toTimeString().slice(0, 5));
        }
    }, [editingVisit]);


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJalaliVisitDate(validateJalaliDateString(e.target.value));
    };

    const handlePatientTypeChange = (type: PatientType) => setFormData(prev => ({ ...prev, patientType: type, personnelId: '', contractorInfo: { firstName: '', lastName: '', age: '', nationalId: '', company: '' } }));
    
    const handleAddPrescription = () => {
        const { medicineId, quantity: qtyStr } = currentPrescription;
        const quantity = parseInt(qtyStr, 10);
        const medicine = medicines.find(m => m.id === medicineId);
        if (!medicineId || !quantity || quantity <= 0 || !medicine) {
            addNotification('اطلاعات دارو نامعتبر است.', 'error'); return;
        }

        const currentStock = medicine.stock;
        const alreadyPrescribed = formData.prescribedMedications?.find(p => p.medicineId === medicineId)?.quantity || 0;
        const availableStock = currentStock + (editingVisit ? (editingVisit.prescribedMedications?.find(p => p.medicineId === medicineId)?.quantity || 0) : 0);

        if (availableStock < (alreadyPrescribed + quantity)) {
             addNotification(`موجودی '${medicine.name}' کافی نیست.`, 'error'); return;
        }

        const existingIndex = formData.prescribedMedications?.findIndex(p => p.medicineId === medicineId);
        if (existingIndex !== -1) {
            const updatedPrescriptions = [...(formData.prescribedMedications || [])];
            updatedPrescriptions[existingIndex].quantity += quantity;
            setFormData(prev => ({ ...prev, prescribedMedications: updatedPrescriptions }));
        } else {
            setFormData(prev => ({ ...prev, prescribedMedications: [...(prev.prescribedMedications || []), { medicineId, quantity }] }));
        }
        
        setCurrentPrescription({ medicineId: '', quantity: '1' });
    };

    const handleRemovePrescription = (medId: string) => setFormData(prev => ({ ...prev, prescribedMedications: prev.prescribedMedications?.filter(p => p.medicineId !== medId) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((formData.patientType === 'complex' && !formData.personnelId) || (formData.patientType === 'contractor' && !formData.contractorInfo?.nationalId)) {
            addNotification('اطلاعات بیمار را کامل کنید.', 'error'); return;
        }
        if (!formData.reason || !formData.diagnosis) {
            addNotification('علت مراجعه و تشخیص الزامی است.', 'error'); return;
        }
        const fullVisitDate = `${jalaliVisitDate} ${visitTime}`;
        
        if (editingVisit) {
            onEditVisit({ ...formData, id: editingVisit.id, visitDate: fullVisitDate });
            addNotification('مراجعه با موفقیت ویرایش شد.', 'success');
        } else {
            onAddVisit({...formData, visitDate: fullVisitDate});
            addNotification('مراجعه با موفقیت ثبت شد.', 'success');
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="اطلاعات بیمار">
                <div className="col-span-full flex items-center space-x-4 space-x-reverse"><p className="text-sm font-medium text-slate-700">نوع بیمار:</p>{['complex', 'contractor'].map(type => <label key={type} className="flex items-center"><input type="radio" name="patientType" value={type} checked={formData.patientType === type} onChange={() => handlePatientTypeChange(type as PatientType)} className="ml-2" disabled={!!editingVisit} /> {type === 'complex' ? 'پرسنل مجتمع' : 'پیمانکار'}</label>)}</div>
                {formData.patientType === 'complex' ? <InputField label="انتخاب پرسنل" className="col-span-full"><select value={formData.personnelId} onChange={e => setFormData({...formData, personnelId: e.target.value})} className={baseInputClasses} required disabled={!!editingVisit}><option value="">انتخاب کنید</option>{personnelList.map(p => <option key={p.id} value={p.id}>{`${p.firstName} ${p.lastName} - ${p.personnelId}`}</option>)}</select></InputField> : <> <InputField label="نام"><input type="text" value={formData.contractorInfo!.firstName} onChange={e => setFormData({...formData, contractorInfo: {...formData.contractorInfo!, firstName: e.target.value}})} className={baseInputClasses} required disabled={!!editingVisit} /></InputField> <InputField label="نام خانوادگی"><input type="text" value={formData.contractorInfo!.lastName} onChange={e => setFormData({...formData, contractorInfo: {...formData.contractorInfo!, lastName: e.target.value}})} className={baseInputClasses} required disabled={!!editingVisit} /></InputField> <InputField label="کد ملی"><input type="text" value={formData.contractorInfo!.nationalId} onChange={e => setFormData({...formData, contractorInfo: {...formData.contractorInfo!, nationalId: e.target.value}})} className={baseInputClasses} required disabled={!!editingVisit} /></InputField> <InputField label="سن"><input type="number" value={formData.contractorInfo!.age} onChange={e => setFormData({...formData, contractorInfo: {...formData.contractorInfo!, age: e.target.value}})} className={baseInputClasses} disabled={!!editingVisit} /></InputField> <InputField label="شرکت"><input type="text" value={formData.contractorInfo!.company} onChange={e => setFormData({...formData, contractorInfo: {...formData.contractorInfo!, company: e.target.value}})} className={baseInputClasses} disabled={!!editingVisit} /></InputField> </>}
            </FormSection>

            <FormSection title="اطلاعات مراجعه">
                <InputField label="تاریخ مراجعه"><input type="text" value={jalaliVisitDate} onChange={handleDateChange} placeholder="مثال: 1403/05/21" className={baseInputClasses} required /></InputField>
                <InputField label="ساعت مراجعه"><input type="time" value={visitTime} onChange={e => setVisitTime(e.target.value)} className={baseInputClasses} required /></InputField>
                <InputField label="علت مراجعه"><input type="text" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className={baseInputClasses} required /></InputField>
                <InputField label="پزشک معالج مرکز"><input type="text" value={formData.physicianName} onChange={e => setFormData({...formData, physicianName: e.target.value})} className={baseInputClasses} /></InputField>
                <InputField label="پزشک مشاور"><input type="text" value={formData.consultingPhysicianName} onChange={e => setFormData({...formData, consultingPhysicianName: e.target.value})} className={baseInputClasses} /></InputField>
                <InputField label="تشخیص" className="md:col-span-full"><textarea value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} className={baseInputClasses} rows={2} required /></InputField>
                <InputField label="توصیه‌ها" className="md:col-span-full"><textarea value={formData.recommendations} onChange={e => setFormData({...formData, recommendations: e.target.value})} className={baseInputClasses} rows={2} /></InputField>
            </FormSection>

            <FormSection title="تجویز دارو" gridCols='grid-cols-1'>
                <div className="grid grid-cols-1 md:grid-cols-[1fr,100px,120px] gap-4 items-end">
                    <InputField label="انتخاب دارو"><select value={currentPrescription.medicineId} onChange={e => setCurrentPrescription({...currentPrescription, medicineId: e.target.value})} className={baseInputClasses}><option value="">انتخاب کنید</option>{medicines.filter(m => m.stock > 0 || (editingVisit && editingVisit.prescribedMedications?.some(p => p.medicineId === m.id))).map(m => <option key={m.id} value={m.id}>{`${m.name} (${m.type}) - موجودی: ${m.stock}`}</option>)}</select></InputField>
                    <InputField label="تعداد"><input type="number" value={currentPrescription.quantity} onChange={e => setCurrentPrescription({...currentPrescription, quantity: e.target.value})} className={baseInputClasses} min="1" /></InputField>
                    <button type="button" onClick={handleAddPrescription} className="px-4 py-2.5 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 h-fit">افزودن</button>
                </div>
                {formData.prescribedMedications && formData.prescribedMedications.length > 0 && <div className="mt-4 col-span-full space-y-2">{formData.prescribedMedications.map(p => { const med = medicines.find(m => m.id === p.medicineId); return <div key={p.medicineId} className="flex justify-between items-center p-2 bg-slate-100 rounded-md"><span>{med?.name} - {p.quantity} عدد</span><button type="button" onClick={() => handleRemovePrescription(p.medicineId)} className="text-danger-500 hover:text-danger-700"><TrashIcon /></button></div> })}</div>}
                <div className="md:col-span-full flex items-center space-x-4 space-x-reverse pt-2">
                    <label className="flex items-center"><input type="checkbox" checked={formData.hasElectronicPrescription} onChange={e => setFormData({...formData, hasElectronicPrescription: e.target.checked, electronicPrescriptionCode: ''})} className="ml-2" /> نسخه الکترونیک دارد</label>
                    {formData.hasElectronicPrescription && <InputField label="کد رهگیری نسخه"><input type="text" value={formData.electronicPrescriptionCode || ''} onChange={e => setFormData({...formData, electronicPrescriptionCode: e.target.value})} className={baseInputClasses} /></InputField>}
                </div>
            </FormSection>

            <FormSection title="نتیجه اقدام">
                <InputField label="نتیجه" className="md:col-span-1"><select value={formData.actionResult} onChange={e => setFormData({...formData, actionResult: e.target.value as any})} className={baseInputClasses}><option value="returnToWork">بازگشت به کار</option><option value="referral">ارجاع به متخصص</option><option value="hospitalDispatch">اعزام به بیمارستان</option></select></InputField>
                {formData.actionResult === 'hospitalDispatch' && <> <InputField label="نام راننده آمبولانس"><input type="text" value={formData.hospitalDispatchDetails!.driverName} onChange={e => setFormData({...formData, hospitalDispatchDetails: {...formData.hospitalDispatchDetails!, driverName: e.target.value}})} className={baseInputClasses} /></InputField> <InputField label="ساعت اعزام"><input type="time" value={formData.hospitalDispatchDetails!.dispatchTime} onChange={e => setFormData({...formData, hospitalDispatchDetails: {...formData.hospitalDispatchDetails!, dispatchTime: e.target.value}})} className={baseInputClasses} /></InputField> </>}
            </FormSection>

            <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingVisit ? "ذخیره تغییرات" : "ثبت مراجعه"}</button>
            </div>
        </form>
    );
};