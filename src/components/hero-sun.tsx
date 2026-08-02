'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useResolvedTheme } from '@/components/theme-provider';

const COUNT = 14000;
const ROT_Y = (Math.PI * 2) / 75;
const ROT_X = (Math.PI * 2) / 240;
const MAX_TILT_Y = 0.087;
const MAX_TILT_X = 0.043;
const CAM_DIST = 10;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRadius;
  uniform float uCamDist;

  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFade;

  void main() {
    vec4 p = vec4(position * uRadius, 1.0);
    vec4 mv = modelViewMatrix * p;

    float depth = -mv.z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio / depth;

    float back = uCamDist + uRadius;
    float front = uCamDist - uRadius;
    float t = clamp((depth - back) / (front - back), 0.0, 1.0);

    vFade = t * t;
    vColor = aColor;
    vAlpha = aAlpha;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uShimmer;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float disc = smoothstep(0.5, 0.14, d);

    float shimmer = 1.0 + uShimmer * sin(uTime * 0.7 + gl_FragCoord.x * 0.015);
    float alpha = vAlpha * vFade * disc * shimmer;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(vColor, alpha);
  }
`;

function buildParticles(light: boolean) {
  const positions = new Float32Array(COUNT * 3);
  const scales = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const alphas = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);

  const c = new THREE.Color();
  const golden = Math.PI * (3 - Math.sqrt(5));
  const baseAlpha = light ? 0.32 : 0.48;

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const jitter = 1 + (Math.random() - 0.5) * 0.045;

    positions[i * 3] = Math.cos(theta) * r * jitter;
    positions[i * 3 + 1] = y * jitter;
    positions[i * 3 + 2] = Math.sin(theta) * r * jitter;

    scales[i] = 0.3 + Math.random() * 0.8;
    phases[i] = Math.random();
    alphas[i] = baseAlpha + Math.random() * 0.32;

    const pick = Math.random();
    if (pick < 0.6) c.setRGB(1.02, 0.97, 0.88);
    else if (pick < 0.88) c.setRGB(1.0, 0.82, 0.55);
    else c.setRGB(1.0, 0.67, 0.34);
    if (light) c.multiplyScalar(0.22);

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  return { positions, scales, phases, alphas, colors };
}

function SunPoints({ theme }: { theme: 'dark' | 'light' }) {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const viewport = useThree((s) => s.viewport);
  const dpr = useThree((s) => s.viewport.dpr);

  const pointer = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => buildParticles(theme === 'light'), [theme]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 46 },
      uPixelRatio: { value: 1 },
      uRadius: { value: 1 },
      uCamDist: { value: CAM_DIST },
      uShimmer: { value: theme === 'dark' ? 0.3 : 0.12 },
    }),
    [theme]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const spin = spinRef.current;
    const tilt = tiltRef.current;
    const mat = matRef.current;
    if (!spin || !tilt || !mat) return;

    spin.rotation.y += ROT_Y * dt;
    spin.rotation.x += ROT_X * dt;

    eased.current.x += (pointer.current.x - eased.current.x) * 0.035;
    eased.current.y += (pointer.current.y - eased.current.y) * 0.035;

    tilt.rotation.y = -eased.current.x * MAX_TILT_Y;
    tilt.rotation.x = eased.current.y * MAX_TILT_X;

    const radius = viewport.width / 2;
    mat.uniforms.uRadius.value = radius;
    mat.uniforms.uPixelRatio.value = dpr || 1;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    tilt.position.x = viewport.width * 0.38;
    tilt.position.y = viewport.height * 0.08;
  });

  return (
    <group ref={tiltRef} position={[viewport.width * 0.38, viewport.height * 0.08, 0]}>
      <group ref={spinRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
            <bufferAttribute attach="attributes-aScale" args={[particles.scales, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[particles.phases, 1]} />
            <bufferAttribute attach="attributes-aAlpha" args={[particles.alphas, 1]} />
            <bufferAttribute attach="attributes-aColor" args={[particles.colors, 3]} />
          </bufferGeometry>
          <shaderMaterial
            ref={matRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            toneMapped={false}
            blending={theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </points>
      </group>
    </group>
  );
}

export function HeroSun() {
  const theme = useResolvedTheme();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute"
        style={{
          right: '-18vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '68vw',
          height: '68vw',
          background: `radial-gradient(circle, ${
            theme === 'dark'
              ? 'rgba(255, 190, 112, 0.10)'
              : 'rgba(240, 200, 130, 0.16)'
          } 0%, transparent 64%)`,
          filter: 'blur(70px)',
          opacity: 0.8,
          transition: 'background 800ms ease, opacity 800ms ease',
        }}
      />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, CAM_DIST], fov: 35 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <SunPoints theme={theme} />
      </Canvas>
    </div>
  );
}
