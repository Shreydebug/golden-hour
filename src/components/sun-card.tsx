'use client';

import { Moon, Sunrise, Sunset, Sun } from 'lucide-react';

import { GlassCard } from '@/components/glass-card';
import { WordReveal } from '@/components/reveal';
import { formatAltitude, formatDirection, formatTime, formatPercentage } from '@/utils/formatters';
import { typography } from '@/theme';
import type { GoldenHourTimes, MoonData, SunPosition } from '@/types';

interface SunCardProps {
  times: GoldenHourTimes;
  now: Date;
  phaseLabel: string;
  sunPosition: SunPosition;
  moonData: MoonData;
}

function WindowRow({
  label,
  start,
  end,
  now,
  dotColor,
}: {
  label: string;
  start: Date;
  end: Date;
  now: Date;
  dotColor: string;
}) {
  const isActive = now >= start && now <= end;
  const isPast = now > end;

  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="flex items-center gap-4">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{
            backgroundColor: dotColor,
            opacity: isPast ? 0.3 : 1,
            boxShadow: isActive ? `0 0 14px ${dotColor}` : 'none',
          }}
        />
        <span className="text-[15px] font-light tracking-wide">{label}</span>
      </div>
      <span
        className={`text-[15px] tabular-nums ${
          isActive ? 'font-medium text-foreground' : 'font-light text-muted-foreground'
        }`}
      >
        {formatTime(start)} – {formatTime(end)}
        {isActive && (
          <span className="ml-3 text-[10px] font-medium uppercase tracking-[0.18em] text-accent-foreground">
            Active
          </span>
        )}
      </span>
    </div>
  );
}

export function SunCard({
  times,
  now,
  phaseLabel,
  sunPosition,
  moonData,
}: SunCardProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 style={{ ...typography.h2 }} className="tracking-tight">
          <WordReveal text="Today's sun" className="text-fade" />
        </h2>
        <span className="text-sm font-light tracking-wide text-muted-foreground">
          {phaseLabel}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <GlassCard className="p-10 sm:p-12" delay={0}>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Sunrise
              className="h-4 w-4 text-foreground/60"
              strokeWidth={1.5}
            />
            <span style={{ ...typography.eyebrow }}>Sunrise</span>
          </div>
          <p className="text-illuminated mt-7 text-4xl font-extralight tabular-nums tracking-tight sm:text-5xl">
            {formatTime(times.sunrise)}
          </p>
          <p className="mt-4 text-sm font-light text-muted-foreground">
            Golden hour begins {formatTime(times.morningGoldenHourStart)}
          </p>
        </GlassCard>

        <GlassCard className="p-10 sm:p-12" delay={1}>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Sunset className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
            <span style={{ ...typography.eyebrow }}>Sunset</span>
          </div>
          <p className="text-illuminated mt-7 text-4xl font-extralight tabular-nums tracking-tight sm:text-5xl">
            {formatTime(times.sunset)}
          </p>
          <p className="mt-4 text-sm font-light text-muted-foreground">
            Golden hour begins {formatTime(times.eveningGoldenHourStart)}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="mt-5 p-10 sm:p-12" delay={2}>
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ ...typography.eyebrow }} className="text-muted-foreground">
            Golden &amp; blue hour
          </h3>
          <span className="text-xs font-light tracking-wide text-muted-foreground">
            Day length {Math.round(times.dayLength * 10) / 10} h
          </span>
        </div>

        <div>
          <WindowRow
            label="Morning golden hour"
            start={times.morningGoldenHourStart}
            end={times.morningGoldenHourEnd}
            now={now}
            dotColor="rgba(255, 176, 88, 0.95)"
          />
          <WindowRow
            label="Morning blue hour"
            start={times.morningBlueHourStart}
            end={times.morningBlueHourEnd}
            now={now}
            dotColor="rgba(124, 142, 238, 0.75)"
          />
          <WindowRow
            label="Evening blue hour"
            start={times.eveningBlueHourStart}
            end={times.eveningBlueHourEnd}
            now={now}
            dotColor="rgba(124, 142, 238, 0.5)"
          />
          <WindowRow
            label="Evening golden hour"
            start={times.eveningGoldenHourStart}
            end={times.eveningGoldenHourEnd}
            now={now}
            dotColor="rgba(255, 210, 138, 0.9)"
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6 pt-8">
          <div>
            <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
              Sun altitude
            </p>
            <p className="mt-2.5 flex items-center gap-2 text-[15px] font-light tabular-nums">
              <Sun className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
              {formatAltitude(sunPosition.altitude)}
            </p>
          </div>
          <div>
            <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
              Direction
            </p>
            <p className="mt-2.5 text-[15px] font-light tabular-nums">
              {formatDirection(sunPosition.azimuth)} ·{' '}
              {Math.round(sunPosition.azimuth)}°
            </p>
          </div>
          <div>
            <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
              Moon
            </p>
            <p className="mt-2.5 flex items-center gap-2 text-[15px] font-light">
              <Moon className="h-3.5 w-3.5 text-foreground/40" strokeWidth={1.5} />
              {moonData.phaseName} · {formatPercentage(moonData.illumination * 100)}
            </p>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
