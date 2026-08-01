'use client';

import { useEffect, useState } from 'react';

import { useSettingsStore } from '@/store';

export type ResolvedTheme = 'dark' | 'light';

const mediaQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export function resolveAppearance(
  appearance: 'dark' | 'light' | 'system'
): ResolvedTheme {
  if (appearance === 'system' && typeof window !== 'undefined') {
    return mediaQuery().matches ? 'dark' : 'light';
  }
  return appearance === 'dark' ? 'dark' : 'light';
}

export function useResolvedTheme(): ResolvedTheme {
  const appearance = useSettingsStore((s) => s.appearance);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveAppearance(appearance)
  );

  useEffect(() => {
    const apply = () => setResolved(resolveAppearance(appearance));
    apply();
    if (appearance !== 'system') return;
    const mq = mediaQuery();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [appearance]);

  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolved = useResolvedTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.style.colorScheme = resolved;
  }, [resolved]);

  return <>{children}</>;
}
