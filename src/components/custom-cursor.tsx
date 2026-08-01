'use client';

import { useEffect, useRef, useState } from 'react';

import { useResolvedTheme } from '@/components/theme-provider';

const SIZE = 30;
const LERP = 0.35;
const SCALE_OVER = 1.3;

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const theme = useResolvedTheme();
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setCoarse(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (opacity === 0) {
        x = tx;
        y = ty;
      }
      targetOpacity = 0.6;
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, select, textarea'
      );
      targetScale = interactive ? SCALE_OVER : 1;
    };

    const onLeave = () => {
      targetOpacity = 0;
    };

    const tick = () => {
      x += (tx - x) * LERP;
      y += (ty - y) * LERP;
      scale += (targetScale - scale) * 0.15;
      opacity += (targetOpacity - opacity) * 0.12;

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      cursor.style.opacity = String(opacity);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (coarse) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full opacity-0 will-change-transform"
      style={{
        width: SIZE,
        height: SIZE,
        border: `1px solid ${
          theme === 'dark' ? 'rgba(255, 245, 230, 0.16)' : 'rgba(30, 22, 12, 0.12)'
        }`,
        boxShadow:
          theme === 'dark'
            ? 'inset 0 0 7px rgba(255, 220, 170, 0.05), 0 4px 14px -4px rgba(0, 0, 0, 0.5)'
            : 'inset 0 0 7px rgba(255, 255, 255, 0.5), 0 4px 14px -4px rgba(60, 40, 16, 0.18)',
        background:
          theme === 'dark'
            ? 'radial-gradient(circle at 50% 42%, rgba(255, 236, 208, 0.1) 0%, rgba(255, 255, 255, 0.03) 46%, transparent 72%)'
            : 'radial-gradient(circle at 50% 42%, rgba(255, 252, 244, 0.85) 0%, rgba(255, 255, 255, 0.25) 48%, transparent 74%)',
        backdropFilter: `blur(4px) brightness(${theme === 'dark' ? 1.22 : 1.1}) saturate(1.35)`,
        WebkitBackdropFilter: `blur(4px) brightness(${theme === 'dark' ? 1.22 : 1.1}) saturate(1.35)`,
        transition: 'border-color 800ms ease, box-shadow 800ms ease',
      }}
    >
      <span
        className="absolute left-1/2 top-1/2 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(255, 240, 218, 0.5)' : 'rgba(40, 28, 14, 0.4)',
        }}
      />
    </div>
  );
}
