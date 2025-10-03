import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
    onBack: () => void;
}

export const AccessDenied: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-danger-200 text-center">
      <div className="flex justify-center mb-4">
        <ShieldAlert className="h-16 w-16 text-danger-500" />
      </div>
      <h2 className="text-3xl font-bold text-danger-600 mb-4">عدم دسترسی</h2>
      <p className="text-slate-600 mb-8">
        متاسفانه شما مجوز لازم برای مشاهده این بخش را ندارید.
      </p>
      <button
        onClick={onBack}
        className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors"
      >
        بازگشت به داشبورد
      </button>
    </div>
  );
};