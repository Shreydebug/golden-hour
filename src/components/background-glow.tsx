'use client';

import type { CSSProperties } from 'react';

interface BackgroundGlowProps {
  color: string;
  className?: string;
  style?: CSSProperties;
  x?: string;
  y?: string;
  size?: string;
  opacity?: number;
  blur?: number;
}

export function BackgroundGlow({
  color,
  className = '',
  style,
  x = '0',
  y = '0',
  size = '70vw',
  opacity = 0.4,
  blur = 140,
}: BackgroundGlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        ...style,
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        filter: `blur(${blur}px)`,
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 68%)`,
      }}
    />
  );
}
