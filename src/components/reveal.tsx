'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { durations, easing } from '@/theme';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  duration?: number;
}

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = '',
  duration = durations.slow,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: easing.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MaskRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MaskReveal({
  children,
  delay = 0,
  className = '',
}: MaskRevealProps) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: '112%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.05, delay, ease: easing.out }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

interface WordRevealProps {
  text: string;
  delay?: number;
  staggerEach?: number;
  className?: string;
}

export function WordReveal({
  text,
  delay = 0,
  staggerEach = 0.05,
  className = '',
}: WordRevealProps) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-baseline"
        >
          <motion.span
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.9,
              delay: delay + i * staggerEach,
              ease: easing.out,
            }}
            className={`inline-block will-change-transform ${className}`}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </>
  );
}
