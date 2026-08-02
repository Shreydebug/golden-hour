'use client';

import { Compass, Gem, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { WordReveal } from '@/components/reveal';
import { durations, easing, typography } from '@/theme';

interface DiscoverItem {
  src: string;
  name: string;
  place: string;
  note: string;
  score?: string;
}

const FEATURED: DiscoverItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    name: 'Alpenglow Ridge',
    place: 'Highlands, Scotland',
    note: 'A ridgeline that catches the last light long after the valleys go dark.',
    score: '9.6',
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80',
    name: 'Bridge Glow',
    place: 'San Francisco, USA',
    note: 'Warm fog, steel and a horizon that turns to honey at dusk.',
    score: '9.2',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
    name: 'Ridge of Gold',
    place: 'Alps, Switzerland',
    note: 'Snow fields that burn amber for a full forty minutes before night.',
    score: '9.0',
  },
];

const CURATED: DiscoverItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
    name: 'First light',
    place: 'Open fields',
    note: 'Mist, long shadows, a sun just breaking the line.',
  },
  {
    src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1200&q=80',
    name: 'Last light',
    place: 'Horizon',
    note: 'The minute before the sky catches fire.',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    name: 'Forest rays',
    place: 'Deep woods',
    note: 'Beams through canopy, dust suspended in gold.',
  },
  {
    src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    name: 'Open fields',
    place: 'Farmland',
    note: 'An endless amber sea rolling to the horizon.',
  },
  {
    src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80',
    name: 'Coastline',
    place: 'Sea edge',
    note: 'Reflections, salt air, and a sky turning rose.',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    name: 'Morning fog',
    place: 'The hills',
    note: 'Soft light wrapped in white silk.',
  },
];

const GEMS: DiscoverItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1000&q=80',
    name: 'Dusk grass',
    place: 'Quiet valley',
    note: 'Uncrowded, unmarked — the locals keep it to themselves.',
  },
  {
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    name: 'Peaks',
    place: 'Backcountry',
    note: 'A short scramble from the trailhead, rarely visited.',
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80',
    name: 'Wheat gold',
    place: 'Back roads',
    note: 'Private fields with a public skyline view.',
  },
];

const TRENDING: DiscoverItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1000&q=80',
    name: 'Sunset sky',
    place: 'Downtown',
    note: 'The city is talking about this one this week.',
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
    name: 'Alpine glow',
    place: 'The range',
    note: 'Perfect conditions predicted for the next three days.',
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80',
    name: 'Bay bridge',
    place: 'Waterfront',
    note: 'Golden hour with a low tide — the reflection is unreal.',
  },
];

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: durations.base, ease: easing.out }}
      className="mb-12 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <p style={{ ...typography.eyebrow }} className="mb-3 text-muted-foreground">
          {eyebrow}
        </p>
        <h2 style={{ ...typography.h2 }} className="tracking-tight">
          <WordReveal text={title} className="text-fade" />
        </h2>
        <p className="mt-2 text-sm font-light text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}

function ImageCard({
  item,
  index,
  className = '',
  compact = false,
}: {
  item: DiscoverItem;
  index: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: durations.base, delay: (index % 3) * 0.1, ease: easing.out }}
      className={`group relative overflow-hidden rounded-3xl ${className}`}
    >
      <img
        src={item.src}
        alt={item.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      {item.score && (
        <span
          className="absolute right-5 top-5 rounded-full px-3 py-1.5 text-[10px] font-medium tabular-nums tracking-[0.14em]"
          style={{
            backgroundColor: 'rgba(5, 5, 5, 0.5)',
            color: '#ffd28a',
            backdropFilter: 'blur(10px)',
          }}
        >
          {item.score}
        </span>
      )}
      <div className={`absolute bottom-0 left-0 w-full p-6 ${compact ? 'p-5' : ''}`}>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
          {item.place}
        </p>
        <h3 className={`mt-1.5 tracking-tight text-white ${compact ? 'text-lg' : 'text-2xl'}`}>
          {item.name}
        </h3>
        {!compact && (
          <p className="mt-2 max-w-xs text-xs font-light leading-relaxed text-white/70">
            {item.note}
          </p>
        )}
      </div>
    </motion.article>
  );
}

export function DiscoverSection() {
  return (
    <motion.section
      id="discover"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: durations.slow, ease: easing.out }}
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6"
    >
      <SectionHeader
        eyebrow="Discover"
        title="Places worth the drive"
        sub="Featured locations, curated light and the spots everyone is talking about."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {FEATURED.map((item, index) => (
          <ImageCard
            key={item.name}
            item={item}
            index={index}
            className="aspect-[3/4] md:aspect-[3/4.6]"
          />
        ))}
      </div>

      <div className="mt-16">
        <SectionHeader
          eyebrow="Curated"
          title="Golden hour photography"
          sub="A quiet edit of the light you're waiting for."
        />
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {CURATED.map((item, index) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: durations.base,
                delay: (index % 3) * 0.08,
                ease: easing.out,
              }}
              className="group relative mb-5 overflow-hidden rounded-3xl break-inside-avoid"
            >
              <img
                src={item.src}
                alt={item.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" />
              <figcaption className="absolute bottom-4 left-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                  {item.place}
                </p>
                <p className="mt-0.5 text-sm font-light tracking-wide text-white/95">
                  {item.name}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Hidden gems"
            title="Off the map"
            sub="A little quieter, a little rarer."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {GEMS.map((item, index) => (
              <ImageCard key={item.name} item={item} index={index} compact />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow="Trending"
            title="Talked about this week"
            sub="The spots everyone is sharing right now."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {TRENDING.map((item, index) => (
              <ImageCard key={item.name} item={item} index={index} compact />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-light uppercase tracking-[0.18em] text-muted-foreground/60">
        <span className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
          Featured
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
          Curated
        </span>
        <span className="flex items-center gap-2">
          <Gem className="h-3.5 w-3.5" strokeWidth={1.5} />
          Hidden gems
        </span>
        <span className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          Trending
        </span>
      </div>
    </motion.section>
  );
}
