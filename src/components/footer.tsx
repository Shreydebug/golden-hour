'use client';

import { motion } from 'framer-motion';

import { MaskReveal, Reveal, WordReveal } from '@/components/reveal';
import { durations, easing, typography } from '@/theme';

export function Footer() {
  return (
    <motion.footer
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: durations.slow, ease: easing.out }}
      className="hairline relative z-10 mt-48 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="flex flex-col gap-24">
          <div>
            <p
              style={{ ...typography.displaySm }}
              className="max-w-3xl tracking-tight"
            >
              <WordReveal
                text="Find the perfect light,"
                className="text-illuminated"
              />{' '}
              <WordReveal
                text="wherever you are."
                delay={0.12}
                className="text-fade"
              />
            </p>
            <Reveal delay={0.15} y={20}>
              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
                Golden Hour computes sunrise, sunset, golden and blue hour for
                your exact position — then tells you where the light is best.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-between gap-8 border-t border-border/60 pt-10">
              <div className="flex items-center gap-9 text-xs font-light tracking-wide text-muted-foreground">
                <a href="#top" className="transition-colors duration-500 hover:text-foreground">
                  Home
                </a>
                <a href="#today" className="transition-colors duration-500 hover:text-foreground">
                  Today
                </a>
                <a href="#spots" className="transition-colors duration-500 hover:text-foreground">
                  Places
                </a>
                <a href="#map" className="transition-colors duration-500 hover:text-foreground">
                  Map
                </a>
              </div>

              <p className="max-w-sm text-right text-[11px] font-light leading-relaxed text-muted-foreground/70">
                Sun times by SunCalc · Weather by Open-Meteo · Maps by Mapbox.
                Nearby spots are simulated for your area.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none flex justify-center px-6 pb-6"
      >
        <MaskReveal delay={0.1}>
          <span className="block text-[clamp(2.25rem,7vw,8rem)] font-extralight leading-[0.95] tracking-[-0.03em] text-foreground/[0.045] select-none">
            Golden hour
          </span>
        </MaskReveal>
      </div>
    </motion.footer>
  );
}
