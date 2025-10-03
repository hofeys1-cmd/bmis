
import React from 'react';
import type { HealthTip } from '../types';

export const HealthTipCard: React.FC<HealthTip> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
      <div className="bg-primary-100 text-primary-600 rounded-full p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};