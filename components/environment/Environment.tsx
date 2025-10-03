import React from 'react';

export const Environment: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/80">
      <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 rounded-t-xl text-center">
        <h2 className="text-3xl font-bold text-primary-600">بخش محیط زیست</h2>
      </div>
      <div className="p-8 text-center text-slate-500">
        <p>این بخش در حال توسعه است. به زودی ویژگی‌های مربوط به مدیریت محیط زیست در اینجا اضافه خواهد شد.</p>
      </div>
    </div>
  );
};