'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { easing } from '@/theme';

type ButtonVariant = 'text' | 'glass' | 'glow';

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  > {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS: Record<ButtonVariant, string> = {
  text: 'text-foreground/85 hover:text-foreground',
  glass: 'text-foreground',
  glow: 'text-foreground',
};

const SIZES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-5 text-[13px]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-[15px]',
};

const BASE =
  'group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-light tracking-wide transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40';

function Bloom() {
  return (
    <motion.span
      aria-hidden
      variants={{ hover: { opacity: 1, scale: 1 } }}
      transition={{ duration: 0.55, ease: easing.apple }}
      className="glass-bloom absolute inset-0 -z-10 rounded-xl opacity-0 scale-[0.97]"
      style={{ willChange: 'opacity, transform' }}
    />
  );
}

function Sheen() {
  return (
    <motion.span
      aria-hidden
      variants={{ hover: { x: '0%', opacity: 1 } }}
      transition={{ duration: 0.9, ease: easing.apple }}
      className="absolute inset-y-0 -left-3/4 -z-[5] w-1/2 rounded-xl opacity-0 blur-md"
      style={{
        background:
          'linear-gradient(100deg, transparent 0%, color-mix(in srgb, var(--golden) 22%, transparent) 50%, transparent 100%)',
      }}
    />
  );
}

function Underscore() {
  return (
    <motion.span
      aria-hidden
      variants={{ hover: { scaleX: 1, opacity: 1 } }}
      transition={{ duration: 0.5, ease: easing.apple }}
      className="absolute -bottom-1 left-1/4 h-px w-1/2 origin-center scale-x-0 opacity-0"
      style={{
        background:
          'linear-gradient(90deg, transparent, color-mix(in srgb, var(--foreground) 75%, transparent), transparent)',
      }}
    />
  );
}

export function Button({
  children,
  variant = 'text',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      initial="rest"
      animate="rest"
      transition={{ duration: 0.4, ease: easing.apple }}
      className={`group ${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      <Bloom />
      <Sheen />
      <Underscore />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
