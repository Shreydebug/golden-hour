'use client';

import { useEffect, useRef, useState } from 'react';

const DIAMETER = 32;
const FOLLOW_RATE = 26;
const ZOOM_RATE = 14;
const ZOOM_OVER = 1.35;

export function CustomCursor() {
  const [coarse, setCoarse] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setCoarse(true);
      return;
    }

    const cursorEl = ref.current;
    if (!cursorEl) return;
    const dot: HTMLDivElement = cursorEl;

    const applyTheme = () =>
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let targetZoom = 1;
    let zoom = 1;
    let last = 0;
    let raf = 0;
    let visible = false;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        cx = mx;
        cy = my;
        dot.style.opacity = '1';
      }
    }

    function onOver(e: MouseEvent) {
      const interactive = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, select, textarea'
      );
      targetZoom = interactive ? ZOOM_OVER : 1;
    }

    function onLeave() {
      visible = false;
      dot.style.opacity = '0';
    }

    function tick(ts: number) {
      if (last === 0) last = ts;
      const dt = Math.min(ts - last, 50);
      last = ts;

      const k = 1 - Math.exp((-dt / 1000) * FOLLOW_RATE);
      cx += (mx - cx) * k;
      cy += (my - cy) * k;
      const zk = 1 - Math.exp((-dt / 1000) * ZOOM_RATE);
      zoom += (targetZoom - zoom) * zk;

      dot.style.transform = `translate3d(${cx - DIAMETER / 2}px, ${
        cy - DIAMETER / 2
      }px, 0) scale(${zoom})`;

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (coarse) return null;

  const dark = theme === 'dark';

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0"
      style={{
        width: DIAMETER,
        height: DIAMETER,
        borderRadius: '50%',
        border: dark
          ? '1px solid rgba(255,255,255,0.28)'
          : '1px solid rgba(20,16,12,0.32)',
        background: dark
          ? 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.07) 0%, transparent 70%)'
          : 'radial-gradient(circle at 50% 42%, rgba(20,16,12,0.05) 0%, transparent 70%)',
        boxShadow: dark
          ? '0 0 14px rgba(0,0,0,0.35)'
          : '0 0 10px rgba(0,0,0,0.12), inset 0 0 8px rgba(255,255,255,0.65)',
        willChange: 'transform',
      }}
    />
  );
}
