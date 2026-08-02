'use client';

import { useEffect, useRef, useState } from 'react';

const DIAMETER = 32;
const RADIUS = DIAMETER / 2;
const SCALE = 1.2;
const LERP = 0.18;
const ZOOM_OVER = 1.6;
const ZOOM_LERP = 0.1;
const CAPTURE_MS = 150;

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D u_tex;
uniform vec2 uCursor;
uniform vec2 uRes;
uniform float uRadius;
uniform float uScale;
uniform int uReady;
varying vec2 v_uv;

void main(){
  if(uReady==0){ gl_FragColor=vec4(0); return; }

  vec2 cuv = uCursor / uRes;
  vec2 uv  = vec2(v_uv.x, 1.0 - v_uv.y);
  vec2 d   = uv - cuv;
  float dist = length(d);
  float rUV = uRadius / uRes.y;
  float aa  = 1.5 / uRes.y;

  float mask = 1.0 - smoothstep(rUV - aa, rUV + aa, dist);
  if(mask < 0.001){ gl_FragColor=vec4(0); return; }

  vec2 dir = dist > 0.0001 ? d / dist : vec2(0,1);
  vec2 sampleUV = cuv + dir * (dist / uScale);

  vec3 col = texture2D(u_tex, sampleUV).rgb;
  col *= 1.05;

  float t = dist / rUV;
  float rim = smoothstep(0.85, 1.0, t);
  col = mix(col, vec3(0.94,0.96,0.99), rim * 0.22);

  vec2 hl = vec2(-0.24,-0.20) * rUV;
  float h = smoothstep(rUV*0.13, 0.0, length(d - hl));
  col += vec3(0.14) * h;

  float alpha = mask;
  alpha = max(alpha, rim * 0.28);
  alpha = max(alpha, smoothstep(rUV - aa*0.5, rUV, t) * 0.40);

  gl_FragColor = vec4(col, alpha);
}`;

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
  });
  if (!gl) return null;

  function mkShader(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
      console.error(gl!.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = mkShader(gl.VERTEX_SHADER, VERT)!;
  const fs = mkShader(gl.FRAGMENT_SHADER, FRAG)!;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  gl.useProgram(prog);

  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0,0,0,0]));

  const u = {
    tex:    gl.getUniformLocation(prog, 'u_tex'),
    cursor: gl.getUniformLocation(prog, 'uCursor'),
    res:    gl.getUniformLocation(prog, 'uRes'),
    radius: gl.getUniformLocation(prog, 'uRadius'),
    scale:  gl.getUniformLocation(prog, 'uScale'),
    ready:  gl.getUniformLocation(prog, 'uReady'),
  };
  gl.uniform1i(u.tex, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let ready = false;

  return {
    gl,
    upload(source: TexImageSource) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        ready = true;
      } catch { /* tainted – skip */ }
    },
    draw(cx: number, cy: number, w: number, h: number, zoom: number) {
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(u.cursor, cx, cy);
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.radius, RADIUS * (1 + (zoom - 1) * 0.28));
      gl.uniform1f(u.scale, SCALE * zoom);
      gl.uniform1i(u.ready, ready ? 1 : 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}

export function CustomCursor() {
  const [coarse, setCoarse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setCoarse(true);
      return;
    }

    const dot = ref.current;
    if (!dot) return;
    const cursor = dot;

    // --- WebGL canvas (magnifier overlay) ---
    const glCanvas = document.createElement('canvas');
    glCanvas.setAttribute('data-html2canvas-ignore', 'true');
    glCanvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;opacity:0;transition:opacity .4s';
    document.body.appendChild(glCanvas);
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;

    const glCtx = initGL(glCanvas);

    // --- Mouse state ---
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let targetZoom = 1;
    let zoom = 1;

    function onMove(e: PointerEvent) { mx = e.clientX; my = e.clientY; }

    function onOver(e: MouseEvent) {
      const interactive = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, select, textarea'
      );
      targetZoom = interactive ? ZOOM_OVER : 1;
    }

    // --- Capture loop (throttled html2canvas) ---
    let html2canvasFn: typeof import('html2canvas')['default'] | null = null;
    let capturing = false;

    import('html2canvas').then((m) => { html2canvasFn = m.default ?? m; });

    function capture() {
      if (!html2canvasFn || capturing) return;
      capturing = true;
      glCanvas.style.visibility = 'hidden';

      html2canvasFn(document.body, {
        x: 0, y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      }).then((c: HTMLCanvasElement) => {
        glCtx?.upload(c);
      }).catch(() => {}).finally(() => {
        glCanvas.style.visibility = 'visible';
        capturing = false;
      });
    }

    // --- Animation loop ---
    let raf = 0;
    function tick() {
      cx += (mx - cx) * LERP;
      cy += (my - cy) * LERP;
      zoom += (targetZoom - zoom) * ZOOM_LERP;

      cursor.style.transform =
        `translate3d(${cx - DIAMETER / 2}px, ${cy - DIAMETER / 2}px, 0) scale(${1 + (zoom - 1) * 0.3})`;

      glCtx?.draw(cx, cy, glCanvas.width, glCanvas.height, zoom);

      raf = requestAnimationFrame(tick);
    }

    // --- Start ---
    const t1 = setTimeout(() => {
      cursor.style.opacity = '1';
      glCanvas.style.opacity = '1';
      raf = requestAnimationFrame(tick);
      capture();
    }, 60);

    const t2 = setInterval(capture, CAPTURE_MS);

    window.addEventListener('resize', () => {
      glCanvas.width = window.innerWidth;
      glCanvas.height = window.innerHeight;
    }, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    // --- Cleanup ---
    return () => {
      clearTimeout(t1);
      clearInterval(t2);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      glCtx?.destroy();
      glCanvas.remove();
    };
  }, []);

  if (coarse) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0"
      style={{
        width: DIAMETER,
        height: DIAMETER,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.20)',
        background:
          'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}
