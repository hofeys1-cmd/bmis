import React from 'react';
import { GraduationCap } from 'lucide-react';

export const TrainingDrills: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80">
      <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl text-center">
         <h2 className="text-3xl font-bold text-primary-600 flex items-center justify-center space-x-3 space-x-reverse">
            <GraduationCap className="h-8 w-8" />
            <span>آموزش و مانور</span>
        </h2>
      </div>
      <div className="p-8 text-center text-slate-500">
        <p>این بخش در حال توسعه است. به زودی ویژگی‌های مربوط به ثبت سوابق آموزش‌ها و مانورهای آتش نشانی در اینجا اضافه خواهد شد.</p>
      </div>
    </div>
  );
};
