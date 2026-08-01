'use client';

import { Heart, Navigation, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { CATEGORY_LABELS, CATEGORY_VISUALS } from '@/lib/category-visuals';
import { getDirectionsUrl } from '@/services/places';
import { useFavoritesStore } from '@/store';
import { durations, easing, typography } from '@/theme';
import type { PhotographySpot } from '@/types';

interface NearbyPlaceCardProps {
  spot: PhotographySpot;
  index: number;
  selected: boolean;
  onSelect: (spot: PhotographySpot) => void;
}

export function NearbyPlaceCard({
  spot,
  index,
  selected,
  onSelect,
}: NearbyPlaceCardProps) {
  const { favoriteSpotIds, toggleFavorite } = useFavoritesStore();
  const isFavorite = favoriteSpotIds.includes(spot.id);
  const visual = CATEGORY_VISUALS[spot.category] ?? CATEGORY_VISUALS.viewpoint;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: durations.base, delay: (index % 3) * 0.08, ease: easing.out }}
      onClick={() => onSelect(spot)}
      className={`glass-card group cursor-pointer overflow-hidden transition-colors duration-500 ${
        selected ? 'ring-1 ring-primary/50' : ''
      }`}
    >
      <div
        className="relative h-40 overflow-hidden"
        style={{
          background: `radial-gradient(120% 160% at 20% 0%, ${visual.from}55 0%, transparent 55%), radial-gradient(120% 160% at 85% 110%, ${visual.to}cc 0%, transparent 60%), var(--background)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60"
          style={{
            background: `radial-gradient(60% 80% at 70% 20%, ${visual.from}44, transparent 70%)`,
            filter: 'blur(28px)',
          }}
        />
        <span className="absolute -bottom-5 -right-2 text-8xl opacity-20 grayscale">
          {visual.emoji}
        </span>
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em]"
            style={{
              backgroundColor: 'rgba(5, 5, 5, 0.5)',
              color: 'rgba(250, 250, 250, 0.85)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {CATEGORY_LABELS[spot.category]}
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-[10px] font-medium tabular-nums tracking-[0.14em]"
            style={{
              backgroundColor: 'rgba(5, 5, 5, 0.5)',
              color: '#FAFAFA',
              backdropFilter: 'blur(10px)',
            }}
          >
            GH {spot.goldenHourQuality.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-7">
        <div className="flex items-start justify-between gap-3">
          <h3 style={{ ...typography.h3 }} className="leading-snug">
            {spot.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(spot.id);
            }}
            className="rounded-full p-1.5 text-muted-foreground transition-colors duration-500 hover:bg-secondary hover:text-foreground"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-500 ${
                isFavorite ? 'fill-white/80 text-white/80' : ''
              }`}
            />
          </button>
        </div>

        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-light text-muted-foreground">
          <Star className="h-3 w-3 fill-white/50 text-white/50" />
          {spot.rating.toFixed(1)} · {spot.distance} km · {spot.bestTime}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
          <span className="text-xs font-light text-muted-foreground">
            {spot.walkingDistance} km walk
          </span>
          <a
            href={getDirectionsUrl(spot)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link flex items-center gap-1.5 text-xs font-medium transition-colors duration-500 hover:text-foreground"
          >
            <Navigation className="h-3.5 w-3.5 transition-transform duration-500 group-hover/link:translate-x-0.5" />
            Directions
          </a>
        </div>
      </div>
    </motion.article>
  );
}
