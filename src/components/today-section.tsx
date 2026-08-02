'use client';

import { Loader2, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/button';
import { Forecast } from '@/components/forecast';
import { GlassCard } from '@/components/glass-card';
import { HourlyTimeline } from '@/components/hourly-timeline';
import { PhotographerInsights } from '@/components/photographer-insights';
import { SkyGraphs } from '@/components/sky-graph';
import { SunCard } from '@/components/sun-card';
import { WeatherCard } from '@/components/weather-card';
import { WordReveal } from '@/components/reveal';
import { durations, easing, typography } from '@/theme';
import type {
  DayForecast,
  GeoCoordinates,
  GoldenHourQuality,
  GoldenHourTimes,
  MoonData,
  SunPosition,
  WeatherData,
} from '@/types';

interface TodaySectionProps {
  times: GoldenHourTimes | null;
  quality: GoldenHourQuality | null;
  adjustedQuality: GoldenHourQuality | null;
  now: Date;
  phaseLabel: string;
  sunPosition: SunPosition | null;
  moonData: MoonData | null;
  forecast: DayForecast[] | null;
  weather: WeatherData | null;
  weatherLoading: boolean;
  coords: GeoCoordinates | null;
  loading: boolean;
  error: string | null;
  isBlocked: boolean;
  onRequestPermission: () => void;
}

export function TodaySection({
  times,
  quality,
  adjustedQuality,
  now,
  phaseLabel,
  sunPosition,
  moonData,
  forecast,
  weather,
  weatherLoading,
  coords,
  loading,
  error,
  isBlocked,
  onRequestPermission,
}: TodaySectionProps) {
  const hasBriefing = Boolean(coords && times && quality);

  return (
    <section id="today" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: durations.slow, ease: easing.out }}
        className="mx-auto mb-16 w-full max-w-6xl px-6"
      >
        <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
          Today · photography briefing
        </p>
        <h2
          style={{ ...typography.displaySm }}
          className="text-illuminated mt-4 max-w-2xl tracking-tight"
        >
          <WordReveal text="The light today" className="text-illuminated" />
        </h2>
        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
          Sun, sky and weather for right now — a quiet briefing for the hours
          ahead.
        </p>
      </motion.div>

      {!hasBriefing ? (
        <div className="mx-auto w-full max-w-6xl px-6">
          <GlassCard className="flex flex-col items-center justify-center gap-5 p-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/15">
              <Sun className="h-6 w-6 text-foreground/60" strokeWidth={1.25} />
            </span>
            <p className="max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
              Share your location and the briefing will unfold — sunrise, golden
              hour, blue hour and the sky ahead.
            </p>
            <Button size="lg" variant="glow" onClick={onRequestPermission} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding you…
                </>
              ) : (
                <>Find my golden hour</>
              )}
            </Button>
            {isBlocked && (
              <p className="max-w-[260px] text-xs font-light leading-relaxed text-muted-foreground">
                Location is blocked — allow it in browser settings to get exact
                timings.
              </p>
            )}
            {error && (
              <p className="max-w-[260px] text-xs font-light leading-relaxed text-destructive">
                {error}
              </p>
            )}
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-16 lg:space-y-24">
          {times && (
            <SunCard
              times={times}
              now={now}
              phaseLabel={phaseLabel}
              sunPosition={sunPosition ?? { azimuth: 0, altitude: 0 }}
              moonData={moonData ?? { phase: 0, illumination: 0, waxing: true, phaseName: '—', rise: null, set: null }}
            />
          )}

          {coords && (
            <WeatherCard
              weather={weather}
              loading={weatherLoading}
              quality={quality}
            />
          )}

          {times && coords && (
            <SkyGraphs times={times} now={now} coords={coords} />
          )}

          {times && <HourlyTimeline times={times} now={now} />}

          {times && quality && adjustedQuality && (
            <PhotographerInsights
              times={times}
              quality={quality}
              adjustedQuality={adjustedQuality}
              weather={weather}
              phaseLabel={phaseLabel}
            />
          )}

          {forecast && <Forecast forecast={forecast} />}
        </div>
      )}
    </section>
  );
}
