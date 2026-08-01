'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

interface DottedSunProps {
  theme: 'dark' | 'light';
}

const DOT_RGB = {
  dark: '252, 244, 230',
  light: '56, 42, 26',
};

const MAX_SHIFT = 40;
const BASE_SPACING = 9.5;
const PARALLAX_PAD = 64;

interface Dot {
  x: number;
  y: number;
  r: number;
  a: number;
  p: number;
  shimmer: boolean;
}

interface SunGeometry {
  R: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  pad: number;
}

function computeGeometry(winW: number, winH: number): SunGeometry {
  const R = Math.round(Math.max(winW * 1.08, winH * 1.55));
  const cx = winW + R * 0.22;
  const cy = winH * 0.4;
  return {
    R,
    cx,
    cy,
    w: winW + PARALLAX_PAD * 2,
    h: winH + PARALLAX_PAD * 2,
    pad: PARALLAX_PAD,
  };
}

export function DottedSun({ theme }: DottedSunProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geometry, setGeometry] = useState<SunGeometry | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const driftX = useSpring(pointerX, {
    stiffness: 18,
    damping: 20,
    mass: 1.8,
    restDelta: 0.001,
  });
  const driftY = useSpring(pointerY, {
    stiffness: 18,
    damping: 20,
    mass: 1.8,
    restDelta: 0.001,
  });

  useEffect(() => {
    const measure = () =>
      setGeometry(computeGeometry(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerX, pointerY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !geometry) return;

    const { R, cx, cy, w, h, pad } = geometry;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let seed = 1;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const dots: Dot[] = [];
    const cols = Math.ceil((R * 2) / BASE_SPACING);
    const rows = Math.ceil((R * 2) / BASE_SPACING);
    const rowOffset = (i: number) => (i % 2 === 0 ? BASE_SPACING * 0.5 : 0);

    const screenX = (gx: number) => cx - R + gx;
    const screenY = (gy: number) => cy - R + gy;

    for (let i = 0; i < cols; i++) {
      const stagger = rowOffset(i);
      for (let j = 0; j < rows; j++) {
        const gx = i * BASE_SPACING + stagger + (rand() - 0.5) * BASE_SPACING * 0.6;
        const gy = j * BASE_SPACING + (rand() - 0.5) * BASE_SPACING * 0.6;
        const d = Math.hypot(gx - R, gy - R);
        if (d > R * 1.03) continue;

        const sx = screenX(gx);
        const sy = screenY(gy);
        if (sx < -pad || sx > w + pad || sy < -pad || sy > h + pad) continue;

        const t = d / R;

        const angle = Math.atan2(gy - R, gx - R);
        const rEdge =
          R *
          (1 +
            0.02 * Math.sin(angle * 16 + 1.3) +
            0.014 * Math.sin(angle * 31 + 0.7) +
            0.008 * Math.sin(angle * 7 + 4.2));
        if (d > rEdge) continue;

        const skip = rand() < t * t * 0.62;
        if (skip) continue;

        const sizeDot = Math.max(
          0.2,
          1.45 * (1 - t * 0.74) * (0.72 + rand() * 0.55)
        );
        const a = Math.max(0.015, 0.75 * (1 - t) ** 1.45) * (0.7 + rand() * 0.6);
        dots.push({
          x: sx,
          y: sy,
          r: sizeDot / 2,
          a: Math.min(0.9, a),
          p: rand(),
          shimmer: rand() < 0.05,
        });
      }
    }

    const rgb = DOT_RGB[theme];

    const base = document.createElement('canvas');
    base.width = canvas.width;
    base.height = canvas.height;
    const bctx = base.getContext('2d');
    if (!bctx) return;
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const dot of dots) {
      bctx.globalAlpha = dot.a;
      bctx.fillStyle = `rgba(${rgb}, 1)`;
      bctx.beginPath();
      bctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      bctx.fill();
    }
    bctx.globalAlpha = 1;

    const shimmerDots = dots.filter((d) => d.shimmer).slice(0, 640);
    let raf = 0;
    const frame = (f: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0, w, h);
      const phase = f * 0.018;
      for (let i = 0; i < shimmerDots.length; i++) {
        const dot = shimmerDots[i];
        const wave = 0.18 * Math.sin(phase + dot.p * Math.PI * 2);
        ctx.globalAlpha = Math.max(0.015, Math.min(0.9, dot.a + wave));
        ctx.fillStyle = `rgba(${rgb}, 1)`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, [theme, geometry]);

  const shiftX = useTransform(driftX, (v) => v * -MAX_SHIFT);
  const shiftY = useTransform(driftY, (v) => v * -MAX_SHIFT);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden will-change-transform"
      style={{
        x: shiftX,
        y: shiftY,
        opacity: theme === 'dark' ? 0.85 : 0.5,
        mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
        transition: 'opacity 800ms ease',
      }}
    >
      {geometry && (
        <canvas
          ref={canvasRef}
          className="absolute block"
          style={{
            left: -geometry.pad,
            top: -geometry.pad,
            width: geometry.w,
            height: geometry.h,
          }}
        />
      )}
    </motion.div>
  );
}
