'use client';

import { Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/button';
import { GlassCard } from '@/components/glass-card';
import { MapSection } from '@/components/map-section';
import { NearbyPlaceCard } from '@/components/nearby-place-card';
import { Skeleton } from '@/components/ui/skeleton';
import { WordReveal } from '@/components/reveal';
import { durations, easing, typography } from '@/theme';
import { normalizeCityName } from '@/data/city-spots';
import type { Address, GeoCoordinates, PhotographySpot } from '@/types';

interface PlacesSectionProps {
  coords: GeoCoordinates | null;
  address: Address | null;
  spots: PhotographySpot[];
  spotsLoading: boolean;
  selectedSpotId: string | null;
  onSelectSpot: (spot: PhotographySpot) => void;
  permissionStatus: string;
  loading: boolean;
  error: string | null;
  onRequestPermission: () => void;
}

export function PlacesSection({
  coords,
  address,
  spots,
  spotsLoading,
  selectedSpotId,
  onSelectSpot,
  permissionStatus,
  loading,
  error,
  onRequestPermission,
}: PlacesSectionProps) {
  const isBlocked = permissionStatus === 'denied';
  const city = normalizeCityName(address?.city ?? address?.region ?? null);
  const cityLabel = city
    ? city
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

  return (
    <motion.section
      id="places"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: durations.slow, ease: easing.out }}
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 style={{ ...typography.h2 }} className="tracking-tight">
            <WordReveal text="Places" className="text-fade" />
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-light text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-foreground/40" strokeWidth={1.5} />
            Interactive map · best golden hour spots
            {cityLabel ? ` in ${cityLabel}` : ''}
          </p>
        </div>
      </div>

      {coords ? (
        <div className="flex flex-col gap-16">
          <MapSection
            coords={coords}
            spots={spots}
            selectedSpotId={selectedSpotId}
            onSelectSpot={onSelectSpot}
          />

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: durations.base, ease: easing.out }}
              className="mb-8 flex flex-wrap items-end justify-between gap-4"
            >
              <h3 style={{ ...typography.h3 }} className="tracking-tight">
                <WordReveal text="Nearby photography spots" className="text-fade" />
              </h3>
              <span className="text-xs font-light tracking-wide text-muted-foreground">
                {spots.length} vantage points around you
              </span>
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
                    onSelect={onSelectSpot}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <GlassCard className="flex flex-col items-center justify-center gap-5 p-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-foreground/15">
            <MapPin className="h-6 w-6 text-foreground/60" strokeWidth={1.25} />
          </span>
          <p className="max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
            Share your location to unlock the interactive map and the golden
            hour viewpoints around you.
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
      )}
    </motion.section>
  );
}
