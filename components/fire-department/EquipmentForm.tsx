import React, { useState, useEffect } from 'react';
import type { FireEquipment, FireEquipmentTypeConfig } from '../../types';

interface Props {
  onSubmit: (equipment: Omit<FireEquipment, 'id'>) => void;
  editingEquipment: FireEquipment | null;
  equipmentTypes: FireEquipmentTypeConfig[];
  onClose: () => void;
}

const toJalaliString = (date: Date): string => {
    return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
        year: 'numeric', month: '2-digit', day: '2-digit'
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

const getInitialState = (firstTypeId?: string): Omit<FireEquipment, 'id'> => ({
    tag: '',
    typeId: firstTypeId || '',
    location: '',
    installDate: toJalaliString(new Date()),
    lastInspectionDate: toJalaliString(new Date()),
    nextInspectionDate: toJalaliString(new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
    status: 'operational',
});

const baseInputClasses = "block w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-300 rounded-lg shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500";
const InputField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (<div><label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>{children}</div>);

export const EquipmentForm: React.FC<Props> = ({ onSubmit, editingEquipment, equipmentTypes, onClose }) => {
    const [formData, setFormData] = useState(() => getInitialState(equipmentTypes[0]?.id));

    useEffect(() => {
        if (editingEquipment) {
            setFormData(editingEquipment);
        } else {
            setFormData(getInitialState(equipmentTypes[0]?.id));
        }
    }, [editingEquipment, equipmentTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: 'installDate' | 'lastInspectionDate' | 'nextInspectionDate', value: string) => {
        setFormData(prev => ({ ...prev, [name]: validateJalaliDateString(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField label="شناسه تجهیز (Tag)">
                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} className={baseInputClasses} required />
                </InputField>
                <InputField label="نوع تجهیز">
                    <select name="typeId" value={formData.typeId} onChange={handleChange} className={baseInputClasses}>
                       {equipmentTypes.map(type => (
                           <option key={type.id} value={type.id}>{type.name}</option>
                       ))}
                    </select>
                </InputField>
                <InputField label="مکان نصب">
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={baseInputClasses} required />
                </InputField>
                 <InputField label="وضعیت">
                    <select name="status" value={formData.status} onChange={handleChange} className={baseInputClasses}>
                        <option value="operational">سالم</option>
                        <option value="needs_service">نیاز به سرویس</option>
                        <option value="out_of_service">خراب</option>
                    </select>
                </InputField>
                <InputField label="تاریخ نصب">
                    <input type="text" name="installDate" value={formData.installDate} onChange={e => handleDateChange('installDate', e.target.value)} className={baseInputClasses} placeholder="مثال: 1403/01/10" />
                </InputField>
                 <InputField label="آخرین بازرسی">
                    <input type="text" name="lastInspectionDate" value={formData.lastInspectionDate} onChange={e => handleDateChange('lastInspectionDate', e.target.value)} className={baseInputClasses} placeholder="مثال: 1403/05/20" />
                </InputField>
                <InputField label="بازرسی بعدی">
                    <input type="text" name="nextInspectionDate" value={formData.nextInspectionDate} onChange={e => handleDateChange('nextInspectionDate', e.target.value)} className={baseInputClasses} placeholder="مثال: 1404/05/20" required/>
                </InputField>
            </div>
            <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">انصراف</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{editingEquipment ? "ذخیره تغییرات" : "افزودن"}</button>
            </div>
        </form>
    );
};