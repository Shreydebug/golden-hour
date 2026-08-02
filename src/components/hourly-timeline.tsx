'use client';

import { motion } from 'framer-motion';

import { GlassCard } from '@/components/glass-card';
import { formatTime } from '@/utils/formatters';
import { durations, easing, typography } from '@/theme';
import type { GoldenHourTimes } from '@/types';

type HourPhase = 'golden' | 'blue' | 'twilight' | 'day' | 'night';

const PHASE_DOT: Record<HourPhase, string> = {
  golden: 'rgba(255, 210, 138, 0.95)',
  blue: 'rgba(124, 142, 238, 0.9)',
  twilight: 'rgba(168, 150, 220, 0.75)',
  day: 'rgba(255, 255, 255, 0.25)',
  night: 'rgba(255, 255, 255, 0.12)',
};

const PHASE_LABEL: Record<HourPhase, string> = {
  golden: 'Golden',
  blue: 'Blue',
  twilight: 'Twilight',
  day: 'Day',
  night: 'Night',
};

function phaseFor(date: Date, times: GoldenHourTimes): HourPhase {
  if (date >= times.morningGoldenHourStart && date <= times.morningGoldenHourEnd) return 'golden';
  if (date >= times.eveningGoldenHourStart && date <= times.eveningGoldenHourEnd) return 'golden';
  if (date >= times.morningBlueHourStart && date < times.morningBlueHourEnd) return 'blue';
  if (date > times.eveningBlueHourStart && date <= times.eveningBlueHourEnd) return 'blue';
  if (date >= times.civilTwilightStart && date < times.sunrise) return 'twilight';
  if (date > times.sunset && date <= times.civilTwilightEnd) return 'twilight';
  if (date >= times.sunrise && date <= times.sunset) return 'day';
  return 'night';
}

interface HourlyTimelineProps {
  times: GoldenHourTimes;
  now: Date;
}

export function HourlyTimeline({ times, now }: HourlyTimelineProps) {
  const rangeStart = new Date(times.astronomicalTwilightStart);
  rangeStart.setHours(rangeStart.getHours() - 1, 0, 0, 0);
  const rangeEnd = new Date(times.astronomicalTwilightEnd);
  rangeEnd.setHours(rangeEnd.getHours() + 1, 0, 0, 0);

  const hours: Date[] = [];
  for (let d = new Date(rangeStart); d < rangeEnd; d.setHours(d.getHours() + 1)) {
    hours.push(new Date(d));
  }

  const hourLabel = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <GlassCard className="p-8 sm:p-10" delay={0}>
        <div className="mb-8 flex items-center justify-between">
          <h3 style={{ ...typography.eyebrow }} className="text-muted-foreground">
            Hourly sky timeline
          </h3>
          <span className="text-[11px] font-light tracking-wide text-muted-foreground/70">
            Now · {formatTime(now)}
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-2 right-2 top-[5px] h-px bg-border/50" />
          <div className="flex gap-1">
            {hours.map((hour, index) => {
              const phase = phaseFor(hour, times);
              const isNow =
                hour.getTime() <= now.getTime() &&
                now.getTime() < hour.getTime() + 60 * 60 * 1000;
              const luminous = phase === 'golden' || phase === 'blue';

              return (
                <motion.div
                  key={hour.getTime()}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: durations.base,
                    delay: index * 0.03,
                    ease: easing.out,
                  }}
                  className="group relative flex flex-1 flex-col items-center gap-3"
                  title={PHASE_LABEL[phase]}
                >
                  <span
                    className={`h-[11px] w-[11px] rounded-full transition-shadow duration-500 ${
                      isNow ? 'scale-125' : ''
                    }`}
                    style={{
                      backgroundColor: PHASE_DOT[phase],
                      boxShadow: luminous
                        ? `0 0 14px ${PHASE_DOT[phase]}`
                        : 'none',
                    }}
                  />
                  <span
                    className={`text-[10px] font-light tabular-nums tracking-wide ${
                      isNow
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground/70'
                    }`}
                  >
                    {hourLabel.format(hour)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
          {(['golden', 'blue', 'twilight', 'day', 'night'] as HourPhase[]).map(
            (phase) => (
              <span
                key={phase}
                className="flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.16em] text-muted-foreground/70"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: PHASE_DOT[phase] }}
                />
                {PHASE_LABEL[phase]}
              </span>
            )
          )}
        </div>
      </GlassCard>
    </section>
  );
}
