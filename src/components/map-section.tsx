'use client';

import { useEffect, useRef } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { useResolvedTheme } from '@/components/theme-provider';
import { typography } from '@/theme';
import type { GeoCoordinates, PhotographySpot, SpotCategory } from '@/types';

const CATEGORY_EMOJI: Record<SpotCategory, string> = {
  viewpoint: '📍',
  park: '🌳',
  hilltop: '⛰️',
  lake: '🌊',
  waterfront: '🌉',
  beach: '🏖️',
  mountain: '🏔️',
  bridge: '🌉',
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapSectionProps {
  coords: GeoCoordinates;
  spots: PhotographySpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spot: PhotographySpot) => void;
}

export function MapSection({
  coords,
  spots,
  selectedSpotId,
  onSelectSpot,
}: MapSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ map: unknown; markers: unknown[] } | null>(null);
  const theme = useResolvedTheme();

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    let cancelled = false;
    let map: import('mapbox-gl').Map | undefined;
    const markers: { remove: () => void }[] = [];

    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      if (cancelled || !containerRef.current) return;

      map = new mapboxgl.Map({
        container: containerRef.current,
        style:
          theme === 'dark'
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/light-v11',
        center: [coords.longitude, coords.latitude],
        zoom: 12,
        attributionControl: false,
      });

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: true }),
        'top-right'
      );

      map.on('load', () => {
        if (cancelled) return;

        const userEl = document.createElement('div');
        userEl.style.cssText =
          'width:18px;height:18px;border-radius:9999px;background:#FAFAFA;border:3px solid #050505;box-shadow:0 0 0 6px rgba(250,250,250,0.2),0 0 24px rgba(250,250,250,0.55);';
        markers.push(new mapboxgl.Marker({ element: userEl, anchor: 'center' }).setLngLat([coords.longitude, coords.latitude]).addTo(map!));

        spots.forEach((spot) => {
          const selected = spot.id === selectedSpotId;
          const el = document.createElement('div');
          el.innerHTML = `<span style="filter:grayscale(1)">${CATEGORY_EMOJI[spot.category] ?? '📍'}</span>`;
          el.style.cssText = `width:36px;height:36px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:16px;background:${selected ? '#FAFAFA' : 'rgba(255,255,255,0.95)'};border:${selected ? '2px solid #FAFAFA' : '1px solid rgba(0,0,0,0.1)'};box-shadow:${selected ? '0 4px 16px rgba(255,255,255,0.35)' : '0 4px 16px rgba(0,0,0,0.35)'};cursor:pointer;transition:transform .15s;`;
          el.addEventListener('click', () => {
            const spotObj = spots.find((s) => s.id === spot.id);
            if (spotObj) onSelectSpot(spotObj);
          });
          markers.push(
            new mapboxgl.Marker({ element: el, anchor: 'center' })
              .setLngLat([spot.longitude, spot.latitude])
              .addTo(map!)
          );
        });

        if (spots.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([coords.longitude, coords.latitude]);
          spots.forEach((s) => bounds.extend([s.longitude, s.latitude]));
          map?.fitBounds(bounds, { padding: 70, duration: 900, maxZoom: 13 });
        }
      });

      mapRef.current = { map, markers };
    })();

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      map?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.latitude, coords.longitude, theme, spots.length, spots.map((s) => s.id).join(',')]);

  return (
    <motion.section
      id="map"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 style={{ ...typography.h2 }} className="tracking-tight">
            <span className="text-fade">Explore the map</span>
          </h2>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Your location and {spots.length} nearby photography spots
          </p>
        </div>
      </div>

      {MAPBOX_TOKEN ? (
        <div
          ref={containerRef}
          className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/30 sm:h-[500px]"
        />
      ) : (
        <div className="glass relative flex h-[320px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl sm:h-[380px]">
          <div className="absolute inset-0 opacity-40">
            <div className="animate-aurora absolute -left-1/4 -top-1/4 h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent_60%)] blur-3xl" />
            <div className="animate-aurora absolute -bottom-1/4 -right-1/4 h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.25),transparent_55%)] blur-3xl" />
          </div>
          <Compass className="relative h-12 w-12 text-primary" />
          <p className="relative max-w-xs text-center text-sm text-muted-foreground">
            Set <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> in{' '}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">.env.local</code> to unlock the interactive map.
          </p>
          <p className="relative flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <MapPin className="h-3.5 w-3.5" />
            {coords.latitude.toFixed(4)}°, {coords.longitude.toFixed(4)}°
          </p>
        </div>
      )}
    </motion.section>
  );
}
