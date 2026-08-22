import React from 'react';

export default function Logo({ className = "w-10 h-10 shrink-0" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M4 8 H22 L14 20 H4 L12 8 Z" fill="currentColor" className="text-slate-900 dark:text-white" />
        <path d="M28 24 H10 L18 12 H28 L20 24 Z" fill="#06b6d4" />
      </svg>
    </div>
  );
}
