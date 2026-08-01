'use client';

import { CloudRain, Droplets, Eye, Sun, Thermometer, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/glass-card';
import { WordReveal } from '@/components/reveal';
import { CONDITION_ICONS, CONDITION_LABELS } from '@/lib/weather-icons';
import {
  formatPercentage,
  formatTemperature,
  formatVisibility,
  formatWindSpeed,
} from '@/utils/formatters';
import {
  getWeatherAdjustedScore,
} from '@/utils/golden-hour-score';
import { durations, easing, typography } from '@/theme';
import type { GoldenHourQuality, WeatherData } from '@/types';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  quality: GoldenHourQuality | null;
}

export function WeatherCard({ weather, loading, quality }: WeatherCardProps) {
  const adjusted = quality ? getWeatherAdjustedScore(quality, weather) : null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="mb-10 flex items-end justify-between">
        <h2 style={{ ...typography.h2 }} className="tracking-tight">
          <WordReveal text="Weather" className="text-fade" />
        </h2>
        <span className="flex items-center gap-2 text-xs font-light tracking-wide text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-white/70" />
          Live · Open-Meteo
        </span>
      </div>

      <GlassCard className="p-10 sm:p-14" delay={0}>
        {loading && !weather ? (
          <div className="flex h-52 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border border-primary/25 border-t-primary" />
          </div>
        ) : weather ? (
          <div className="flex flex-col gap-12">
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-8">
                {(() => {
                  const Icon = CONDITION_ICONS[weather.condition] ?? Sun;
                  return (
                    <Icon
                      className="h-16 w-16 text-foreground/70 sm:h-20 sm:w-20"
                      strokeWidth={1}
                    />
                  );
                })()}
                <div>
                  <p className="text-illuminated text-6xl font-extralight tabular-nums tracking-tight sm:text-7xl">
                    {formatTemperature(weather.temperature)}
                  </p>
                  <p className="mt-2 text-lg font-light tracking-wide">
                    {CONDITION_LABELS[weather.condition] ?? 'Clear'}
                  </p>
                  <p className="text-sm font-light text-muted-foreground">
                    Feels like {formatTemperature(weather.feelsLike)}
                  </p>
                </div>
              </div>

              {adjusted && (
                <div className="ml-auto flex items-center gap-5">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      border: '1px solid rgba(250, 250, 250, 0.14)',
                      boxShadow: `0 0 70px -14px rgba(255, 255, 255, 0.35), inset 0 1px 0 rgba(250, 250, 250, 0.06)`,
                      background: 'rgba(250, 250, 250, 0.03)',
                    }}
                  >
                    <span className="text-xl font-extralight tabular-nums">
                      {adjusted.score.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
                      Golden hour score
                    </p>
                    <p className="mt-1.5 text-[15px] font-light">
                      {adjusted.label}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex justify-between text-xs font-light text-muted-foreground">
                <span>Cloud cover</span>
                <span className="tabular-nums">{formatPercentage(weather.cloudCover)}</span>
              </div>
              <div className="h-px w-full bg-border/70">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${weather.cloudCover}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: easing.apple }}
                  className="h-px"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 0 12px rgba(255, 255, 255, 0.55)',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
              {[
                {
                  icon: <CloudRain className="h-4 w-4" strokeWidth={1.5} />,
                  label: 'Cloud',
                  value: formatPercentage(weather.cloudCover),
                },
                {
                  icon: <Eye className="h-4 w-4" strokeWidth={1.5} />,
                  label: 'Visibility',
                  value: formatVisibility(weather.visibility),
                },
                {
                  icon: <Wind className="h-4 w-4" strokeWidth={1.5} />,
                  label: 'Wind',
                  value: formatWindSpeed(weather.windSpeed),
                },
                {
                  icon: <Droplets className="h-4 w-4" strokeWidth={1.5} />,
                  label: 'Humidity',
                  value: formatPercentage(weather.humidity),
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: durations.base, delay: index * 0.08, ease: easing.out }}
                >
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <span className="text-foreground/40">{stat.icon}</span>
                    <span style={{ ...typography.eyebrow }}>{stat.label}</span>
                  </div>
                  <p className="text-illuminated mt-3 text-3xl font-extralight tabular-nums tracking-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Thermometer className="h-8 w-8" strokeWidth={1} />
            <p className="text-sm font-light">Weather is unavailable right now.</p>
          </div>
        )}
      </GlassCard>
    </section>
  );
}
