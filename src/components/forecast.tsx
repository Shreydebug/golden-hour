'use client';

import { CalendarRange } from 'lucide-react';
import { motion } from 'framer-motion';

import { WordReveal } from '@/components/reveal';
import { formatShortDay, formatTime } from '@/utils/formatters';
import { durations, easing, typography } from '@/theme';
import type { DayForecast } from '@/types';

interface ForecastProps {
  forecast: DayForecast[];
}

export function Forecast({ forecast }: ForecastProps) {
  return (
    <section
      id="forecast"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: durations.base, ease: easing.out }}
        className="mb-10 flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h2 style={{ ...typography.h2 }} className="tracking-tight">
            <WordReveal text="7-day forecast" className="text-fade" />
          </h2>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Plan ahead — each day’s golden hour quality
          </p>
        </div>
        <CalendarRange className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      </motion.div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date.toISOString()}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.base, delay: index * 0.05, ease: easing.out }}
            className="glass-card group w-36 shrink-0 p-6 text-center"
          >
            <p className="text-sm font-light tracking-wide">{formatShortDay(day.date)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {day.date.getDate()}
            </p>

            <div className="mt-6 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.14em] text-muted-foreground">
                  Rise
                </span>
                <span className="font-light tabular-nums">
                  {formatTime(day.sunrise)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.14em] text-muted-foreground">
                  Set
                </span>
                <span className="font-light tabular-nums">
                  {formatTime(day.sunset)}
                </span>
              </div>
            </div>

            <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 text-sm font-extralight tabular-nums transition-shadow duration-500 group-hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)]">
              {day.qualityScore.toFixed(1)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
