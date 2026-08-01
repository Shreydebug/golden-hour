import type { SpotCategory } from '@/types';

export interface CategoryVisual {
  emoji: string;
  from: string;
  to: string;
}

const BLACK = 'rgba(0, 0, 0, 1)';

export const CATEGORY_VISUALS: Record<SpotCategory, CategoryVisual> = {
  viewpoint: { emoji: '📍', from: 'rgba(255, 255, 255, 0.4)', to: BLACK },
  park: { emoji: '🌳', from: 'rgba(255, 255, 255, 0.32)', to: BLACK },
  hilltop: { emoji: '⛰️', from: 'rgba(255, 255, 255, 0.45)', to: BLACK },
  lake: { emoji: '🌊', from: 'rgba(255, 255, 255, 0.28)', to: BLACK },
  mountain: { emoji: '🏔️', from: 'rgba(255, 255, 255, 0.5)', to: BLACK },
  waterfront: { emoji: '🌉', from: 'rgba(255, 255, 255, 0.36)', to: BLACK },
  beach: { emoji: '🏖️', from: 'rgba(255, 255, 255, 0.55)', to: BLACK },
  bridge: { emoji: '🌉', from: 'rgba(255, 255, 255, 0.3)', to: BLACK },
};

export const CATEGORY_LABELS: Record<SpotCategory, string> = {
  viewpoint: 'Viewpoint',
  park: 'Park',
  hilltop: 'Hilltop',
  lake: 'Lake',
  mountain: 'Mountain',
  waterfront: 'Waterfront',
  beach: 'Beach',
  bridge: 'Bridge',
};
