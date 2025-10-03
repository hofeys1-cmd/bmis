
import React from 'react';

interface Props {
  className?: string;
}

export const StethoscopeIcon: React.FC<Props> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M12 21V13.03M12 13.03l-4.243-4.243M12 13.03l4.243-4.243" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 11-7.072 0 5 5 0 017.072 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2" />
    </svg>
);
