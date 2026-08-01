import type { SkyPhase } from '@/types';

export type Drift = 'drift-1' | 'drift-2' | 'drift-3';

export interface GlowLight {
  x: string;
  y: string;
  size: string;
  color: string;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
  drift: Drift;
}

/* ------------------------------------------------------------------ */
/* Night — deep charcoal, amber, gold, soft crimson, blue-hour blue    */
/* ------------------------------------------------------------------ */

const night = {
  amber: 'rgba(255, 176, 88, 1)',
  gold: 'rgba(255, 210, 138, 1)',
  crimson: 'rgba(255, 96, 58, 1)',
  blue: 'rgba(98, 122, 226, 1)',
  indigo: 'rgba(64, 78, 176, 1)',
  warm: 'rgba(250, 244, 232, 1)',
} as const;

const nightScenes: Record<SkyPhase, GlowLight[]> = {
  goldenHour: [
    { x: '112%', y: '-18%', size: '150vw', color: night.amber, opacity: 0.17, blur: 170, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '55%', y: '88%', size: '130vw', color: night.gold, opacity: 0.11, blur: 165, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-34%', y: '104%', size: '120vw', color: night.crimson, opacity: 0.08, blur: 160, duration: 60, delay: 16, drift: 'drift-3' },
    { x: '-30%', y: '-36%', size: '110vw', color: night.warm, opacity: 0.06, blur: 155, duration: 48, delay: 12, drift: 'drift-1' },
    { x: '70%', y: '-70%', size: '90vw', color: night.blue, opacity: 0.05, blur: 150, duration: 56, delay: 20, drift: 'drift-2' },
  ],
  sunset: [
    { x: '115%', y: '-14%', size: '155vw', color: night.amber, opacity: 0.18, blur: 175, duration: 48, delay: 6, drift: 'drift-2' },
    { x: '40%', y: '95%', size: '125vw', color: night.crimson, opacity: 0.1, blur: 165, duration: 58, delay: 14, drift: 'drift-3' },
    { x: '-32%', y: '-40%', size: '115vw', color: night.warm, opacity: 0.06, blur: 155, duration: 50, delay: 10, drift: 'drift-1' },
    { x: '-28%', y: '108%', size: '110vw', color: night.gold, opacity: 0.07, blur: 160, duration: 44, delay: 18, drift: 'drift-2' },
    { x: '60%', y: '-80%', size: '85vw', color: night.blue, opacity: 0.06, blur: 150, duration: 54, delay: 22, drift: 'drift-1' },
  ],
  sunrise: [
    { x: '112%', y: '-20%', size: '150vw', color: night.gold, opacity: 0.15, blur: 170, duration: 50, delay: 8, drift: 'drift-3' },
    { x: '-35%', y: '-30%', size: '135vw', color: night.warm, opacity: 0.09, blur: 165, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '48%', y: '100%', size: '120vw', color: night.amber, opacity: 0.08, blur: 160, duration: 60, delay: 16, drift: 'drift-2' },
    { x: '75%', y: '120%', size: '100vw', color: night.crimson, opacity: 0.05, blur: 155, duration: 52, delay: 12, drift: 'drift-3' },
    { x: '80%', y: '-75%', size: '90vw', color: night.blue, opacity: 0.05, blur: 150, duration: 56, delay: 20, drift: 'drift-1' },
  ],
  morning: [
    { x: '-30%', y: '-36%', size: '140vw', color: night.warm, opacity: 0.1, blur: 165, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '108%', y: '-26%', size: '125vw', color: night.gold, opacity: 0.07, blur: 160, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-20%', y: '110%', size: '120vw', color: night.amber, opacity: 0.05, blur: 155, duration: 60, delay: 16, drift: 'drift-3' },
    { x: '104%', y: '116%', size: '110vw', color: night.warm, opacity: 0.045, blur: 150, duration: 48, delay: 12, drift: 'drift-2' },
    { x: '55%', y: '-85%', size: '85vw', color: night.blue, opacity: 0.045, blur: 145, duration: 56, delay: 20, drift: 'drift-1' },
  ],
  day: [
    { x: '-28%', y: '-34%', size: '145vw', color: night.warm, opacity: 0.08, blur: 165, duration: 54, delay: 8, drift: 'drift-2' },
    { x: '110%', y: '-24%', size: '125vw', color: night.warm, opacity: 0.055, blur: 160, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '52%', y: '118%', size: '130vw', color: night.gold, opacity: 0.05, blur: 155, duration: 58, delay: 16, drift: 'drift-3' },
    { x: '-22%', y: '112%', size: '115vw', color: night.blue, opacity: 0.045, blur: 150, duration: 50, delay: 12, drift: 'drift-2' },
    { x: '60%', y: '-85%', size: '80vw', color: night.warm, opacity: 0.04, blur: 145, duration: 56, delay: 20, drift: 'drift-1' },
  ],
  blueHour: [
    { x: '112%', y: '-16%', size: '150vw', color: night.blue, opacity: 0.16, blur: 170, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '-30%', y: '105%', size: '130vw', color: night.indigo, opacity: 0.11, blur: 165, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-32%', y: '-38%', size: '115vw', color: night.warm, opacity: 0.06, blur: 155, duration: 48, delay: 12, drift: 'drift-3' },
    { x: '52%', y: '118%', size: '105vw', color: night.crimson, opacity: 0.06, blur: 150, duration: 56, delay: 18, drift: 'drift-2' },
    { x: '72%', y: '-70%', size: '85vw', color: night.gold, opacity: 0.05, blur: 150, duration: 60, delay: 22, drift: 'drift-1' },
  ],
  night: [
    { x: '-30%', y: '106%', size: '135vw', color: night.indigo, opacity: 0.13, blur: 170, duration: 52, delay: 8, drift: 'drift-3' },
    { x: '112%', y: '-22%', size: '125vw', color: night.blue, opacity: 0.09, blur: 160, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '48%', y: '-80%', size: '100vw', color: night.crimson, opacity: 0.06, blur: 155, duration: 58, delay: 16, drift: 'drift-2' },
    { x: '-24%', y: '-38%', size: '110vw', color: night.warm, opacity: 0.055, blur: 150, duration: 50, delay: 12, drift: 'drift-1' },
    { x: '78%', y: '112%', size: '85vw', color: night.amber, opacity: 0.045, blur: 145, duration: 54, delay: 20, drift: 'drift-3' },
  ],
};

/* ------------------------------------------------------------------ */
/* Day — pure white, warm white, cream, hints of gold, almost          */
/* invisible lighting                                                  */
/* ------------------------------------------------------------------ */

const day = {
  amber: 'rgba(240, 178, 110, 1)',
  gold: 'rgba(238, 205, 150, 1)',
  crimson: 'rgba(238, 148, 108, 1)',
  blue: 'rgba(186, 200, 255, 1)',
  warm: 'rgba(255, 253, 248, 1)',
} as const;

const dayScenes: Record<SkyPhase, GlowLight[]> = {
  goldenHour: [
    { x: '112%', y: '-18%', size: '150vw', color: day.gold, opacity: 0.13, blur: 170, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '52%', y: '92%', size: '130vw', color: day.amber, opacity: 0.09, blur: 165, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-32%', y: '-38%', size: '120vw', color: day.warm, opacity: 0.08, blur: 160, duration: 60, delay: 16, drift: 'drift-3' },
    { x: '-26%', y: '108%', size: '110vw', color: day.crimson, opacity: 0.055, blur: 155, duration: 48, delay: 12, drift: 'drift-1' },
    { x: '68%', y: '-72%', size: '85vw', color: day.blue, opacity: 0.04, blur: 150, duration: 56, delay: 20, drift: 'drift-2' },
  ],
  sunset: [
    { x: '115%', y: '-14%', size: '155vw', color: day.amber, opacity: 0.14, blur: 175, duration: 48, delay: 6, drift: 'drift-2' },
    { x: '-32%', y: '-40%', size: '120vw', color: day.warm, opacity: 0.07, blur: 160, duration: 50, delay: 10, drift: 'drift-1' },
    { x: '42%', y: '98%', size: '125vw', color: day.crimson, opacity: 0.07, blur: 160, duration: 58, delay: 14, drift: 'drift-3' },
    { x: '-28%', y: '110%', size: '110vw', color: day.gold, opacity: 0.06, blur: 155, duration: 44, delay: 18, drift: 'drift-2' },
    { x: '62%', y: '-78%', size: '85vw', color: day.blue, opacity: 0.045, blur: 150, duration: 54, delay: 22, drift: 'drift-1' },
  ],
  sunrise: [
    { x: '112%', y: '-20%', size: '150vw', color: day.gold, opacity: 0.11, blur: 170, duration: 50, delay: 8, drift: 'drift-3' },
    { x: '-35%', y: '-30%', size: '135vw', color: day.warm, opacity: 0.08, blur: 165, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '48%', y: '104%', size: '120vw', color: day.amber, opacity: 0.06, blur: 160, duration: 60, delay: 16, drift: 'drift-2' },
    { x: '72%', y: '-74%', size: '85vw', color: day.blue, opacity: 0.04, blur: 150, duration: 56, delay: 20, drift: 'drift-1' },
    { x: '78%', y: '118%', size: '95vw', color: day.crimson, opacity: 0.04, blur: 150, duration: 52, delay: 12, drift: 'drift-3' },
  ],
  morning: [
    { x: '-30%', y: '-36%', size: '140vw', color: day.warm, opacity: 0.09, blur: 165, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '108%', y: '-26%', size: '125vw', color: day.gold, opacity: 0.06, blur: 160, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-20%', y: '110%', size: '120vw', color: day.amber, opacity: 0.05, blur: 155, duration: 60, delay: 16, drift: 'drift-3' },
    { x: '104%', y: '116%', size: '110vw', color: day.warm, opacity: 0.045, blur: 150, duration: 48, delay: 12, drift: 'drift-2' },
    { x: '58%', y: '-84%', size: '85vw', color: day.blue, opacity: 0.04, blur: 145, duration: 56, delay: 20, drift: 'drift-1' },
  ],
  day: [
    { x: '-28%', y: '-34%', size: '145vw', color: day.warm, opacity: 0.07, blur: 165, duration: 54, delay: 8, drift: 'drift-2' },
    { x: '110%', y: '-24%', size: '125vw', color: day.warm, opacity: 0.05, blur: 160, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '52%', y: '118%', size: '130vw', color: day.gold, opacity: 0.045, blur: 155, duration: 58, delay: 16, drift: 'drift-3' },
    { x: '-22%', y: '112%', size: '115vw', color: day.blue, opacity: 0.04, blur: 150, duration: 50, delay: 12, drift: 'drift-2' },
    { x: '60%', y: '-85%', size: '80vw', color: day.warm, opacity: 0.035, blur: 145, duration: 56, delay: 20, drift: 'drift-1' },
  ],
  blueHour: [
    { x: '112%', y: '-16%', size: '150vw', color: day.blue, opacity: 0.12, blur: 170, duration: 52, delay: 8, drift: 'drift-1' },
    { x: '-30%', y: '105%', size: '130vw', color: day.blue, opacity: 0.08, blur: 165, duration: 44, delay: 4, drift: 'drift-2' },
    { x: '-32%', y: '-38%', size: '115vw', color: day.warm, opacity: 0.06, blur: 155, duration: 48, delay: 12, drift: 'drift-3' },
    { x: '52%', y: '118%', size: '105vw', color: day.crimson, opacity: 0.05, blur: 150, duration: 56, delay: 18, drift: 'drift-2' },
    { x: '72%', y: '-70%', size: '85vw', color: day.gold, opacity: 0.04, blur: 150, duration: 60, delay: 22, drift: 'drift-1' },
  ],
  night: [
    { x: '-30%', y: '106%', size: '135vw', color: day.blue, opacity: 0.1, blur: 170, duration: 52, delay: 8, drift: 'drift-3' },
    { x: '112%', y: '-22%', size: '125vw', color: day.blue, opacity: 0.07, blur: 160, duration: 46, delay: 4, drift: 'drift-1' },
    { x: '-24%', y: '-38%', size: '110vw', color: day.warm, opacity: 0.06, blur: 150, duration: 50, delay: 12, drift: 'drift-1' },
    { x: '48%', y: '-80%', size: '100vw', color: day.crimson, opacity: 0.045, blur: 155, duration: 58, delay: 16, drift: 'drift-2' },
    { x: '78%', y: '112%', size: '85vw', color: day.amber, opacity: 0.04, blur: 145, duration: 54, delay: 20, drift: 'drift-3' },
  ],
};

export const GLOW_SCENES: Record<SkyPhase, GlowLight[]> = nightScenes;
export const LIGHT_SCENES: Record<SkyPhase, GlowLight[]> = dayScenes;
