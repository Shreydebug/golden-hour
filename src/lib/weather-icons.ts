import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Sun,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { WeatherCondition } from '@/types';

export const CONDITION_ICONS: Record<WeatherCondition, LucideIcon> = {
  clear: Sun,
  partlyCloudy: CloudSun,
  cloudy: Cloud,
  overcast: Cloudy,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  thunderstorm: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
  haze: CloudFog,
  dust: CloudFog,
};

export const CONDITION_LABELS: Record<WeatherCondition, string> = {
  clear: 'Clear',
  partlyCloudy: 'Partly cloudy',
  cloudy: 'Cloudy',
  overcast: 'Overcast',
  rain: 'Rain',
  drizzle: 'Drizzle',
  thunderstorm: 'Thunderstorm',
  snow: 'Snow',
  fog: 'Fog',
  haze: 'Haze',
  dust: 'Dust',
};
