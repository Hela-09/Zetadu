import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'nav-icon';
  active?: boolean;
  size?: number;
}

/**
 * Distinctive LearnDean AI Logo & Emblem
 * Communicates:
 * - Learning & Education: Geometric open book foundation
 * - Intelligence & AI: Rising 4-point radiant AI spark beacon
 * - Knowledge & Modern Technology: Crisp vector geometry with luminous gradients
 */
export function LearnDeanEmblem({
  className = "w-6 h-6",
  active = false,
  monochrome = false,
}: {
  className?: string;
  active?: boolean;
  monochrome?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ld-spark-grad" x1="16" y1="2.5" x2="16" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="ld-spark-white" x1="16" y1="2.5" x2="16" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="ld-glow-grad" x1="16" y1="8" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Subtle AI illumination aura when active */}
      {active && (
        <circle cx="16" cy="11" r="9" fill="url(#ld-glow-grad)" className="animate-pulse" />
      )}

      {/* Open Book of Knowledge Base (Learning, Education, Knowledge) */}
      <path
        d="M16 26.5C12.5 24.2 7.5 24.2 4 25.8V17.5C7.5 16 12.5 16 16 18.5M16 26.5C19.5 24.2 24.5 24.2 28 25.8V17.5C24.5 16 19.5 16 16 18.5M16 26.5V18.5"
        stroke={monochrome ? "currentColor" : active ? "#FFFFFF" : "currentColor"}
        strokeWidth={active ? "2.2" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rising AI Intelligence Spark / Beacon (AI, Intelligence, Modern Tech) */}
      <path
        d="M16 3C16 7.2 19.2 9.6 23 10C19.2 10.4 16 12.8 16 17C16 12.8 12.8 10.4 9 10C12.8 9.6 16 7.2 16 3Z"
        fill={monochrome ? "currentColor" : active ? "url(#ld-spark-white)" : "url(#ld-spark-grad)"}
        stroke={monochrome ? "currentColor" : active ? "#FFFFFF" : "#2563EB"}
        strokeWidth={active ? "1.6" : "1.3"}
        strokeLinejoin="round"
      />

      {/* Central Knowledge Core Node */}
      <circle
        cx="16"
        cy="10"
        r="1.2"
        fill={monochrome ? "currentColor" : active ? "#2563EB" : "#FFFFFF"}
      />
    </svg>
  );
}

export default function Logo({
  className = "w-10 h-10 shrink-0",
  variant = 'full',
  active = false,
}: LogoProps) {
  if (variant === 'nav-icon') {
    return <LearnDeanEmblem className={className} active={active} />;
  }

  if (variant === 'icon') {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-xl shrink-0 p-1.5 shadow-xs transition-transform ${
          active
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white dark:from-blue-600 dark:to-indigo-800'
        } ${className}`}
      >
        <LearnDeanEmblem className="w-full h-full text-white" active={active} />
      </div>
    );
  }

  // Full Wordmark + Icon
  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1.5 flex items-center justify-center shadow-xs">
        <LearnDeanEmblem className="w-full h-full text-white" active={active} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
            LearnDean
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 leading-none">
            PRO
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
          Smart Prep System
        </p>
      </div>
    </div>
  );
}
