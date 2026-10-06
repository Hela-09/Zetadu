import React from 'react';

export type LogoBackground = 'primary' | 'dark' | 'app-icon' | 'transparent' | 'light-blue';

export interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'nav-icon' | 'app-icon' | 'monogram' | 'wordmark';
  background?: LogoBackground;
  active?: boolean;
  size?: number;
  subtitle?: string;
  badge?: string;
  monochrome?: boolean;
}

/**
 * Standard SVG Path Geometry for the LearnDean LD Monogram:
 * Creatively and seamlessly combines the letters 'L' and 'D' into one memorable, modern mark.
 * - The vertical stem on the left forms the 'L' with a distinct top cap and foundation.
 * - The sweeping aerodynamic arch on the right forms the 'D'.
 * - Connected seamlessly along the bottom foundation with a 5px precision channel at the top.
 * - Uniform 18px stroke weight across all segments.
 */
export const LD_MONOGRAM_PATH = 
  "M 26 28 C 26 24.686 28.686 22 32 22 L 38 22 C 41.314 22 44 24.686 44 28 L 44 78 L 62 78 C 72.493 78 81 69.941 81 60 C 81 50.059 72.493 42 62 42 L 53 42 C 50.791 42 49 40.209 49 38 L 49 28 C 49 25.791 50.791 24 53 24 L 62 24 C 81.882 24 98 40.118 98 60 C 98 79.882 81.882 96 62 96 L 32 96 C 28.686 96 26 93.314 26 90 Z";

/**
 * 4-Pointed AI Intelligence Core Spark:
 * Represents education, intelligence, AI technology, and enlightenment.
 * Positioned optically in the center of the monogram's aperture.
 */
export const LD_SPARK_PATH = 
  "M 62.5 51 Q 62.5 60 71.5 60 Q 62.5 60 62.5 69 Q 62.5 60 53.5 60 Q 62.5 60 62.5 51 Z";

/**
 * LearnDean LD Monogram Emblem (SVG)
 * Scalable vector mark designed for navigation, small mobile app icons, and branding.
 * Supports all 5 background options:
 * 1. Primary: Solid white #FFFFFF
 * 2. Dark mode: Deep navy #071A3D
 * 3. App icon: Deep blue gradient #071A3D -> #1769E0
 * 4. Transparent: No background, for flexible website/app use
 * 5. Light blue: #EAF4FF for educational UI sections
 */
export function LearnDeanEmblem({
  className = "w-6 h-6",
  active = false,
  monochrome = false,
  background = 'transparent',
}: {
  className?: string;
  active?: boolean;
  monochrome?: boolean;
  background?: LogoBackground;
}) {
  const isWhiteMonogram = background === 'dark' || background === 'app-icon';

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform ${active ? 'scale-105' : ''}`}
      aria-hidden="true"
    >
      <defs>
        {/* Premium Deep Navy to Electric Blue with subtle purple accent */}
        <linearGradient id="ld-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#071A3D" />
          <stop offset="35%" stopColor="#0B3C8A" />
          <stop offset="70%" stopColor="#1769E0" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Crisp White-to-Ice gradient for app icon and dark mode */}
        <linearGradient id="ld-white-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EAF4FF" />
        </linearGradient>

        {/* App Icon Deep Blue Gradient Background: #071A3D -> #1769E0 */}
        <linearGradient id="ld-app-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#071A3D" />
          <stop offset="55%" stopColor="#0D47A1" />
          <stop offset="100%" stopColor="#1769E0" />
        </linearGradient>

        {/* AI Spark Accent Gradient */}
        <linearGradient id="ld-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Background Options (No shadows, patterns, or unnecessary decorations) */}
      {background === 'primary' && (
        <rect width="120" height="120" rx="28" fill="#FFFFFF" />
      )}
      {background === 'dark' && (
        <rect width="120" height="120" rx="28" fill="#071A3D" />
      )}
      {background === 'app-icon' && (
        <rect width="120" height="120" rx="28" fill="url(#ld-app-bg)" />
      )}
      {background === 'light-blue' && (
        <rect width="120" height="120" rx="28" fill="#EAF4FF" />
      )}

      {/* Seamless LD Monogram Body */}
      <path
        d={LD_MONOGRAM_PATH}
        fill={
          monochrome
            ? "currentColor"
            : isWhiteMonogram
            ? "url(#ld-white-grad)"
            : "url(#ld-brand-grad)"
        }
      />

      {/* AI Intelligence Core Spark */}
      <path
        d={LD_SPARK_PATH}
        fill={
          monochrome
            ? "currentColor"
            : isWhiteMonogram
            ? "#38BDF8"
            : background === 'light-blue'
            ? "#0284C7"
            : "url(#ld-spark-grad)"
        }
      />
    </svg>
  );
}

/**
 * Standalone App Icon:
 * Clean rounded-square app icon with the deep blue gradient background (#071A3D -> #1769E0)
 * and brilliant white LD monogram mark.
 */
export function LearnDeanAppIcon({
  className = "w-10 h-10 shrink-0",
  background = 'app-icon',
  active = false,
}: {
  className?: string;
  background?: LogoBackground;
  active?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden transition-all duration-200 ${
        active ? 'ring-2 ring-blue-500 scale-[1.03]' : ''
      } ${className}`}
    >
      <LearnDeanEmblem
        className="w-full h-full"
        background={background}
        active={active}
      />
    </div>
  );
}

/**
 * Matching LearnDean Wordmark lockup:
 * Pairs the LD monogram symbol with modern, bold typography.
 */
export function LearnDeanWordmark({
  className = "",
  background = 'transparent',
  showBadge = true,
  badgeText = "PRO",
  subtitle = "AI Learning System",
}: {
  className?: string;
  background?: LogoBackground;
  showBadge?: boolean;
  badgeText?: string;
  subtitle?: string;
}) {
  const isDarkBg = background === 'dark' || background === 'app-icon';

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <LearnDeanAppIcon
        className="w-10 h-10"
        background={background === 'transparent' ? 'app-icon' : background}
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg sm:text-xl font-black tracking-tight leading-none ${
            isDarkBg ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            <span>Learn</span>
            <span className={isDarkBg ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}>Dean</span>
          </span>
          {showBadge && (
            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded leading-none ${
              isDarkBg
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
            }`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`text-[11px] font-medium tracking-wide -mt-0.5 truncate ${
            isDarkBg ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Primary Unified LearnDean Logo Component
 * Supports all variants: 'icon', 'full', 'nav-icon', 'app-icon', 'monogram', and 'wordmark'.
 */
export default function Logo({
  className = "w-10 h-10 shrink-0",
  variant = 'full',
  background = 'transparent',
  active = false,
  badge = "PRO",
  subtitle = "Smart Prep System",
  monochrome = false,
}: LogoProps) {
  // Nav Icon (Standalone LD Emblem inside navigation bars)
  if (variant === 'nav-icon' || variant === 'monogram') {
    return (
      <LearnDeanEmblem
        className={className}
        active={active}
        background={background}
        monochrome={monochrome}
      />
    );
  }

  // Standalone App Icon inside rounded square
  if (variant === 'icon' || variant === 'app-icon') {
    return (
      <LearnDeanAppIcon
        className={className}
        background={background === 'transparent' ? 'app-icon' : background}
        active={active}
      />
    );
  }

  // Full Wordmark with Monogram & Typography
  return (
    <LearnDeanWordmark
      className={className}
      background={background}
      badgeText={badge}
      subtitle={subtitle}
    />
  );
}
