import React, { useId } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type LogoBackground = 'primary' | 'dark' | 'app-icon' | 'transparent' | 'light-blue';
export type LogoStyle = 'bird' | 'ld';

export interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'nav-icon' | 'app-icon' | 'monogram' | 'wordmark' | 'bird' | 'bird-icon' | 'flying-bird' | 'ld';
  logoStyle?: LogoStyle;
  background?: LogoBackground;
  active?: boolean;
  size?: number;
  subtitle?: string;
  badge?: string;
  monochrome?: boolean;
}

/**
 * Modern LearnDean 'L' Vector Path:
 * Represents "Learn": Bold vertical pillar on the left with rounded cap,
 * sweeping down and extending horizontally to form the solid foundation under the mark.
 */
export const LD_L_PATH =
  "M 26 24 C 26 20.686 28.686 18 32 18 L 36 18 C 39.314 18 42 20.686 42 24 L 42 74 C 42 77.314 44.686 80 48 80 L 88 80 C 91.314 80 94 82.686 94 86 C 94 89.314 91.314 92 88 92 L 44 92 C 34.059 92 26 83.941 26 74 Z";

/**
 * Modern LearnDean 'd' Vector Path:
 * Represents "Dean": Features a tall vertical ascender on the right, and a friendly,
 * geometric circular bowl on the left with a dedicated central aperture.
 */
export const LD_D_PATH =
  "M 76 24 C 76 20.686 78.686 18 82 18 L 84 18 C 87.314 18 90 20.686 90 24 L 90 86 C 90 89.314 87.314 92 84 92 C 80.686 92 78 89.314 78 86 L 78 78 C 73.8 82.2 67.2 84.5 59.5 84.5 C 46.521 84.5 36 73.979 36 61 C 36 48.021 46.521 37.5 59.5 37.5 C 67.2 37.5 73.8 39.8 78 44 L 78 24 Z M 78 61 L 78 52.5 C 74.5 49.2 69 47 60 47 C 52.268 47 46 53.268 46 61 C 46 68.732 52.268 75 60 75 C 69 75 74.5 72.8 78 69.5 Z";

/**
 * 4-Pointed AI Intelligence Core Spark:
 * Represents intelligence, enlightenment, and precision learning.
 */
export const LD_SPARK_PATH =
  "M 60 51 Q 60 61 70 61 Q 60 61 60 71 Q 60 61 50 61 Q 60 61 60 51 Z";

export const LD_MONOGRAM_PATH = `${LD_L_PATH} ${LD_D_PATH}`;

/**
 * 1. LearnDean New 'L and d' Emblem (SVG)
 * Balanced modern geometric monogram with deep sapphire-azure gradients & golden AI core.
 * Bulletproof on mobile, iOS Safari, PWA, and desktop.
 */
export function LearnDeanLDEmblem({
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
  const isDarkSurface = background === 'dark' || background === 'app-icon';
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const bgId = `ld-bg-${uid}`;
  const lDarkId = `ld-l-dark-${uid}`;
  const dDarkId = `ld-d-dark-${uid}`;
  const lLightId = `ld-l-light-${uid}`;
  const dLightId = `ld-d-light-${uid}`;
  const sparkId = `ld-spark-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} block transition-transform ${active ? 'scale-105' : ''}`}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#051636" />
          <stop offset="45%" stopColor="#0A367E" />
          <stop offset="85%" stopColor="#1463D5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id={lLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#071A3D" />
          <stop offset="60%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id={dLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        <linearGradient id={lDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id={dDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id={sparkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Background Shapes with Solid Fallback */}
      {background === 'primary' && (
        <rect width="120" height="120" rx="28" fill="#FFFFFF" />
      )}
      {background === 'dark' && (
        <rect width="120" height="120" rx="28" fill="#071A3D" />
      )}
      {background === 'app-icon' && (
        <>
          <rect width="120" height="120" rx="28" fill="#0B3C8A" />
          <rect width="120" height="120" rx="28" fill={`url(#${bgId})`} />
        </>
      )}
      {background === 'light-blue' && (
        <rect width="120" height="120" rx="28" fill="#EAF4FF" />
      )}

      {/* Main Elements */}
      <g>
        {/* Letter 'L' (Foundation & Vertical Pillar) */}
        <path
          d={LD_L_PATH}
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${lDarkId})`
              : `url(#${lLightId})`
          }
        />

        {/* Letter 'd' (Bowl & Ascender) */}
        <path
          d={LD_D_PATH}
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${dDarkId})`
              : `url(#${dLightId})`
          }
        />

        {/* Golden Intelligence Spark */}
        <path
          d={LD_SPARK_PATH}
          fill={monochrome ? "currentColor" : `url(#${sparkId})`}
        />
      </g>
    </svg>
  );
}

/**
 * 2. LearnDean Flying Bird Holding a Book Emblem (SVG)
 * Majestic soaring bird carrying the open book of wisdom in flight.
 * Multi-device compatible: 100% visible on mobile, tablet, iOS, Android, PWA, and desktop.
 */
export function LearnDeanBirdEmblem({
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
  const isDarkSurface = background === 'dark' || background === 'app-icon';
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const bgId = `bird-bg-${uid}`;
  const wingDarkId = `bird-wing-dark-${uid}`;
  const wingLightId = `bird-wing-light-${uid}`;
  const innerDarkId = `bird-inner-dark-${uid}`;
  const innerLightId = `bird-inner-light-${uid}`;
  const headDarkId = `bird-head-dark-${uid}`;
  const headLightId = `bird-head-light-${uid}`;
  const goldId = `bird-gold-${uid}`;
  const pagesDarkId = `bird-pages-dark-${uid}`;
  const pagesLightId = `bird-pages-light-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} block transition-transform ${active ? 'scale-105' : ''}`}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#051636" />
          <stop offset="40%" stopColor="#0A367E" />
          <stop offset="80%" stopColor="#1463D5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        <linearGradient id={wingDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#BAE6FD" />
          <stop offset="75%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id={wingLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#071A3D" />
          <stop offset="45%" stopColor="#1E40AF" />
          <stop offset="85%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id={innerDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>

        <linearGradient id={innerLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient id={headDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>

        <linearGradient id={headLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id={pagesDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id={pagesLightId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* Optional Backgrounds with Solid Fallbacks */}
      {background === 'primary' && (
        <rect width="120" height="120" rx="28" fill="#FFFFFF" />
      )}
      {background === 'dark' && (
        <rect width="120" height="120" rx="28" fill="#071A3D" />
      )}
      {background === 'app-icon' && (
        <>
          <rect width="120" height="120" rx="28" fill="#0A367E" />
          <rect width="120" height="120" rx="28" fill={`url(#${bgId})`} />
        </>
      )}
      {background === 'light-blue' && (
        <rect width="120" height="120" rx="28" fill="#EAF4FF" />
      )}

      {/* Bird and Open Book Artboard */}
      <g>
        {/* Tail Feathers */}
        <path
          d="M 56 61 L 52 71 L 57 69 L 60 74 L 63 69 L 68 71 L 64 61 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${innerDarkId})`
              : `url(#${innerLightId})`
          }
        />

        {/* Left Wing (Primary Feathers) */}
        <path
          d="M 52 46 C 46 36 34 24 16 20 C 15 25 19 30 25 35 C 27 36 29 36 30 35 C 25 40 25 46 30 50 C 32 51 34 51 35 50 C 31 54 33 60 40 61 C 45 62 49 55 52 46 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${wingDarkId})`
              : `url(#${wingLightId})`
          }
        />
        <path
          d="M 50 46 C 43 37 34 31 24 26 C 29 31 35 38 43 43 C 47 45 49 46 50 46 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${innerDarkId})`
              : `url(#${innerLightId})`
          }
          opacity={monochrome ? 0.6 : 0.85}
        />

        {/* Right Wing (Primary Feathers) */}
        <path
          d="M 68 46 C 74 36 86 24 104 20 C 105 25 101 30 95 35 C 93 36 91 36 90 35 C 95 40 95 46 90 50 C 88 51 86 51 85 50 C 89 54 87 60 80 61 C 75 62 71 55 68 46 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${wingDarkId})`
              : `url(#${wingLightId})`
          }
        />
        <path
          d="M 70 46 C 77 37 86 31 96 26 C 91 31 85 38 77 43 C 73 45 71 46 70 46 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${innerDarkId})`
              : `url(#${innerLightId})`
          }
          opacity={monochrome ? 0.6 : 0.85}
        />

        {/* Bird Head, Beak & Torso */}
        <path
          d="M 56 46 C 55 40 56 32 57 28 C 57.5 24 58.5 20 60 16 L 60 12 L 62 18 C 63.5 22 64 30 64 46 C 64 54 62 60 60 63 C 58 60 56 54 56 46 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${headDarkId})`
              : `url(#${headLightId})`
          }
        />

        {/* Eye of Wisdom */}
        <circle
          cx="58.5"
          cy="22"
          r="1.3"
          fill={monochrome ? "currentColor" : `url(#${goldId})`}
        />

        {/* Open Book Underpage / Binding Layer */}
        <path
          d="M 28 84 C 42 80 52 82 60 87 C 68 82 78 80 92 84 L 92 87 C 78 83 68 85 60 90 C 52 85 42 83 28 87 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? "#0F172A"
              : "#94A3B8"
          }
          opacity={0.85}
        />

        {/* Open Book Left Page Spread */}
        <path
          d="M 60 70 C 52 66 42 66 28 70 C 27 71 27 82 28 84 C 42 80 52 82 60 87 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${pagesDarkId})`
              : `url(#${pagesLightId})`
          }
          stroke={monochrome ? undefined : isDarkSurface ? "#E2E8F0" : "#CBD5E1"}
          strokeWidth="0.8"
        />

        {/* Open Book Right Page Spread */}
        <path
          d="M 60 70 C 68 66 78 66 92 70 C 93 71 93 82 92 84 C 78 80 68 82 60 87 Z"
          fill={
            monochrome
              ? "currentColor"
              : isDarkSurface
              ? `url(#${pagesDarkId})`
              : `url(#${pagesLightId})`
          }
          stroke={monochrome ? undefined : isDarkSurface ? "#E2E8F0" : "#CBD5E1"}
          strokeWidth="0.8"
        />

        {/* Book Page Wisdom Script Lines */}
        <path
          d="M 35 74 C 42 71 48 72 54 74.5"
          stroke={monochrome ? "currentColor" : isDarkSurface ? "#94A3B8" : "#64748B"}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={monochrome ? 0.5 : 1}
        />
        <path
          d="M 36 78 C 42 75 48 76 54 78.5"
          stroke={monochrome ? "currentColor" : isDarkSurface ? "#94A3B8" : "#64748B"}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={monochrome ? 0.5 : 1}
        />
        <path
          d="M 66 74.5 C 72 72 78 71 85 74"
          stroke={monochrome ? "currentColor" : isDarkSurface ? "#94A3B8" : "#64748B"}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={monochrome ? 0.5 : 1}
        />
        <path
          d="M 66 78.5 C 72 76 78 75 84 78"
          stroke={monochrome ? "currentColor" : isDarkSurface ? "#94A3B8" : "#64748B"}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={monochrome ? 0.5 : 1}
        />

        {/* Bird Talons Grasping Book Top Rim */}
        <path
          d="M 52 64 C 51 67 52 70 55 70 C 56 70 56 67 55 64 Z"
          fill={monochrome ? "currentColor" : `url(#${goldId})`}
        />
        <path
          d="M 68 64 C 69 67 68 70 65 70 C 64 70 64 67 65 64 Z"
          fill={monochrome ? "currentColor" : `url(#${goldId})`}
        />

        {/* Golden Bookmark Ribbon Hanging from Book Spine */}
        <path
          d="M 58.5 87 L 58.5 97 L 60 95 L 61.5 97 L 61.5 87 Z"
          fill={monochrome ? "currentColor" : `url(#${goldId})`}
        />
      </g>
    </svg>
  );
}

// Alias for explicit clarity
export const LearnDeanBirdLogo = LearnDeanBirdEmblem;

/**
 * Universal LearnDean Emblem:
 * Dynamically renders the active brand mark ('bird' or 'ld').
 * Falls back to the user's settings, or default 'bird'.
 */
export function LearnDeanEmblem({
  className = "w-6 h-6",
  active = false,
  monochrome = false,
  background = 'transparent',
  logoStyle,
}: {
  className?: string;
  active?: boolean;
  monochrome?: boolean;
  background?: LogoBackground;
  logoStyle?: LogoStyle;
}) {
  let authStyle: LogoStyle | undefined;
  try {
    const auth = useAuth();
    authStyle = auth?.settings?.logoStyle;
  } catch (_) {
    // In case used outside AuthProvider context
  }

  // The official LearnDean logo everywhere is the flying bird carrying the open book of wisdom
  return (
    <LearnDeanBirdEmblem
      className={className}
      active={active}
      monochrome={monochrome}
      background={background}
    />
  );
}

/**
 * Standalone App Icon:
 * Clean squircle app icon container with active state elevation.
 * Fixed for mobile and all screen DPIs.
 */
export function LearnDeanAppIcon({
  className = "w-10 h-10 shrink-0",
  background = 'app-icon',
  active = false,
  logoStyle,
}: {
  className?: string;
  background?: LogoBackground;
  active?: boolean;
  logoStyle?: LogoStyle;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl sm:rounded-2xl overflow-hidden aspect-square select-none transition-all duration-200 ${
        active ? 'ring-2 ring-blue-500 scale-[1.03]' : ''
      } ${className}`}
    >
      <LearnDeanEmblem
        className="w-full h-full block"
        background={background}
        active={active}
        logoStyle={logoStyle}
      />
    </div>
  );
}

/**
 * LearnDean Wordmark Lockup:
 * Pairs the chosen brand emblem with bold typography and PRO badge.
 */
export function LearnDeanWordmark({
  className = "",
  background = 'transparent',
  showBadge = true,
  badgeText = "PRO",
  subtitle = "AI Learning System",
  logoStyle,
}: {
  className?: string;
  background?: LogoBackground;
  showBadge?: boolean;
  badgeText?: string;
  subtitle?: string;
  logoStyle?: LogoStyle;
}) {
  const isDarkBg = background === 'dark' || background === 'app-icon';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      <LearnDeanAppIcon
        className="w-9 h-9 sm:w-10 sm:h-10"
        background={background === 'transparent' ? 'app-icon' : background}
        logoStyle={logoStyle}
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-base sm:text-lg md:text-xl font-black tracking-tight leading-none ${
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
 * Primary Unified LearnDean Logo Component:
 * Fully responsive on mobile, tablet, and desktop.
 */
export default function Logo({
  className = "w-10 h-10 shrink-0",
  variant = 'full',
  logoStyle,
  background = 'transparent',
  active = false,
  badge = "PRO",
  subtitle = "Smart Prep System",
  monochrome = false,
}: LogoProps) {
  // Check if variant explicitly mandates a style
  const resolvedStyle: LogoStyle | undefined =
    variant === 'bird' || variant === 'bird-icon' || variant === 'flying-bird'
      ? 'bird'
      : variant === 'ld'
      ? 'ld'
      : logoStyle;

  // Nav Icon & Monogram (Transparent / inlined emblem)
  if (variant === 'nav-icon' || variant === 'monogram' || variant === 'bird' || variant === 'ld') {
    return (
      <LearnDeanEmblem
        className={className}
        active={active}
        background={background}
        monochrome={monochrome}
        logoStyle={resolvedStyle}
      />
    );
  }

  // Standalone App Icon inside squircle
  if (variant === 'icon' || variant === 'app-icon' || variant === 'bird-icon') {
    return (
      <LearnDeanAppIcon
        className={className}
        background={background === 'transparent' ? 'app-icon' : background}
        active={active}
        logoStyle={resolvedStyle}
      />
    );
  }

  // Full Wordmark with Emblem & Typography
  return (
    <LearnDeanWordmark
      className={className}
      background={background}
      badgeText={badge}
      subtitle={subtitle}
      logoStyle={resolvedStyle}
    />
  );
}
