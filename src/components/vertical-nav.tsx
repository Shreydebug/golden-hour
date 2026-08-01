'use client';

import { motion } from 'framer-motion';

import { ThemeToggle } from '@/components/theme-toggle';
import { durations, easing } from '@/theme';

const ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'Explore', href: '#today' },
  { label: 'Places', href: '#spots' },
  { label: 'Gallery', href: '#map' },
  { label: 'About', href: '#about' },
];

export function VerticalNav() {
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: 0.5 },
        },
      }}
      className="fixed left-7 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-start gap-6 md:flex"
    >
      {ITEMS.map((item) => (
        <motion.a
          key={item.href}
          href={item.href}
          initial="rest"
          animate="rest"
          whileHover="hover"
          variants={{
            hidden: { opacity: 0, x: -16 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: durations.base, ease: easing.out },
            },
          }}
          className="group flex h-5 items-center gap-4"
        >
          <motion.span
            variants={{
              rest: { width: 10 },
              hover: { width: 30 },
            }}
            transition={{ duration: 0.5, ease: easing.apple }}
            className="h-px bg-foreground/40 transition-[background-color,box-shadow] duration-500 group-hover:bg-foreground group-hover:shadow-[0_0_12px_color-mix(in_srgb,var(--golden)_75%,transparent)]"
          />
          <motion.span
            variants={{
              rest: { opacity: 0, x: -14, filter: 'blur(6px)' },
              hover: { opacity: 1, x: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.5, ease: easing.apple }}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
          >
            {item.label}
          </motion.span>
        </motion.a>
      ))}

      <motion.div
        variants={{
          hidden: { opacity: 0, x: -16 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: durations.base, ease: easing.out },
          },
        }}
        className="mt-8 pl-1"
      >
        <ThemeToggle />
      </motion.div>
    </motion.nav>
  );
}
