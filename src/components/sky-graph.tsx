'use client';

import { useId, useMemo } from 'react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/glass-card';
import { getSunPosition } from '@/services/golden-hour';
import { formatTime } from '@/utils/formatters';
import { durations, easing, typography } from '@/theme';
import type { GeoCoordinates, GoldenHourTimes } from '@/types';

const W = 800;
const H = 250;
const PAD_T = 16;
const PAD_B = 34;
const ALT_MIN = -6;
const ALT_MAX = 45;
const STEP_MIN = 10;

interface Sample {
  t: number;
  alt: number;
}

interface SkyGraphsProps {
  times: GoldenHourTimes;
  now: Date;
  coords: GeoCoordinates;
}

function buildSamples(
  times: GoldenHourTimes,
  coords: GeoCoordinates
): { start: number; end: number; total: number; pts: Sample[] } {
  const start =
    times.astronomicalTwilightStart.getTime() - 30 * 60 * 1000;
  const end = times.astronomicalTwilightEnd.getTime() + 30 * 60 * 1000;
  const total = end - start;
  const pts: Sample[] = [];

  for (let t = start; t <= end; t += STEP_MIN * 60 * 1000) {
    const alt = getSunPosition(new Date(t), coords).altitude;
    pts.push({ t, alt: Math.max(ALT_MIN, Math.min(ALT_MAX, alt)) });
  }

  return { start, end, total, pts };
}

function xOf(t: number, start: number, total: number): number {
  return ((t - start) / total) * W;
}

function yOf(alt: number): number {
  return PAD_T + ((ALT_MAX - alt) / (ALT_MAX - ALT_MIN)) * (H - PAD_T - PAD_B);
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function bandRects(
  start: number,
  total: number,
  from: Date,
  to: Date,
  color: string
) {
  const x = xOf(from.getTime(), start, total);
  const width = Math.max(2, xOf(to.getTime(), start, total) - x);
  if (width <= 2 || x >= W || x + width <= 0) return null;
  return (
    <motion.rect
      x={x}
      width={width}
      y={PAD_T}
      height={H - PAD_T - PAD_B}
      rx={12}
      fill={color}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow, ease: easing.out }}
    />
  );
}

export function SkyGraphs({ times, now, coords }: SkyGraphsProps) {
  const gradId = useId();
  const gradIdIntensity = useId();
  const gradIdBand = useId();

  const { start, end, total, pts } = useMemo(
    () => buildSamples(times, coords),
    [times, coords]
  );

  const chartPts = useMemo(
    () => pts.map((p) => ({ x: xOf(p.t, start, total), y: yOf(p.alt) })),
    [pts, start, total]
  );

  const altitudePath = smoothPath(chartPts);
  const areaPath = `${altitudePath} L ${chartPts[chartPts.length - 1].x} ${H - PAD_B} L ${chartPts[0].x} ${H - PAD_B} Z`;

  const maxAlt = useMemo(
    () => pts.reduce((m, p) => Math.max(m, p.alt), 0),
    [pts]
  );
  const minAlt = Math.max(ALT_MIN, 0);

  const intensityPts = useMemo(
    () =>
      pts.map((p) => ({
        x: xOf(p.t, start, total),
        y: PAD_T + (1 - (p.alt - minAlt) / Math.max(1, maxAlt - minAlt)) * (H - PAD_T - PAD_B),
      })),
    [pts, start, total, maxAlt, minAlt]
  );
  const intensityPath = smoothPath(intensityPts);
  const intensityArea = `${intensityPath} L ${intensityPts[intensityPts.length - 1].x} ${H - PAD_B} L ${intensityPts[0].x} ${H - PAD_B} Z`;

  const nowT = now.getTime();
  const nowX = nowT >= start && nowT <= end ? xOf(nowT, start, total) : null;
  const nowSample = pts.find((p) => p.t >= nowT) ?? null;

  const midLabel = formatTime(new Date(start + total / 2));

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="grid gap-5 md:grid-cols-2">
        <GlassCard className="p-8 sm:p-10" delay={0}>
          <div className="mb-6 flex items-center justify-between">
            <h3 style={{ ...typography.eyebrow }} className="text-muted-foreground">
              Sun arc
            </h3>
            <span className="text-[11px] font-light tracking-wide text-muted-foreground/70">
              Altitude · golden &amp; blue hour
            </span>
          </div>

          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-40 w-full sm:h-48"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255, 210, 138, 0.22)" />
                  <stop offset="100%" stopColor="rgba(255, 210, 138, 0)" />
                </linearGradient>
                <linearGradient id={gradIdBand} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </linearGradient>
              </defs>

              {bandRects(
                start,
                total,
                times.civilTwilightStart,
                times.sunrise,
                'rgba(168, 150, 220, 0.10)'
              )}
              {bandRects(
                start,
                total,
                times.sunset,
                times.civilTwilightEnd,
                'rgba(168, 150, 220, 0.10)'
              )}
              {bandRects(
                start,
                total,
                times.morningBlueHourStart,
                times.morningBlueHourEnd,
                'rgba(120, 140, 236, 0.13)'
              )}
              {bandRects(
                start,
                total,
                times.eveningBlueHourStart,
                times.eveningBlueHourEnd,
                'rgba(120, 140, 236, 0.13)'
              )}
              {bandRects(
                start,
                total,
                times.morningGoldenHourStart,
                times.morningGoldenHourEnd,
                'rgba(255, 190, 110, 0.16)'
              )}
              {bandRects(
                start,
                total,
                times.eveningGoldenHourStart,
                times.eveningGoldenHourEnd,
                'rgba(255, 190, 110, 0.16)'
              )}

              <path d={areaPath} fill={`url(#${gradId})`} />

              <motion.path
                d={altitudePath}
                fill="none"
                stroke="rgba(255, 210, 138, 0.85)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 2.2, ease: easing.out }}
              />

              {nowX !== null && (
                <>
                  <motion.line
                    x1={nowX}
                    x2={nowX}
                    y1={PAD_T}
                    y2={H - PAD_B}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeWidth={1}
                    strokeDasharray="3 4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: durations.base, delay: 1.6 }}
                  />
                  <motion.circle
                    cx={nowX}
                    cy={nowSample ? yOf(nowSample.alt) : PAD_T}
                    r={4.5}
                    fill="#ffd28a"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: durations.base, delay: 1.8, ease: easing.spring }}
                  />
                  <motion.circle
                    cx={nowX}
                    cy={nowSample ? yOf(nowSample.alt) : PAD_T}
                    r={11}
                    fill="none"
                    stroke="rgba(255, 210, 138, 0.4)"
                    strokeWidth={1}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: durations.slow, delay: 1.8, ease: easing.out }}
                  />
                </>
              )}

              <line
                x1={xOf(times.sunrise.getTime(), start, total)}
                x2={xOf(times.sunrise.getTime(), start, total)}
                y1={yOf(0)}
                y2={H - PAD_B}
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth={1}
              />
              <line
                x1={xOf(times.sunset.getTime(), start, total)}
                x2={xOf(times.sunset.getTime(), start, total)}
                y1={yOf(0)}
                y2={H - PAD_B}
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth={1}
              />
            </svg>

            <div className="pointer-events-none absolute bottom-0 flex w-full justify-between px-1 text-[10px] font-light tabular-nums tracking-wide text-muted-foreground/70">
              <span style={{ left: `${(xOf(times.sunrise.getTime(), start, total) / W) * 100}%` }} className="absolute -translate-x-1/2">
                Sunrise {formatTime(times.sunrise)}
              </span>
              <span style={{ left: `${(xOf(times.sunset.getTime(), start, total) / W) * 100}%` }} className="absolute -translate-x-1/2">
                Sunset {formatTime(times.sunset)}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8 sm:p-10" delay={1}>
          <div className="mb-6 flex items-center justify-between">
            <h3 style={{ ...typography.eyebrow }} className="text-muted-foreground">
              Light intensity
            </h3>
            <span className="text-[11px] font-light tracking-wide text-muted-foreground/70">
              Across the day
            </span>
          </div>

          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-40 w-full sm:h-48"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id={gradIdIntensity} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255, 210, 138, 0.28)" />
                  <stop offset="100%" stopColor="rgba(255, 210, 138, 0)" />
                </linearGradient>
              </defs>

              <path d={intensityArea} fill={`url(#${gradIdIntensity})`} />

              <motion.path
                d={intensityPath}
                fill="none"
                stroke="rgba(255, 255, 255, 0.55)"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 2.2, delay: 0.15, ease: easing.out }}
              />

              {nowX !== null && (
                <motion.line
                  x1={nowX}
                  x2={nowX}
                  y1={PAD_T}
                  y2={H - PAD_B}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: durations.base, delay: 1.6 }}
                />
              )}
            </svg>

            <div className="pointer-events-none absolute bottom-0 flex w-full items-end justify-between px-1 text-[10px] font-light tabular-nums tracking-wide text-muted-foreground/70">
              <span>{formatTime(new Date(start))}</span>
              <span className="text-muted-foreground">{midLabel}</span>
              <span>{formatTime(new Date(end))}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
