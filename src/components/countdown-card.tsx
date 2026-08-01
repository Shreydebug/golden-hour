'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useNow } from '@/hooks/use-now';
import { durations, easing } from '@/theme';

interface CountdownCardProps {
  target: Date;
  activeLabel?: string;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: durations.fast, ease: easing.apple }}
            className="text-illuminated block text-4xl font-extralight tabular-nums tracking-tight"
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function CountdownCard({
  target,
  activeLabel = 'Golden hour is active now',
}: CountdownCardProps) {
  const now = useNow(1000);
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return (
      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: durations.base, ease: easing.out }}
        className="text-xl font-light tracking-tight text-accent-foreground sm:text-2xl"
      >
        {activeLabel}
      </motion.p>
    );
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <Digit value={hours} label="Hours" />
      <span className="mt-0.5 text-3xl font-thin text-muted-foreground/40">
        :
      </span>
      <Digit value={minutes} label="Minutes" />
      <span className="mt-0.5 text-3xl font-thin text-muted-foreground/40">
        :
      </span>
      <Digit value={seconds} label="Seconds" />
    </div>
  );
}
