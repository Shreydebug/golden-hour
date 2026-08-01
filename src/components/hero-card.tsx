'use client';

import { Camera, Loader2 } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';

import { CountdownCard } from '@/components/countdown-card';
import { Button } from '@/components/button';
import { useResolvedTheme } from '@/components/theme-provider';
import { formatTime } from '@/utils/formatters';
import { durations, easing, typography } from '@/theme';
import type { GoldenHourQuality, GoldenHourTimes } from '@/types';

interface HeroCardProps {
  times: GoldenHourTimes | null;
  quality: GoldenHourQuality | null;
  adjustedQuality: GoldenHourQuality | null;
  phaseLabel: string;
  hasLocation: boolean;
  loading: boolean;
  error: string | null;
  isBlocked: boolean;
  onRequestPermission: () => void;
}

function MaskLine({
  children,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-2 ${className}`}>
      <motion.span
        initial={{ y: '112%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.15, delay, ease: easing.out }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroCard({
  times,
  quality,
  adjustedQuality,
  phaseLabel,
  hasLocation,
  loading,
  error,
  isBlocked,
  onRequestPermission,
}: HeroCardProps) {
  const theme = useResolvedTheme();
  const sectionRef = useRef<HTMLElement>(null);

  const score = adjustedQuality?.score ?? quality?.score ?? null;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 26, damping: 22, mass: 1.4 });
  const springY = useSpring(pointerY, { stiffness: 26, damping: 22, mass: 1.4 });

  const headingX = useTransform(springX, (v) => v * 6);
  const headingY = useTransform(springY, (v) => v * 4);
  const glowX = useTransform(springX, (v) => v * -16);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerX, pointerY]);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.hero, delay, ease: easing.out },
  });

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl px-6"
    >
      <motion.div
        style={{ y: scrollY, opacity: scrollOpacity, scale: scrollScale }}
        className="relative mx-auto flex max-w-5xl flex-col gap-16 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full"
          style={{
            x: glowX,
            background: `radial-gradient(circle, ${
              theme === 'dark'
                ? 'rgba(255, 190, 110, 0.07)'
                : 'rgba(238, 205, 150, 0.14)'
            } 0%, transparent 62%)`,
            filter: 'blur(40px)',
          }}
        />

        <div className="relative max-w-3xl">
          <motion.div {...reveal(0.25)} className="mb-9 flex items-center gap-3">
            <Camera
              className="h-4 w-4 text-foreground/50"
              strokeWidth={1.5}
            />
            <span
              style={{ ...typography.eyebrow }}
              className="text-muted-foreground"
            >
              {phaseLabel}
            </span>
          </motion.div>

            <motion.div style={{ x: headingX, y: headingY }} className="will-change-transform">
            <motion.h1
              className="text-[36px] font-extralight leading-[0.98] tracking-[-0.03em] sm:text-[44px] md:text-[60px] lg:text-[72px]"
            >
              <MaskLine delay={0.35}>
                <span className="text-illuminated">Golden</span>{' '}
                <span className="text-illuminated">hour</span>
              </MaskLine>
              <MaskLine delay={0.48} className="text-fade">
                {times
                  ? `${times.bestWindowLabel.toLowerCase()} window`
                  : 'awaits your light'}
              </MaskLine>
            </motion.h1>
          </motion.div>

          <motion.p
            {...reveal(0.66)}
            className="mt-8 max-w-md text-xl font-light leading-relaxed text-muted-foreground"
          >
            {times
              ? `The light arrives ${formatTime(times.bestWindowStart)}. Be there for the deepest colour, the longest shadows, the quietest city.`
              : 'Share your location and we’ll tell you the exact minute the world turns gold.'}
          </motion.p>

          <motion.div {...reveal(0.78)} className="mt-14">
            <p
              style={{ ...typography.eyebrow }}
              className="mb-5 text-muted-foreground"
            >
              Starts in
            </p>
            {times ? (
              <CountdownCard target={times.bestWindowStart} />
            ) : (
              <p className="text-sm font-light text-muted-foreground">
                Waiting for your location…
              </p>
            )}
          </motion.div>

          {times && (
            <motion.div
              {...reveal(0.9)}
              className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2"
            >
              <span className="text-sm font-normal tracking-wide">
                {times.bestWindowLabel}{' '}
                <span className="font-light text-muted-foreground">window</span>
              </span>
              <span className="text-[15px] font-light tabular-nums text-muted-foreground">
                {formatTime(times.bestWindowStart)} –{' '}
                {formatTime(
                  times.bestWindowLabel === 'Morning'
                    ? times.morningGoldenHourEnd
                    : times.eveningGoldenHourEnd
                )}
              </span>
            </motion.div>
          )}
        </div>

        <div className="relative flex flex-col items-start gap-8 lg:items-end">
          {score !== null && (
            <motion.div
              {...reveal(0.84)}
              className="flex flex-col items-start gap-3 lg:items-end"
            >
              <span
                style={{ fontSize: 80, lineHeight: 0.9, letterSpacing: -0.04 }}
                className="text-illuminated font-thin tabular-nums tracking-tighter"
              >
                {score.toFixed(1)}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255, 200, 130, 0.95)' : 'rgba(208, 158, 78, 0.85)',
                    boxShadow: `0 0 12px ${
                      theme === 'dark' ? 'rgba(255, 200, 130, 0.6)' : 'rgba(208, 158, 78, 0.5)'
                    }`,
                  }}
                />
                {adjustedQuality?.label ?? quality?.label ?? '—'} · tonight’s light
              </span>
            </motion.div>
          )}

          {!hasLocation && (
            <motion.div {...reveal(0.96)} className="flex flex-col items-start gap-3">
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
                <p className="max-w-[240px] text-xs font-light leading-relaxed text-muted-foreground">
                  Location is blocked — allow it in browser settings to get
                  exact timings.
                </p>
              )}
              {error && (
                <p className="max-w-[240px] text-xs font-light leading-relaxed text-destructive">
                  {error}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
