'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'sx-theme';

/**
 * Runs before the page paints, so a stored preference never flashes the
 * wrong theme. CSS reads `data-sx-theme` on <html>; with no attribute the
 * system preference applies.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-sx-theme',t)}else{document.documentElement.removeAttribute('data-sx-theme')}}catch(e){}})();`;

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolved: 'light',
  setPreference: () => {},
});

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function HomeThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    setPreferenceState(readPreference());
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    // The attribute stays on <html> after leaving the page; it only matters
    // while #sx-home is mounted, and removing it here would undo the stored
    // choice on a strict-mode remount.
    return () => query.removeEventListener('change', onChange);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the choice still applies to this visit.
    }
    if (next === 'system') {
      document.documentElement.removeAttribute('data-sx-theme');
    } else {
      document.documentElement.setAttribute('data-sx-theme', next);
    }
  }, []);

  const resolved: ResolvedTheme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useHomeTheme() {
  return useContext(ThemeContext);
}

const OPTIONS: Array<{ value: ThemePreference; icon: ReactNode }> = [
  {
    value: 'system',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
        <path
          d="M2.67 2h10.66c.74 0 1.34.6 1.34 1.33V10c0 .74-.6 1.33-1.34 1.33H2.67c-.74 0-1.34-.6-1.34-1.33V3.33c0-.73.6-1.33 1.34-1.33ZM5.33 14h5.34M8 11.33V14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: 'light',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
        <path
          d="M10.67 8a2.67 2.67 0 1 1-5.34 0 2.67 2.67 0 0 1 5.34 0ZM8 1.33v1.34M8 13.33v1.34M3.29 3.29l.94.94M11.77 11.77l.94.94M1.33 8h1.34M13.33 8h1.34M4.23 11.77l-.94.94M12.71 3.29l-.94.94"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: 'dark',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
        <path
          d="M8 2a4.24 4.24 0 0 0 6 6 6 6 0 1 1-6-6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function ThemeToggle({
  labels,
}: {
  labels: Record<ThemePreference, string>;
}) {
  const { preference, setPreference } = useHomeTheme();
  return (
    <div className="sx-theme-toggle" role="radiogroup" aria-label="Theme">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={preference === option.value}
          aria-label={labels[option.value]}
          title={labels[option.value]}
          className="sx-theme-option"
          data-active={preference === option.value || undefined}
          onClick={() => setPreference(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
