

import React, { useState } from 'react';
import type { MedicalRecord } from '../../types';

interface Props {
  personnelId: string;
  onAddMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
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


const getInitialState = (personnelId: string): Omit<MedicalRecord, 'id'> => {
    const today = new Date();
    const nextYear = new Date(new Date().setFullYear(today.getFullYear() + 1));

    return {
        personnelId,
        examDate: toJalaliString(today),
        nextExamDate: toJalaliString(nextYear),
        vitals: { bmi: '', bloodPressureSystolic: '', bloodPressureDiastolic: '' },
        bloodTest: { wbc: '', rbc: '', hb: '', hct: '', mcv: '', mch: '', mchc: '', rdw: '', plt: '', mpv: '', pdw: '', fbs: '', cho: '', tg: '', ast_ot: '', alt_pt: '', cr: '' },
        urinalysis: { ph: '', sg: '', color: '', appearance: '', glucose: '', protein: '', ketones: '', blood: '', leukocytes: '', nitrite: '' },
        visionTest: { rightEyeAcuityUncorrected: '', rightEyeAcuityCorrected: '', leftEyeAcuityUncorrected: '', leftEyeAcuityCorrected: '', rightEyeColorVision: 'normal', leftEyeColorVision: 'normal', rightEyeVisualField: 'normal', leftEyeVisualField: 'normal' },
        audiometry: { rightEar500: '', rightEar1000: '', rightEar2000: '', rightEar4000: '', leftEar500: '', leftEar1000: '', leftEar2000: '', leftEar4000: '' },
        spirometry: '',
        ecg: '',
        physicianOpinion: { specialistOpinion: '', recommendations: '', referral: '', status: 'unrestricted', referralDetails: '' },
    }
};

const FormSection: React.FC<{ title: string; children: React.ReactNode; gridCols?: string }> = ({ title, children, gridCols = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }) => (
  <fieldset className="p-4 border rounded-md shadow-sm">
    <legend className="text-lg font-medium text-slate-800 px-2">{title}</legend>
    <div className={`grid ${gridCols} gap-x-6 gap-y-4 pt-2`}>
      {children}
    </div>
  </fieldset>
);

const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    {children}
  </div>
);

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";

const TextInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ value, onChange, placeholder }) => (
    <input type="text" value={value} onChange={onChange} className={baseInputClasses} placeholder={placeholder}/>
);

const SelectInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ value, onChange, children }) => (
    <select value={value} onChange={onChange} className={baseInputClasses}>
        {children}
    </select>
);

export const MedicalRecordForm: React.FC<Props> = ({ personnelId, onAddMedicalRecord, onClose }) => {
  const [formData, setFormData] = useState(() => getInitialState(personnelId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMedicalRecord(formData);
  };
  
  const handleNestedChange = <
    T extends 'vitals' | 'bloodTest' | 'urinalysis' | 'visionTest' | 'audiometry' | 'physicianOpinion',
    K extends keyof MedicalRecord[T]
  >(
    section: T,
    field: K,
    value: MedicalRecord[T][K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDateChange = (fieldName: 'examDate' | 'nextExamDate', value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: validateJalaliDateString(value) }));
  };


  return (
     <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="اطلاعات کلی" gridCols="grid-cols-1 sm:grid-cols-2">
            <InputField label="تاریخ معاینه">
                <TextInput value={formData.examDate} onChange={e => handleDateChange('examDate', e.target.value)} placeholder="مثال: 1403/05/21" />
            </InputField>
            <InputField label="تاریخ معاینه بعدی">
                <TextInput value={formData.nextExamDate} onChange={e => handleDateChange('nextExamDate', e.target.value)} placeholder="مثال: 1404/05/21" />
            </InputField>
        </FormSection>
        
        <FormSection title="علائم حیاتی" gridCols="grid-cols-1 sm:grid-cols-3">
            <InputField label="BMI"><TextInput value={formData.vitals.bmi} onChange={e => handleNestedChange('vitals', 'bmi', e.target.value)} /></InputField>
            <InputField label="فشار خون سیستولیک"><TextInput value={formData.vitals.bloodPressureSystolic} onChange={e => handleNestedChange('vitals', 'bloodPressureSystolic', e.target.value)} /></InputField>
            <InputField label="فشار خون دیاستولیک"><TextInput value={formData.vitals.bloodPressureDiastolic} onChange={e => handleNestedChange('vitals', 'bloodPressureDiastolic', e.target.value)} /></InputField>
        </FormSection>

        <FormSection title="آزمایش خون">
            {/* FIX: Cast Object.keys to the correct key type to enable type-safe property access and string operations. */}
            {(Object.keys(formData.bloodTest) as (keyof MedicalRecord['bloodTest'])[]).map(key => (
                 <InputField key={key} label={(key as string).toUpperCase()}>
                    <TextInput value={formData.bloodTest[key]} onChange={e => handleNestedChange('bloodTest', key, e.target.value)} />
                </InputField>
            ))}
        </FormSection>
        
        <FormSection title="آنالیز ادرار">
             {/* FIX: Cast Object.keys to the correct key type to enable type-safe property access. */}
             {(Object.keys(formData.urinalysis) as (keyof MedicalRecord['urinalysis'])[]).map(key => (
                 <InputField key={key} label={key as string}>
                    <TextInput value={formData.urinalysis[key]} onChange={e => handleNestedChange('urinalysis', key, e.target.value)} />
                </InputField>
            ))}
        </FormSection>

         <FormSection title="بینایی سنجی">
            <InputField label="دید چشم راست (بدون اصلاح)"><TextInput value={formData.visionTest.rightEyeAcuityUncorrected} onChange={e => handleNestedChange('visionTest', 'rightEyeAcuityUncorrected', e.target.value)} /></InputField>
            <InputField label="دید چشم راست (با اصلاح)"><TextInput value={formData.visionTest.rightEyeAcuityCorrected} onChange={e => handleNestedChange('visionTest', 'rightEyeAcuityCorrected', e.target.value)} /></InputField>
            <InputField label="دید چشم چپ (بدون اصلاح)"><TextInput value={formData.visionTest.leftEyeAcuityUncorrected} onChange={e => handleNestedChange('visionTest', 'leftEyeAcuityUncorrected', e.target.value)} /></InputField>
            <InputField label="دید چشم چپ (با اصلاح)"><TextInput value={formData.visionTest.leftEyeAcuityCorrected} onChange={e => handleNestedChange('visionTest', 'leftEyeAcuityCorrected', e.target.value)} /></InputField>
            <InputField label="دید رنگ چشم راست">
                <SelectInput value={formData.visionTest.rightEyeColorVision} onChange={e => handleNestedChange('visionTest', 'rightEyeColorVision', e.target.value as 'normal')}>
                    <option value="normal">نرمال</option><option value="abnormal">غیرنرمال</option>
                </SelectInput>
            </InputField>
            <InputField label="دید رنگ چشم چپ">
                <SelectInput value={formData.visionTest.leftEyeColorVision} onChange={e => handleNestedChange('visionTest', 'leftEyeColorVision', e.target.value as 'normal')}>
                    <option value="normal">نرمال</option><option value="abnormal">غیرنرمال</option>
                </SelectInput>
            </InputField>
         </FormSection>
         
         <FormSection title="شنوایی سنجی">
            {/* FIX: Cast Object.keys to the correct key type to enable type-safe property access and string operations. */}
            {(Object.keys(formData.audiometry) as (keyof MedicalRecord['audiometry'])[]).map(key => (
                 <InputField key={key} label={(key as string).replace('Ear', ' گوش ')}>
                    <TextInput value={formData.audiometry[key]} onChange={e => handleNestedChange('audiometry', key, e.target.value)} />
                </InputField>
            ))}
         </FormSection>

         <FormSection title="سایر تست‌ها" gridCols="grid-cols-1 sm:grid-cols-2">
            <InputField label="اسپیرومتری">
                <SelectInput value={formData.spirometry} onChange={e => setFormData({...formData, spirometry: e.target.value as 'normal'})}>
                     <option value="">انتخاب کنید</option><option value="normal">نرمال</option><option value="abnormal">غیرنرمال</option>
                </SelectInput>
            </InputField>
            <InputField label="نوار قلب (ECG)">
                 <SelectInput value={formData.ecg} onChange={e => setFormData({...formData, ecg: e.target.value as 'normal'})}>
                    <option value="">انتخاب کنید</option><option value="normal">نرمال</option><option value="abnormal">غیرنرمال</option>
                </SelectInput>
            </InputField>
         </FormSection>
        
        <FormSection title="نظر نهایی پزشک" gridCols="grid-cols-1">
             <div className="space-y-4 md:col-span-4">
                 <InputField label="وضعیت">
                    <SelectInput value={formData.physicianOpinion.status} onChange={e => handleNestedChange('physicianOpinion', 'status', e.target.value as 'unrestricted')}>
                        <option value="unrestricted">بلامانع</option>
                        <option value="conditional">مشروط</option>
                    </SelectInput>
                </InputField>
                 {formData.physicianOpinion.status === 'conditional' && (
                    <InputField label="جزئیات ارجاع / شرایط">
                        <textarea rows={3} value={formData.physicianOpinion.referralDetails || ''} onChange={e => handleNestedChange('physicianOpinion', 'referralDetails', e.target.value)} className={baseInputClasses} />
                    </InputField>
                 )}
                 <InputField label="نظر تخصصی">
                    <textarea rows={3} value={formData.physicianOpinion.specialistOpinion} onChange={e => handleNestedChange('physicianOpinion', 'specialistOpinion', e.target.value)} className={baseInputClasses} />
                </InputField>
                 <InputField label="توصیه‌ها">
                    <textarea rows={3} value={formData.physicianOpinion.recommendations} onChange={e => handleNestedChange('physicianOpinion', 'recommendations', e.target.value)} className={baseInputClasses} />
                </InputField>
                 <InputField label="ارجاع">
                    <textarea rows={2} value={formData.physicianOpinion.referral} onChange={e => handleNestedChange('physicianOpinion', 'referral', e.target.value)} className={baseInputClasses} />
                </InputField>
            </div>
        </FormSection>

      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">ثبت پرونده</button>
      </div>
    </form>
  );
};