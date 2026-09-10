import { ViewType } from '../types';

export const VIEW_TO_PATH: Record<ViewType, string> = {
  home: '/home',
  subjects: '/learn',
  practice: '/practice',
  tutor: '/ai-tutor',
  profile: '/profile',
  admin: '/admin',
  opportunities: '/opportunities',
  daily_challenge: '/daily-challenge',
  flashcards: '/flashcards',
  journey: '/study-journey',
  weak_topics: '/weak-topics',
  upload_notes: '/upload-notes',
  school_updates: '/school-updates',
};

export const PATH_TO_VIEW: Record<string, ViewType> = {
  '/': 'home',
  '': 'home',
  '/home': 'home',
  '/ai-tutor': 'tutor',
  '/tutor': 'tutor',
  '/learn': 'subjects',
  '/subjects': 'subjects',
  '/practice': 'practice',
  '/flashcards': 'flashcards',
  '/profile': 'profile',
  '/settings': 'profile',
  '/admin': 'admin',
  '/opportunities': 'opportunities',
  '/explore': 'opportunities',
  '/daily-challenge': 'daily_challenge',
  '/daily_challenge': 'daily_challenge',
  '/study-journey': 'journey',
  '/journey': 'journey',
  '/weak-topics': 'weak_topics',
  '/weak_topics': 'weak_topics',
  '/upload-notes': 'upload_notes',
  '/upload_notes': 'upload_notes',
  '/school-updates': 'school_updates',
  '/school_updates': 'school_updates',
};

export interface ZetaduHistoryState {
  view: ViewType;
  subState?: Record<string, any> | null;
  timestamp?: number;
}

/**
 * Parses the current ViewType from browser history state, path, hash, or query parameter.
 */
export function getViewFromLocation(): ViewType {
  if (typeof window === 'undefined') return 'home';

  // 1. Check window.history.state first
  if (window.history.state && typeof window.history.state.view === 'string') {
    const stateView = window.history.state.view as ViewType;
    if (stateView in VIEW_TO_PATH) {
      return stateView;
    }
  }

  // 2. Check window.location.pathname
  const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
  if (PATH_TO_VIEW[cleanPath]) {
    return PATH_TO_VIEW[cleanPath];
  }

  // 3. Check window.location.hash (e.g. #/tutor or #tutor)
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
    const cleanHash = '/' + hash;
    if (PATH_TO_VIEW[cleanHash]) {
      return PATH_TO_VIEW[cleanHash];
    }
  }

  // 4. Check query parameter (?view=tutor)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const viewParam = searchParams.get('view') as ViewType;
    if (viewParam && viewParam in VIEW_TO_PATH) {
      return viewParam;
    }
  } catch (e) {
    // Ignore URLSearchParams error
  }

  return 'home';
}

/**
 * Returns the URL path corresponding to a ViewType.
 */
export function getPathForView(view: ViewType): string {
  return VIEW_TO_PATH[view] || '/';
}

/**
 * Pushes a new view entry onto the browser / PWA history stack.
 */
export function pushViewToHistory(view: ViewType, subState?: Record<string, any> | null) {
  if (typeof window === 'undefined') return;

  const targetPath = getPathForView(view);
  const state: ZetaduHistoryState = {
    view,
    subState: subState || null,
    timestamp: Date.now(),
  };

  try {
    window.history.pushState(state, '', targetPath);
  } catch (e) {
    console.warn('[Zetadu Navigation] pushState error:', e);
  }
}

/**
 * Replaces the current browser / PWA history entry.
 */
export function replaceViewInHistory(view: ViewType, subState?: Record<string, any> | null) {
  if (typeof window === 'undefined') return;

  const targetPath = getPathForView(view);
  const state: ZetaduHistoryState = {
    view,
    subState: subState || null,
    timestamp: Date.now(),
  };

  try {
    window.history.replaceState(state, '', targetPath);
  } catch (e) {
    console.warn('[Zetadu Navigation] replaceState error:', e);
  }
}

/**
 * Safely navigates back via browser history if available,
 * or falls back to navigating to a designated view.
 */
export function goBackOrFallback(fallbackView: ViewType = 'home', fallbackAction?: () => void) {
  if (typeof window === 'undefined') return;

  // If there is history inside this window session, go back
  if (window.history.length > 1) {
    window.history.back();
  } else if (fallbackAction) {
    fallbackAction();
  } else {
    pushViewToHistory(fallbackView);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { view: fallbackView } }));
  }
}
