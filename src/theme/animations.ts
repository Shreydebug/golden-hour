import { cubicBezier } from 'framer-motion';

export const easing = {
  apple: cubicBezier(0.32, 0.72, 0, 1),
  out: cubicBezier(0.22, 1, 0.36, 1),
  gentle: cubicBezier(0.4, 0, 0.2, 1),
  spring: cubicBezier(0.34, 1.4, 0.64, 1),
} as const;

export const durations = {
  micro: 0.2,
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  hero: 1.2,
  background: 48,
} as const;

export const drift = {
  one: 40,
  two: 52,
  three: 60,
} as const;

export const stagger = {
  cards: 0.12,
  hero: 0.16,
} as const;

export const keyframes = {
  drift1: 'drift-1',
  drift2: 'drift-2',
  drift3: 'drift-3',
  breath: 'breath',
  shimmer: 'shimmer',
} as const;
