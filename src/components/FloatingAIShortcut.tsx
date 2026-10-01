import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, BrainCircuit } from 'lucide-react';

interface FloatingAIShortcutProps {
  onOpenTutor?: () => void;
}

const STORAGE_KEY = 'learndean_floating_ai_pos';
const BUTTON_SIZE = 52; // 52x52px touch-friendly floating action button

export default function FloatingAIShortcut({ onOpenTutor }: FloatingAIShortcutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the floating icon when the user is already inside the AI Tutor
  const isTutorPage = 
    location.pathname === '/ai-tutor' || 
    location.pathname === '/tutor' || 
    location.pathname.startsWith('/ai-tutor/');

  // Clamping helper to keep the icon inside safe visible screen bounds
  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };

    const isMobile = window.innerWidth < 768;
    const paddingX = 12;
    const minX = paddingX;
    const maxX = Math.max(minX, window.innerWidth - BUTTON_SIZE - paddingX);

    // Keep below top app header and safely above bottom navigation bar
    const minY = 68;
    const bottomNavHeight = isMobile ? 86 : 24;
    const maxY = Math.max(minY, window.innerHeight - BUTTON_SIZE - bottomNavHeight);

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  }, []);

  // Default initial position (bottom right, floating safely above content & bottom nav)
  const getDefaultPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 200, y: 500 };

    const isMobile = window.innerWidth < 768;
    const marginX = isMobile ? 16 : 28;
    const marginY = isMobile ? 96 : 36; // leaves comfortable clearance above mobile bottom nav

    return clampPosition(
      window.innerWidth - BUTTON_SIZE - marginX,
      window.innerHeight - BUTTON_SIZE - marginY
    );
  }, [clampPosition]);

  // Position state with localStorage persistence
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 200, y: 500 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return parsed;
        }
      }
    } catch (_) {}

    return { x: -9999, y: -9999 }; // marker to calculate on client mount
  });

  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Drag tracking refs
  const dragStartClientPos = useRef({ x: 0, y: 0 });
  const dragStartElementPos = useRef({ x: 0, y: 0 });
  const hasMovedSignificantRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);

  // Initialize and handle window resize re-clamping
  useEffect(() => {
    const handleReclamp = () => {
      setPosition((prev) => {
        if (prev.x < 0) {
          const def = getDefaultPosition();
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
          } catch (_) {}
          return def;
        }
        const clamped = clampPosition(prev.x, prev.y);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clamped));
        } catch (_) {}
        return clamped;
      });
      setIsReady(true);
    };

    handleReclamp();
    window.addEventListener('resize', handleReclamp);
    window.addEventListener('orientationchange', handleReclamp);

    return () => {
      window.removeEventListener('resize', handleReclamp);
      window.removeEventListener('orientationchange', handleReclamp);
    };
  }, [clampPosition, getDefaultPosition]);

  // Click handler to open AI Tutor
  const handleOpenAI = useCallback(() => {
    if (onOpenTutor) {
      onOpenTutor();
    } else {
      navigate('/ai-tutor');
    }
  }, [navigate, onOpenTutor]);

  // Pointer Down (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only respond to primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDownRef.current = true;
    hasMovedSignificantRef.current = false;
    activePointerIdRef.current = e.pointerId;

    dragStartClientPos.current = { x: e.clientX, y: e.clientY };
    dragStartElementPos.current = { ...position };

    // Capture pointer events so dragging outside the button continues seamlessly
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPointerDownRef.current || activePointerIdRef.current !== e.pointerId) return;

    const dx = e.clientX - dragStartClientPos.current.x;
    const dy = e.clientY - dragStartClientPos.current.y;
    const distance = Math.hypot(dx, dy);

    // If moved more than 5px, it is considered a drag gesture, not a simple tap
    if (distance > 5) {
      if (!hasMovedSignificantRef.current) {
        hasMovedSignificantRef.current = true;
        setIsDragging(true);
      }

      const nextX = dragStartElementPos.current.x + dx;
      const nextY = dragStartElementPos.current.y + dy;
      const clamped = clampPosition(nextX, nextY);
      setPosition(clamped);
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isPointerDownRef.current || activePointerIdRef.current !== e.pointerId) return;

    isPointerDownRef.current = false;
    activePointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (hasMovedSignificantRef.current) {
      // Finished dragging: save final position to localStorage
      setIsDragging(false);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      } catch (_) {}
    } else {
      // It was a clean tap/click: open AI Tutor
      setIsDragging(false);
      handleOpenAI();
    }
  };

  // Pointer Cancel
  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    isPointerDownRef.current = false;
    activePointerIdRef.current = null;
    setIsDragging(false);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenAI();
    }
  };

  // Don't render on the AI Tutor page itself, or before initial position calculation
  if (isTutorPage || !isReady || position.x < 0) {
    return null;
  }

  return (
    <div
      className="fixed z-50 select-none pointer-events-none transition-opacity duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${BUTTON_SIZE}px`,
        height: `${BUTTON_SIZE}px`,
      }}
    >
      <button
        type="button"
        id="learndean-floating-ai-shortcut-btn"
        role="button"
        tabIndex={0}
        aria-label="Open LearnDean AI Tutor (draggable shortcut)"
        title="Open AI Tutor (Drag to reposition)"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        className={`pointer-events-auto relative w-full h-full rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 touch-none select-none transition-transform ${
          isDragging
            ? 'scale-110 shadow-2xl ring-2 ring-blue-400/80 shadow-blue-600/40'
            : 'hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl shadow-blue-900/30 dark:shadow-black/50'
        }`}
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
        }}
      >
        {/* Glowing Aura Ring */}
        <span
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur-xs -z-10 animate-pulse pointer-events-none"
          aria-hidden="true"
        />

        {/* Outer border highlight */}
        <span className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none" />

        {/* AI Tutor Icon */}
        <div className="relative flex items-center justify-center text-white">
          <BrainCircuit size={24} className="animate-in fade-in duration-200" />
          <Sparkles
            size={11}
            className="absolute -top-1 -right-1 text-amber-300 animate-pulse fill-amber-300 pointer-events-none"
          />
        </div>

        {/* Mini "AI" badge on the corner */}
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-md shadow-xs border border-white/60 tracking-wider">
          AI
        </span>
      </button>
    </div>
  );
}
