'use client';

import { useEffect, useRef, useState } from 'react';

import { useResolvedTheme } from '@/components/theme-provider';

const SIZE = 104;
const SCALE_OVER = 1.3;

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const theme = useResolvedTheme();
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setCoarse(true);
      return;
    }

    const cursor = cursorRef.current;
    const core = coreRef.current;
    if (!cursor || !core) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    const vel = { x: 0, y: 0 };
    const targetScale = { value: 1 };
    const scale = { value: 1 };
    const targetOpacity = { value: 0 };
    const opacity = { value: 0 };
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (targetOpacity.value === 0) {
        pos.x = target.x;
        pos.y = target.y;
      }
      targetOpacity.value = 1;
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, select, textarea'
      );
      targetScale.value = interactive ? SCALE_OVER : 1;
    };

    const onLeave = () => {
      targetOpacity.value = 0;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;

      const stiffness = 0.075;
      const damping = 0.84;

      vel.x = (vel.x + (target.x - pos.x) * stiffness) * damping;
      vel.y = (vel.y + (target.y - pos.y) * stiffness) * damping;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      scale.value += (targetScale.value - scale.value) * 0.1 * dt;
      opacity.value += (targetOpacity.value - opacity.value) * 0.08 * dt;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale.value})`;
      cursor.style.opacity = String(opacity.value * 0.55);

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
            ? 'inset 0 0 28px rgba(255, 220, 170, 0.05), 0 16px 56px -16px rgba(0, 0, 0, 0.5)'
            : 'inset 0 0 28px rgba(255, 255, 255, 0.5), 0 16px 56px -16px rgba(60, 40, 16, 0.18)',
        background:
          theme === 'dark'
            ? 'radial-gradient(circle at 50% 42%, rgba(255, 236, 208, 0.1) 0%, rgba(255, 255, 255, 0.03) 46%, transparent 72%)'
            : 'radial-gradient(circle at 50% 42%, rgba(255, 252, 244, 0.85) 0%, rgba(255, 255, 255, 0.25) 48%, transparent 74%)',
        backdropFilter: `blur(16px) brightness(${theme === 'dark' ? 1.22 : 1.1}) saturate(1.35)`,
        WebkitBackdropFilter: `blur(16px) brightness(${theme === 'dark' ? 1.22 : 1.1}) saturate(1.35)`,
        transition: 'border-color 800ms ease, box-shadow 800ms ease',
      }}
    >
      <span
        ref={coreRef}
        className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(255, 240, 218, 0.5)' : 'rgba(40, 28, 14, 0.4)',
        }}
      />
    </div>
  );
}
