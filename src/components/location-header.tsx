'use client';

import { MapPin, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import { getGreeting } from '@/utils/greeting';
import { formatLongDate } from '@/utils/formatters';
import { durations, easing, stagger, typography } from '@/theme';
import type { Address } from '@/types';

interface LocationHeaderProps {
  hasLocation: boolean;
  address: Address | null;
  date: Date;
  loading: boolean;
  onRefresh: () => void;
}

export function LocationHeader({
  hasLocation,
  address,
  date,
  loading,
  onRefresh,
}: LocationHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-6xl px-6 pt-40 sm:pt-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.slow, ease: easing.out }}
        className="flex flex-wrap items-end justify-between gap-8"
      >
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: durations.base, delay: 0.15, ease: easing.out }}
            style={{ ...typography.eyebrow }}
            className="mb-5 text-muted-foreground"
          >
            {getGreeting()}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow, delay: 0.22, ease: easing.out }}
            style={{ ...typography.h1 }}
            className="flex items-center gap-4"
          >
            <MapPin
              className="h-7 w-7 shrink-0 text-foreground/40"
              strokeWidth={1.25}
            />
            <span className="text-illuminated tracking-tight">
              {address?.label ?? 'Your sky, wherever you are'}
            </span>
            {hasLocation && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="group rounded-full p-2 text-muted-foreground transition-colors duration-500 hover:bg-secondary hover:text-foreground disabled:opacity-40"
                aria-label="Refresh location"
              >
                <RefreshCw
                  className={`h-4 w-4 transition-transform duration-500 group-hover:rotate-180 ${
                    loading ? 'animate-spin' : ''
                  }`}
                />
              </button>
            )}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: durations.slow, delay: 0.3 * stagger.hero }}
          className="text-sm tracking-wide text-muted-foreground"
        >
          {formatLongDate(date)}
        </motion.p>
      </motion.div>
    </header>
  );
}
