'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

import { AnimatedBackground } from '@/components/animated-background';
import { CustomCursor } from '@/components/custom-cursor';
import { VerticalNav } from '@/components/vertical-nav';
import { LocationHeader } from '@/components/location-header';
import { HeroCard } from '@/components/hero-card';
import { TodaySection } from '@/components/today-section';
import { DiscoverSection } from '@/components/discover-section';
import { PlacesSection } from '@/components/places-section';
import { Footer } from '@/components/footer';

import { useLocation } from '@/hooks/use-location';
import { useGoldenHour } from '@/hooks/use-golden-hour';
import { useWeather } from '@/hooks/use-weather';
import { usePlaces } from '@/hooks/use-places';

import { getWeatherAdjustedScore } from '@/utils/golden-hour-score';
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

const HeroSun = dynamic(() =>
  import('@/components/hero-sun').then((m) => m.HeroSun),
  { ssr: false }
);

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
  const { spots, loading: spotsLoading } = usePlaces(coords, address);

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
      <HeroSun />
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

        <div className="space-y-36 pb-10 lg:space-y-52">
          <TodaySection
            times={goldenHour?.times ?? null}
            quality={goldenHour?.quality ?? null}
            adjustedQuality={adjustedQuality}
            now={goldenHour?.now ?? new Date()}
            phaseLabel={PHASE_LABELS[goldenHour?.skyPhase ?? 'night']}
            sunPosition={goldenHour?.sunPosition ?? null}
            moonData={goldenHour?.moonData ?? null}
            forecast={goldenHour?.forecast ?? null}
            weather={weather}
            weatherLoading={weatherLoading}
            coords={coords}
            loading={loading}
            error={error}
            isBlocked={permissionStatus === 'denied'}
            onRequestPermission={requestPermission}
          />

          <DiscoverSection address={address} />

          <PlacesSection
            coords={coords}
            address={address}
            spots={spots}
            spotsLoading={spotsLoading}
            selectedSpotId={selectedSpotId}
            onSelectSpot={handleSelectSpot}
            permissionStatus={permissionStatus}
            loading={loading}
            error={error}
            onRequestPermission={requestPermission}
          />
        </div>

        <Footer />
      </div>
    </main>
  );
}
