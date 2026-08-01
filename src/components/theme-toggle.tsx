'use client';

import { Moon, Monitor, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store';

const ORDER = ['system', 'light', 'dark'] as const;

const ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

const LABELS = {
  system: 'Follow system theme',
  light: 'Switch to dark mode',
  dark: 'Switch to light mode',
} as const;

export function ThemeToggle() {
  const appearance = useSettingsStore((s) => s.appearance);
  const setAppearance = useSettingsStore((s) => s.setAppearance);

  const Icon = ICONS[appearance] ?? Monitor;

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(appearance) + 1) % ORDER.length];
    setAppearance(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={cycle}
      aria-label={LABELS[appearance] ?? 'Change theme'}
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </Button>
  );
}
