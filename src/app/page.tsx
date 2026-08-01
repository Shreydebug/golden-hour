'use client';

import { useCallback, useState } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { AnimatedBackground } from '@/components/animated-background';
import { DottedSun } from '@/components/dotted-sun';
import { CustomCursor } from '@/components/custom-cursor';
import { VerticalNav } from '@/components/vertical-nav';
import { LocationHeader } from '@/components/location-header';
import { HeroCard } from '@/components/hero-card';
import { SunCard } from '@/components/sun-card';
import { WeatherCard } from '@/components/weather-card';
import { Forecast } from '@/components/forecast';
import { MapSection } from '@/components/map-section';
import { NearbyPlaceCard } from '@/components/nearby-place-card';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';

import { useLocation } from '@/hooks/use-location';
import { useGoldenHour } from '@/hooks/use-golden-hour';
import { useWeather } from '@/hooks/use-weather';
import { usePlaces } from '@/hooks/use-places';

import { WordReveal } from '@/components/reveal';
import { getWeatherAdjustedScore } from '@/utils/golden-hour-score';
import { useResolvedTheme } from '@/components/theme-provider';
import { durations, easing, typography } from '@/theme';
import type { PhotographySpot } from '@/types';

const PHASE_LABELS: Record<string, string> = {
  goldenHour: 'Golden hour · prime light',
  morning: 'Morning · golden hour ahead',
  blueHour: 'Blue hour · soft light',
  sunset: 'Sunset · golden hour fading',
  sunrise: 'Sunrise · golden hour rising',
  day: 'Daylight · wait for golden hour',
  night: 'Night · golden hour tomorrow',
};

export default function HomePage() {
  const {
    coords,
    address,
    permissionStatus,
    loading,
    error,
    requestPermission,
    refreshLocation,
  } = useLocation();

  const goldenHour = useGoldenHour(coords);
  const { weather, loading: weatherLoading } = useWeather(coords);
  const { spots, loading: spotsLoading } = usePlaces(coords);

  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const phase = goldenHour?.skyPhase ?? 'night';

  const handleSelectSpot = useCallback((spot: PhotographySpot) => {
    setSelectedSpotId((current) => (current === spot.id ? null : spot.id));
  }, []);

  const adjustedQuality = goldenHour
    ? getWeatherAdjustedScore(goldenHour.quality, weather)
    : null;

  return (
    <main id="top" className="relative min-h-screen overflow-x-clip">
      <AnimatedBackground phase={phase} />
      <DottedSun theme={useResolvedTheme()} />
      <CustomCursor />
      <VerticalNav />

      <div className="relative z-10">

        <LocationHeader
          hasLocation={Boolean(coords)}
          address={address}
          date={goldenHour?.now ?? new Date()}
          loading={loading}
          onRefresh={refreshLocation}
        />

        <div className="flex min-h-[78vh] flex-col justify-center pb-32 pt-8">
          <HeroCard
            times={goldenHour?.times ?? null}
            quality={goldenHour?.quality ?? null}
            adjustedQuality={adjustedQuality}
            phaseLabel={PHASE_LABELS[phase]}
            hasLocation={Boolean(coords)}
            loading={loading}
            error={error}
            isBlocked={permissionStatus === 'denied'}
            onRequestPermission={requestPermission}
          />
        </div>

        <div
          id="today"
          className="scroll-mt-24 space-y-36 pb-10 lg:space-y-52"
        >
          {goldenHour && (
            <SunCard
              times={goldenHour.times}
              now={goldenHour.now}
              phaseLabel={PHASE_LABELS[goldenHour.skyPhase]}
              sunPosition={goldenHour.sunPosition}
              moonData={goldenHour.moonData}
            />
          )}

          {coords && (
            <WeatherCard
              weather={weather}
              loading={weatherLoading}
              quality={goldenHour?.quality ?? null}
            />
          )}

          {goldenHour && <Forecast forecast={goldenHour.forecast} />}

          {coords && (
            <>
              <MapSection
                coords={coords}
                spots={spots}
                selectedSpotId={selectedSpotId}
                onSelectSpot={handleSelectSpot}
              />

              <section
                id="spots"
                className="mx-auto w-full max-w-6xl scroll-mt-28 px-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: durations.base, ease: easing.out }}
                  className="mb-12 flex flex-wrap items-end justify-between gap-4"
                >
                  <div>
                    <h2 style={{ ...typography.h2 }} className="tracking-tight">
                      <WordReveal text="Nearby photography spots" className="text-fade" />
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-light text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-foreground/40" strokeWidth={1.5} />
                      {spots.length} hand-picked vantage points around you
                    </p>
                  </div>
                </motion.div>

                {spotsLoading && spots.length === 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-80 rounded-2xl bg-secondary/60" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {spots.map((spot, index) => (
                      <NearbyPlaceCard
                        key={spot.id}
                        spot={spot}
                        index={index}
                        selected={spot.id === selectedSpotId}
                        onSelect={handleSelectSpot}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <Footer />
      </div>
    </main>
  );
}
