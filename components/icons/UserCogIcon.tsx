import React from 'react';

interface Props {
  className?: string;
}

export const UserCogIcon: React.FC<Props> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.872a2.25 2.25 0 00-2.25-2.25h-1.558a2.25 2.25 0 01-1.664-3.828.75.75 0 00.32-1.327 2.25 2.25 0 00-2.25-2.25h-.528a2.25 2.25 0 00-2.25 2.25.75.75 0 00.32 1.327 2.25 2.25 0 01-1.664 3.828h-1.558a2.25 2.25 0 00-2.25 2.25v.75a2.25 2.25 0 002.25 2.25h1.558a2.25 2.25 0 011.664 3.828.75.75 0 00-.32 1.327 2.25 2.25 0 002.25 2.25h.528a2.25 2.25 0 002.25-2.25.75.75 0 00-.32-1.327 2.25 2.25 0 011.664-3.828h1.558a2.25 2.25 0 002.25-2.25v-.75z" />
  </svg>
);