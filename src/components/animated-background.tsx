'use client';

import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

import { BackgroundGlow } from '@/components/background-glow';
import { useResolvedTheme } from '@/components/theme-provider';
import { GLOW_SCENES, LIGHT_SCENES } from '@/theme';
import type { SkyPhase } from '@/types';

interface AnimatedBackgroundProps {
  phase: SkyPhase;
}

const MAX_SHIFT = 40;

export function AnimatedBackground({ phase }: AnimatedBackgroundProps) {
  const theme = useResolvedTheme();
  const scenes = theme === 'dark' ? GLOW_SCENES : LIGHT_SCENES;
  const scene = scenes[phase];

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const lightX = useSpring(pointerX, {
    stiffness: 22,
    damping: 20,
    mass: 1.6,
    restDelta: 0.001,
  });
  const lightY = useSpring(pointerY, {
    stiffness: 22,
    damping: 20,
    mass: 1.6,
    restDelta: 0.001,
  });

  const shiftLightX = useTransform(lightX, (v) => v * -MAX_SHIFT);
  const shiftLightY = useTransform(lightY, (v) => v * -MAX_SHIFT);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerX, pointerY]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
      style={{ transition: 'background-color 800ms ease' }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          x: shiftLightX,
          y: shiftLightY,
          mixBlendMode: theme === 'dark' ? 'screen' : 'normal',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.93, 1] }}
          transition={{ duration: 16, ease: 'easeInOut', repeat: Infinity }}
          className="absolute inset-0"
        >
          {scene.map((light, i) => (
            <BackgroundGlow
              key={i}
              color={light.color}
              x={light.x}
              y={light.y}
              size={light.size}
              opacity={light.opacity}
              blur={light.blur}
              style={{
                animation: `${light.drift} ${light.duration}s ease-in-out ${light.delay}s infinite alternate`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 8%, transparent 42%, var(--scrim) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--scrim) 0%, transparent 22%, transparent 74%, var(--scrim-deep) 100%)',
        }}
      />

      <div
        data-html2canvas-ignore
        className="grain absolute inset-0 opacity-[0.03]"
        style={{ mixBlendMode: 'overlay' }}
      />
    </div>
  );
}
