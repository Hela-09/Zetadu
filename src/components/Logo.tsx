import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export default function Logo({ className = "w-10 h-10 shrink-0", variant = 'full' }: LogoProps) {
  const [error, setError] = useState(false);

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center overflow-hidden rounded-lg shrink-0 ${className} ${error ? 'bg-blue-600' : ''}`}>
         {!error ? (
           <img 
             src="/logo.png" 
             alt="Zetadu Logo" 
             className="w-full h-full object-cover object-[center_20%]" 
             onError={() => setError(true)}
           />
         ) : (
           <span className="font-bold text-white text-xl">Z</span>
         )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      {!error ? (
        <img 
          src="/logo.png" 
          alt="Zetadu" 
          className="w-full h-full object-contain" 
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="font-bold text-white">Z</span>
          </div>
          <span className="font-bold text-blue-600 text-xl tracking-tight">Zetadu</span>
        </div>
      )}
    </div>
  );
}
