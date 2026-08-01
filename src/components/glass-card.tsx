'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { durations, easing, stagger } from '@/theme';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  as?: 'div' | 'article' | 'section';
}

export function GlassCard({
  children,
  className = '',
  style,
  delay = 0,
  as: Tag = 'div',
}: GlassCardProps) {
  const Component = motion[Tag] ?? motion.div;

  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ref.current.style.setProperty('--spot-x', `${px * 100}%`);
    ref.current.style.setProperty('--spot-y', `${py * 100}%`);
  };

  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: durations.slow, delay: delay * stagger.cards, ease: easing.out }}
      onPointerMove={onPointerMove}
      style={style}
      className={`glass-card ${className}`}
    >
      {children}
    </Component>
  );
}
