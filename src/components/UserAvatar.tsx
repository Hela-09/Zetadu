import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  alt?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
  hero: 'w-24 h-24 sm:w-28 sm:h-28 text-3xl',
};

const ICON_SIZE_MAP = {
  xs: 12,
  sm: 15,
  md: 18,
  lg: 22,
  xl: 28,
  '2xl': 40,
  hero: 44,
};

export default function UserAvatar({
  photoURL,
  displayName,
  email,
  size = 'md',
  className = '',
  alt = 'User Avatar',
  onClick,
}: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(photoURL || null);
  const [hasError, setHasError] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setImgSrc(photoURL || null);
    setHasError(false);
  }, [photoURL]);

  // Listen for real-time profile picture update broadcasts
  useEffect(() => {
    const handleAvatarUpdate = (e: any) => {
      const newUrl = e?.detail?.photoURL;
      setImgSrc(newUrl || null);
      setHasError(false);
    };

    window.addEventListener('profile-picture-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('profile-picture-updated', handleAvatarUpdate);
    };
  }, []);

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const iconSize = ICON_SIZE_MAP[size] || 18;

  const initial = (displayName?.trim()?.charAt(0) || email?.trim()?.charAt(0) || '').toUpperCase();

  const handleImgError = () => {
    setHasError(true);
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${sizeClass} ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
      aria-label={alt}
    >
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={alt}
          onError={handleImgError}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : initial ? (
        <div className="w-full h-full flex items-center justify-center font-black tracking-tight text-white bg-gradient-to-tr from-blue-600 to-indigo-600">
          {initial}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
          <UserIcon size={iconSize} />
        </div>
      )}
    </div>
  );
}
