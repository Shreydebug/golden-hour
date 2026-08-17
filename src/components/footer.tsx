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
      className="relative z-10 mt-48 overflow-hidden"
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

          <Reveal delay={0.2}>
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
                  The vision
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  Light is temporary. Golden Hour exists so that no beautiful
                  window of light passes unnoticed — for photographers and for
                  anyone who simply loves a good sky.
                </p>
              </div>
              <div>
                <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
                  How it works
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  SunCalc derives sunrise, sunset, golden hour, blue hour and
                  twilight windows from your exact coordinates. Open-Meteo
                  layers live weather, cloud and air quality on top — so the
                  score reflects the sky as it is, not just as it was.
                </p>
              </div>
              <div>
                <p style={{ ...typography.eyebrow }} className="text-muted-foreground">
                  For photographers
                </p>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  Know precisely when the light peaks, where to stand, and what
                  the sky will do — so you arrive early, set up calmly and never
                  miss the window.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-between gap-8 pt-10">
              <div className="flex items-center gap-9 text-xs font-light tracking-wide text-muted-foreground">
                <a href="#today" className="transition-colors duration-500 hover:text-foreground">
                  Today
                </a>
                <a href="#discover" className="transition-colors duration-500 hover:text-foreground">
                  Discover
                </a>
                <a href="#places" className="transition-colors duration-500 hover:text-foreground">
                  Places
                </a>
                <a href="#about" className="transition-colors duration-500 hover:text-foreground">
                  About
                </a>
              </div>

              <p className="max-w-sm text-right text-[11px] font-light leading-relaxed text-muted-foreground/70">
                Sun times by SunCalc · Weather by Open-Meteo · Maps by Mapbox.
                Nearby spots are simulated for your area.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-foreground/10 pt-8 text-xs font-light tracking-wide text-muted-foreground/80">
              Crafted by
              <a
                href="https://github.com/shreydebug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline decoration-foreground/30 underline-offset-4 transition-colors duration-500 hover:text-golden hover:decoration-golden/60"
              >
                Shreyash Sahoo
              </a>
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
