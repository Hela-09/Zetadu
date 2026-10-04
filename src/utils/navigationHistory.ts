import { NavigateFunction } from 'react-router-dom';

const STACK_STORAGE_KEY = 'learndean_route_history_stack';
const MAX_STACK_SIZE = 50;

/**
 * Reads the route stack from sessionStorage.
 */
function getStoredStack(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes the route stack to sessionStorage.
 */
function setStoredStack(stack: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = stack.slice(-MAX_STACK_SIZE);
    sessionStorage.setItem(STACK_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

/**
 * Tracks route changes into a persistent navigation history stack.
 * Call this in a top-level effect in App.tsx on location change.
 */
export function recordRoute(fullPath: string) {
  if (typeof window === 'undefined' || !fullPath) return;

  const stack = getStoredStack();
  const last = stack[stack.length - 1];

  // If same route, don't duplicate
  if (last === fullPath) return;

  // If user navigated backwards to an earlier route in the stack, trim up to that route
  const existingIndex = stack.lastIndexOf(fullPath);
  if (existingIndex !== -1 && existingIndex < stack.length - 1) {
    const trimmed = stack.slice(0, existingIndex + 1);
    setStoredStack(trimmed);
    return;
  }

  // Push new route
  stack.push(fullPath);
  setStoredStack(stack);
}

/**
 * Returns the intelligent fallback path for any URL when no browser history is available.
 */
export function getContextualFallback(pathname: string): string {
  const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  // Sub-routes with clear parent relationships
  if (clean.startsWith('/practice/')) return '/practice';
  if (clean === '/practice') return '/study';

  if (clean.startsWith('/subjects/')) return '/subjects';
  if (clean.startsWith('/library/')) return '/library';
  if (clean === '/subjects' || clean === '/library') return '/learn';

  if (clean.startsWith('/novels/')) return '/novels';
  if (clean === '/novels' || clean === '/learn/novels') return '/learn';

  if (clean.startsWith('/study/')) return '/study';
  if (clean.startsWith('/jamb/')) return '/study';
  if (clean === '/jamb' || clean === '/jamb-prep' || clean === '/jamb-cbt') return '/study';
  if (clean === '/study') return '/home';

  if (clean.startsWith('/profile/')) return '/profile';
  if (clean === '/settings') return '/profile';
  if (clean === '/profile') return '/home';

  if (clean === '/ai-tutor' || clean === '/tutor') return '/learn';
  if (clean === '/flashcards' || clean.startsWith('/flashcards/')) return '/learn';
  if (clean === '/study-journey' || clean === '/journey') return '/learn';
  if (clean === '/weak-topics') return '/learn';
  if (clean === '/upload-notes' || clean === '/upload') return '/learn';
  if (clean === '/daily-challenge') return '/home';
  if (clean === '/learn') return '/home';

  return '/home';
}

/**
 * Returns the previous path from the navigation stack if available.
 */
export function getPreviousPath(): string | null {
  const stack = getStoredStack();
  if (stack.length >= 2) {
    return stack[stack.length - 2];
  }
  return null;
}

export const SECTION_ROOTS: Record<string, string> = {
  home: '/home',
  learn: '/learn',
  study: '/study',
  upload: '/upload-notes',
  profile: '/profile',
};

/**
 * Determines which of the 5 root navbar sections a given URL path belongs to:
 * 1. Home (/home)
 * 2. Learn (/learn, /library, /subjects, /flashcards, etc.)
 * 3. Study (/study, /jamb, /practice - Practice is inside Study)
 * 4. Upload (/upload-notes)
 * 5. Profile (/profile, /settings)
 */
export function getSectionForPath(path: string): 'home' | 'learn' | 'study' | 'upload' | 'profile' {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';

  if (clean.startsWith('/upload-notes') || clean.startsWith('/upload')) {
    return 'upload';
  }

  if (clean.startsWith('/profile') || clean.startsWith('/settings')) {
    return 'profile';
  }

  // Study: includes /study, /jamb, and /practice ("Practice is NOT a navigation item. Keep Practice inside Study")
  if (
    clean.startsWith('/study') ||
    clean.startsWith('/jamb') ||
    clean.startsWith('/practice')
  ) {
    return 'study';
  }

  if (
    clean === '/learn' ||
    clean.startsWith('/ai-tutor') ||
    clean.startsWith('/tutor') ||
    clean.startsWith('/flashcards') ||
    clean.startsWith('/study-journey') ||
    clean.startsWith('/journey') ||
    clean.startsWith('/library') ||
    clean.startsWith('/subjects') ||
    clean.startsWith('/novels') ||
    clean.startsWith('/weak-topics')
  ) {
    return 'learn';
  }

  return 'home';
}

/**
 * Completely terminates and clears temporary active practice session storage
 * and sends an abort signal to unmount and cancel active quiz timers.
 */
export function clearActivePracticeSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('practice_session');
    sessionStorage.removeItem('practice_timer_remaining');
    localStorage.removeItem('zetadu_target_question');
    localStorage.removeItem('zetadu_target_subject_id');
    localStorage.removeItem('zetadu_target_subject');
    localStorage.removeItem('zetadu_target_topic');
  } catch (_) {}

  try {
    window.dispatchEvent(new CustomEvent('learndean-abort-active-session'));
  } catch (_) {}
}

/**
 * Navigates to a root navbar section like Gospel Library.
 *
 * 1. Root destinations: Tapping a navbar tab always takes the user to the FIRST/MAIN page of that section.
 * 2. Tapping current tab returns immediately to that section's root main page.
 * 3. Does not keep previous deep pages open or lingering in the background.
 * 4. Preserves proper back history to previous section roots, avoiding always-Home behavior.
 */
export function navigateToRootSection(
  navigate: NavigateFunction,
  rootPath: string
) {
  if (typeof window === 'undefined') {
    navigate(rootPath);
    return;
  }

  // Clear any active quiz/practice session so it never restores unexpectedly
  clearActivePracticeSession();

  const currentPath = window.location.pathname;

  // If already at the main root page of this section, scroll to top
  if (currentPath === rootPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const stack = getStoredStack();
  const targetSection = getSectionForPath(rootPath);
  const currentSection = getSectionForPath(currentPath);

  if (targetSection === currentSection) {
    // Tapped the current navbar section while deep inside it (e.g. /practice/mathematics -> Learn tab)
    // Find where the root of this section was in history, or trim deep sub-routes
    const rootIndex = stack.findIndex(p => p.split('?')[0] === rootPath);
    if (rootIndex !== -1) {
      const trimmed = stack.slice(0, rootIndex + 1);
      setStoredStack(trimmed);
    } else {
      // Find where we entered this section and replace deep sub-routes with the root
      let lastOtherIndex = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (getSectionForPath(stack[i]) !== targetSection) {
          lastOtherIndex = i;
          break;
        }
      }
      const base = lastOtherIndex !== -1 ? stack.slice(0, lastOtherIndex + 1) : ['/home'];
      base.push(rootPath);
      setStoredStack(base);
    }
  } else {
    // Switching to a DIFFERENT navbar section (e.g. Learn -> JAMB)
    // Trim any deep sub-routes from the section we are leaving down to its root
    const leavingSectionRoot = SECTION_ROOTS[currentSection] || '/home';
    let base = [...stack];

    // Find the first occurrence of the section we are leaving and keep only its root
    const firstLeavingIdx = base.findIndex(p => getSectionForPath(p) === currentSection);
    if (firstLeavingIdx !== -1) {
      base = base.slice(0, firstLeavingIdx);
      base.push(leavingSectionRoot);
    }

    // If target rootPath is already in history, trim to it; otherwise push it
    const existingTargetIdx = base.findIndex(p => p.split('?')[0] === rootPath);
    if (existingTargetIdx !== -1) {
      base = base.slice(0, existingTargetIdx + 1);
    } else {
      base.push(rootPath);
    }
    setStoredStack(base);
  }

  navigate(rootPath);
}

/**
 * Standard, safe back navigation helper for all LearnDean components.
 * Follows the user's real browser/route history stack.
 *
 * 1. Checks if browser history has a previous entry in this session (history.state.idx > 0).
 * 2. If yes, invokes navigate(-1).
 * 3. If no, checks if our navigation stack has a previously visited route and navigates there.
 * 4. Otherwise, falls back to the contextual parent route (not hardcoded Home).
 */
export function appNavigateBack(
  navigate: NavigateFunction,
  options?: {
    fallback?: string;
    onBeforeBack?: () => void;
  }
) {
  if (options?.onBeforeBack) {
    options.onBeforeBack();
  }

  if (typeof window === 'undefined') {
    navigate(options?.fallback || '/home');
    return;
  }

  // 1. Check if the browser session history stack has a previous entry
  const historyIdx = (window.history.state && typeof window.history.state.idx === 'number')
    ? window.history.state.idx
    : null;

  if (historyIdx !== null && historyIdx > 0) {
    navigate(-1);
    return;
  }

  // 2. Check if window.history.length > 1 as fallback indicator
  if (window.history.length > 1 && historyIdx === null) {
    navigate(-1);
    return;
  }

  // 3. Check our persistent session route stack
  const prevRoute = getPreviousPath();
  const currentPath = window.location.pathname + window.location.search;
  if (prevRoute && prevRoute !== currentPath) {
    navigate(prevRoute);
    return;
  }

  // 4. Use provided fallback or contextual parent fallback
  const fallback = options?.fallback || getContextualFallback(window.location.pathname);
  navigate(fallback);
}
