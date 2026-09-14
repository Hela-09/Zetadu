import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export default function Logo({ className = "w-10 h-10 shrink-0", variant = 'full' }: LogoProps) {
  const [error, setError] = useState(false);

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center overflow-hidden rounded-xl shrink-0 shadow-sm ${className} ${error ? 'bg-blue-600' : 'bg-white'}`}>
         {!error ? (
           <img 
             src="/logo.png" 
             alt="Learndean Logo" 
             referrerPolicy="no-referrer"
             className="w-full h-full object-cover object-center" 
             onError={() => setError(true)}
           />
         ) : (
           <span className="font-bold text-white text-xl">L</span>
         )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      {!error ? (
        <img 
          src="/logo.png" 
          alt="Learndean" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-xl" 
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <span className="font-bold text-white">L</span>
          </div>
          <span className="font-bold text-blue-600 text-xl tracking-tight">Learndean</span>
        </div>
      )}
    </div>
  );
}
