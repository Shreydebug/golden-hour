'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 420;
const PARALLAX = 0.02;
const PARALLAX_DEFINE = `#define PARALLAX ${PARALLAX.toFixed(2)}\n`;

const pointerState = { x: 0, y: 0 };

const auroraVertexShader = `${PARALLAX_DEFINE}
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `${PARALLAX_DEFINE}
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p = p * 2.02 + vec3(11.3, 7.1, 3.7);
      a *= 0.5;
    }
    return v;
  }

  vec3 auroraCurtain(
    vec2 q, vec2 mp, float t,
    float freq, float speed, float warp, float amp,
    vec3 cLow, vec3 cMid, vec3 cHigh
  ) {
    vec2 p = q + mp;

    float w1 = fbm(vec3(p.x * freq, p.y * freq * 0.9, t * speed));
    float w2 = fbm(vec3(p.x * freq * 1.8 + w1 * 1.1, p.y * freq * 0.7 - w1 * 0.5, t * speed * 0.9 + 7.3));
    float n = fbm(vec3(p.x * freq * 1.6 + w2 * warp, p.y * freq * 0.55 + w1 * warp * 0.6, t * speed * 1.2 + 3.1));
    float c = smoothstep(-0.55, 0.55, n);

    float h = clamp(q.y * 1.6 - 0.35, 0.0, 1.0);
    vec3 col = mix(cLow, cMid, smoothstep(0.0, 0.5, h));
    col = mix(col, cHigh, smoothstep(0.5, 1.0, h));

    float flick = 1.0 + 0.05 * snoise(vec3(p.x * 4.0, p.y * 4.0, t * 0.04));

    return col * amp * c * flick;
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 q = vec2(vUv.x * aspect, vUv.y);
    float t = uTime;
    vec2 mp = uMouse * PARALLAX;

    vec3 bg = mix(
      vec3(0.014, 0.022, 0.05),
      vec3(0.038, 0.054, 0.115),
      smoothstep(0.0, 1.0, vUv.y)
    );
    bg += vec3(0.025, 0.035, 0.095) * smoothstep(0.3, 0.85, vUv.y);

    float sky = smoothstep(0.2, 0.42, vUv.y);
    float bandA = exp(-pow((vUv.y - 0.72) / 0.3, 2.0));
    float band = exp(-pow((vUv.y - 0.68) / 0.16, 2.0));
    float envA = sky * bandA;
    float env = sky * band;

    vec3 indigo = vec3(0.13, 0.15, 0.3);
    vec3 violet = vec3(0.24, 0.21, 0.42);
    vec3 navy = vec3(0.07, 0.11, 0.22);
    vec3 teal = vec3(0.16, 0.5, 0.52);
    vec3 cyan = vec3(0.2, 0.62, 0.72);
    vec3 emerald = vec3(0.1, 0.38, 0.34);
    vec3 coolWhite = vec3(0.75, 0.92, 1.0);

    vec3 layerA = auroraCurtain(q, mp, t, 1.3, 0.004, 1.2, 0.32, navy, indigo, violet);
    vec3 layerB = auroraCurtain(q, mp, t, 1.9, 0.013, 2.0, 0.5, teal, cyan, emerald);
    vec3 layerC = auroraCurtain(q, mp, t, 3.2, 0.02, 1.6, 0.24, coolWhite, cyan, teal);

    vec3 col = bg;
    col += layerA * envA;
    col += (layerB + layerC) * env;

    float vignette = 1.0 - 0.15 * smoothstep(0.55, 1.05, length(vUv - 0.5) * 1.15);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const starVertexShader = `${PARALLAX_DEFINE}
  uniform float uTime;
  uniform vec2 uMouse;

  attribute float aScale;
  attribute float aBrightness;
  attribute float aTwinkle;
  attribute float aPhase;

  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.xy += uMouse * PARALLAX;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * 2.0;

    float tw = 0.72 + 0.28 * sin(uTime * aTwinkle + aPhase * 6.2831);
    vAlpha = aBrightness * tw;
  }
`;

const starFragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float disc = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vec3(0.85, 0.9, 1.0), vAlpha * disc);
  }
`;

function buildStars() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const scales = new Float32Array(STAR_COUNT);
  const brightness = new Float32Array(STAR_COUNT);
  const twinkles = new Float32Array(STAR_COUNT);
  const phases = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() * 2 - 1) * 1.05;
    positions[i * 3 + 1] = Math.random() * 1.15 - 0.15;
    positions[i * 3 + 2] = 0;

    scales[i] = 0.6 + Math.random() * 1.8;
    brightness[i] = 0.3 + Math.random() * 0.6;
    twinkles[i] = 0.05 + Math.random() * 0.35;
    phases[i] = Math.random();
  }

  return { positions, scales, brightness, twinkles, phases };
}

function StarField() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const stars = useMemo(() => buildStars(), []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMouse.value.set(pointerState.x, pointerState.y);
  });

  return (
    <points frustumCulled={false} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[stars.scales, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[stars.brightness, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[stars.twinkles, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[stars.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        transparent
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AuroraCurtains() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const size = useThree((s) => s.size);

  const eased = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerState.x = e.clientX / window.innerWidth - 0.5;
      pointerState.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

    eased.current.x += (pointerState.x - eased.current.x) * 0.035;
    eased.current.y += (pointerState.y - eased.current.y) * 0.035;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uMouse.value.set(eased.current.x, eased.current.y);
  });

  return (
    <mesh frustumCulled={false} renderOrder={0}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HeroAurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#060b1a', 1)}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <StarField />
        <AuroraCurtains />
      </Canvas>
    </div>
  );
}
