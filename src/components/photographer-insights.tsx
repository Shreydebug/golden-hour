'use client';

import { Aperture } from 'lucide-react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/glass-card';
import { formatTime } from '@/utils/formatters';
import { durations, easing, typography } from '@/theme';
import type {
  GoldenHourQuality,
  GoldenHourTimes,
  WeatherCondition,
  WeatherData,
} from '@/types';

interface PhotographerInsightsProps {
  times: GoldenHourTimes;
  quality: GoldenHourQuality;
  adjustedQuality: GoldenHourQuality;
  weather: WeatherData | null;
  phaseLabel: string;
}

function cloudSoftness(cloud: number): string {
  if (cloud < 20) return 'Crisp & clean';
  if (cloud < 50) return 'Soft & even';
  if (cloud < 75) return 'Silky diffuse';
  return 'Deeply diffuse';
}

function visibilityRating(meters: number): string {
  const km = meters / 1000;
  if (km >= 20) return 'Crystal clear';
  if (km >= 10) return 'Clear';
  if (km >= 5) return 'Hazy';
  return 'Poor';
}

function skyColorPrediction(
  condition: WeatherCondition | undefined,
  phaseLabel: string
): string {
  if (phaseLabel.toLowerCase().includes('blue')) return 'Indigo fade to rose';
  if (phaseLabel.toLowerCase().includes('night')) return 'Deep indigo';

  switch (condition) {
    case 'clear':
      return 'Fiery gold to rose';
    case 'partlyCloudy':
      return 'Streaked amber & violet';
    case 'cloudy':
      return 'Muted pastel gold';
    case 'overcast':
      return 'Soft silver glow';
    case 'fog':
      return 'Diffused honey';
    case 'haze':
      return 'Warm haze';
    case 'rain':
    case 'drizzle':
      return 'Grey wash';
    case 'thunderstorm':
      return 'Grey wash';
    case 'snow':
      return 'Pale rose';
    default:
      return 'Muted tones';
  }
}

export function PhotographerInsights({
  times,
  quality,
  adjustedQuality,
  weather,
  phaseLabel,
}: PhotographerInsightsProps) {
  const bestWindow =
    times.bestWindowLabel === 'Morning'
      ? [times.morningGoldenHourStart, times.morningGoldenHourEnd]
      : [times.eveningGoldenHourStart, times.eveningGoldenHourEnd];

  const items: { label: string; value: string }[] = [
    {
      label: "Today's light quality",      value: `${adjustedQuality.label} · ${adjustedQuality.score.toFixed(1)}/10`,
    },
    {
      label: 'Golden hour strength',
      value: `${quality.label} · ${quality.score.toFixed(1)}/10`,
    },
    {
      label: 'Cloud softness',
      value: weather ? cloudSoftness(weather.cloudCover) : '—',
    },
    {
      label: 'Best shooting window',
      value: `${formatTime(bestWindow[0])} – ${formatTime(bestWindow[1])}`,
    },
    {
      label: 'Visibility rating',
      value: weather ? visibilityRating(weather.visibility) : '—',
    },
    {
      label: 'Sky colour prediction',
      value: weather
        ? skyColorPrediction(weather.condition, phaseLabel)
        : '—',
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <GlassCard className="p-8 sm:p-12" delay={0}>
        <div className="mb-9 flex items-center gap-3">
          <Aperture className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
          <h3 style={{ ...typography.eyebrow }} className="text-muted-foreground">
            Photographer&apos;s notes
          </h3>
        </div>

        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: durations.base,
                delay: index * 0.08,
                ease: easing.out,
              }}
            >
              <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
                {item.label}
              </p>
              <p className="text-illuminated mt-3 text-2xl font-extralight tracking-tight">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
