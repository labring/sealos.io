'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useHomeTheme } from './theme';

export type WatercolorImage = 'hero' | 'a' | 'b';

const IMAGE_SRC: Record<WatercolorImage, string> = {
  hero: '/images/desktop-home/watercolor-hero.webp',
  a: '/images/desktop-home/watercolor-a.webp',
  b: '/images/desktop-home/watercolor-b.webp',
};

interface AsciiWatercolorProps {
  image: WatercolorImage;
  /** Run the shader. Off renders one still frame. */
  animated?: boolean;
  /** Glyphs brighten and shuffle around the pointer. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const VERTEX = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// The watercolor is drawn softened, then a grid of glyph cells
// (dot, plus, cross, block) dithers the bright cloud edges. A slow
// domain warp makes the clouds drift, so the glyphs re-pick as they flow.
const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform vec2 u_img;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_cell;
uniform float u_dark;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

vec2 coverUv(vec2 frag) {
  vec2 uv = frag / u_res;
  uv.y = 1.0 - uv.y;
  float screenAspect = u_res.x / u_res.y;
  float imgAspect = u_img.x / u_img.y;
  vec2 scale = screenAspect > imgAspect
    ? vec2(1.0, imgAspect / screenAspect)
    : vec2(screenAspect / imgAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

vec2 warp(vec2 uv, float t) {
  return uv + vec2(
    0.010 * sin(uv.y * 7.0 + t * 0.22) + 0.006 * sin(uv.y * 17.0 - t * 0.31),
    0.006 * cos(uv.x * 5.0 + t * 0.17)
  );
}

float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

vec3 setLum(vec3 c, float l) {
  vec3 d = c + (l - lum(c));
  float L = lum(d);
  float n = min(min(d.r, d.g), d.b);
  float x = max(max(d.r, d.g), d.b);
  if (n < 0.0) d = L + (d - L) * L / (L - n);
  if (x > 1.0) d = L + (d - L) * (1.0 - L) / (x - L);
  return d;
}

float glyph(vec2 p, float kind, float aa) {
  vec2 q = abs(p - 0.5);
  if (kind < 0.5) return 0.0;
  if (kind < 1.5) return 1.0 - smoothstep(0.11 - aa, 0.11 + aa, length(p - 0.5));
  if (kind < 2.5) {
    float bar = 0.085;
    float arm = 0.30;
    float h = step(q.y, bar) * step(q.x, arm);
    float v = step(q.x, bar) * step(q.y, arm);
    return max(h, v);
  }
  if (kind < 3.5) {
    float d = abs(q.x - q.y);
    return step(d, 0.075) * step(max(q.x, q.y), 0.24);
  }
  return step(max(q.x, q.y), 0.22);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  float t = u_time;

  vec2 uv = warp(coverUv(frag), t);
  vec3 base = textureLod(u_tex, uv, 2.2).rgb;
  vec3 tint = vec3(0.0, 0.17, 0.53);
  base = mix(base, setLum(base, lum(tint)), 0.24);

  vec2 cell = floor(frag / u_cell);
  vec2 center = (cell + 0.5) * u_cell;
  vec2 cuv = warp(coverUv(center), t);
  float near = lum(textureLod(u_tex, cuv, 3.5).rgb);
  float wide = lum(textureLod(u_tex, cuv, 6.5).rgb);

  // Crests: brighter than their surroundings, so only foam and cloud
  // edges dissolve into glyphs, never the flat body of the wash.
  float drift = noise(cell * 0.06 + vec2(t * 0.06, -t * 0.035));
  float crest = (near - wide) + (drift - 0.5) * 0.035;
  float edge = smoothstep(0.012, 0.06, crest) * smoothstep(0.72, 0.86, near);

  float field = noise(cell * 0.045 + vec2(-t * 0.025, t * 0.018));
  float cluster = smoothstep(0.80, 0.93, field) * (1.0 - edge);
  float h = hash(cell);
  float sparkle = step(1.0 - cluster * 0.75, h);

  float twinkle = 0.5 + 0.5 * sin(t * (0.7 + h * 1.6) + h * 6.2831);

  float pointer = 0.0;
  if (u_mouse.x >= 0.0) {
    float d = length(center - u_mouse) / (130.0 * u_cell / 7.0);
    pointer = 1.0 - smoothstep(0.0, 1.0, d);
  }

  float intensity = max(edge * (0.6 + 0.4 * twinkle), sparkle * (0.35 + 0.65 * twinkle));
  intensity += pointer * pointer * 0.7 * step(0.35, hash(cell + floor(t * 5.0)));
  intensity = clamp(intensity, 0.0, 1.0);

  float kind = 0.0;
  if (intensity > 0.16) kind = 1.0;
  if (intensity > 0.42) kind = 2.0;
  if (intensity > 0.70) kind = h > 0.72 ? 3.0 : 2.0;
  if (intensity > 0.90) kind = 4.0;

  vec2 local = (frag - cell * u_cell) / u_cell;
  float aa = 1.0 / u_cell;
  float g = glyph(local, kind, aa);

  vec3 ink = vec3(0.97, 0.98, 1.0);
  vec3 color = base;
  if (u_dark > 0.5) {
    color = mix(vec3(0.035, 0.05, 0.11), base * vec3(0.42, 0.5, 0.78), 0.62);
    ink = vec3(0.78, 0.86, 1.0);
  }
  color = mix(color, ink, g * (0.5 + 0.5 * intensity));
  outColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[ascii-watercolor]', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AsciiWatercolor({
  image,
  animated = true,
  interactive = false,
  className,
  style,
  children,
}: AsciiWatercolorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolved } = useHomeTheme();
  const darkRef = useRef(resolved === 'dark' ? 1 : 0);
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    darkRef.current = resolved === 'dark' ? 1 : 0;
    redrawRef.current?.();
  }, [resolved]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    // Nothing is created until the panel is about to scroll into view.
    const start = (): (() => void) | undefined => {
      const gl = canvas.getContext('webgl2', {
        antialias: false,
        alpha: false,
        powerPreference: 'low-power',
        preserveDrawingBuffer: false,
      });
      if (!gl) return;

      const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      if (!vs || !fs) return;
      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const aPos = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const u = {
        res: gl.getUniformLocation(program, 'u_res'),
        img: gl.getUniformLocation(program, 'u_img'),
        time: gl.getUniformLocation(program, 'u_time'),
        mouse: gl.getUniformLocation(program, 'u_mouse'),
        cell: gl.getUniformLocation(program, 'u_cell'),
        dark: gl.getUniformLocation(program, 'u_dark'),
      };

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const shouldAnimate = animated && !reduceMotion;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      let texReady = false;
      let imgSize = { w: 1, h: 1 };
      let visible = false;
      let raf = 0;
      let disposed = false;
      // Starts on a settled frame; advances only while the panel is on screen.
      let clock = 18;
      let last = 0;
      const mouse = { x: -1, y: -1 };

      const resize = () => {
        const rect = root.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        gl.viewport(0, 0, w, h);
      };

      const draw = (time: number) => {
        if (!texReady || disposed) return;
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform2f(u.img, imgSize.w, imgSize.h);
        gl.uniform1f(u.time, time);
        gl.uniform2f(
          u.mouse,
          mouse.x < 0 ? -1 : mouse.x * dpr,
          mouse.y < 0 ? -1 : mouse.y * dpr,
        );
        gl.uniform1f(u.cell, Math.round(7 * dpr));
        gl.uniform1f(u.dark, darkRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const loop = () => {
        raf = 0;
        if (!visible || document.hidden || disposed) {
          last = 0;
          return;
        }
        const now = performance.now();
        if (last) clock += Math.min((now - last) / 1000, 0.1);
        last = now;
        draw(clock);
        raf = requestAnimationFrame(loop);
      };

      const kick = () => {
        if (shouldAnimate) {
          if (!raf && visible && !document.hidden) {
            raf = requestAnimationFrame(loop);
          }
        } else {
          draw(clock);
        }
      };

      redrawRef.current = () => draw(clock);

      const texture = gl.createTexture();
      const img = new Image();
      img.decoding = 'async';
      img.src = IMAGE_SRC[image];
      img.onload = () => {
        if (disposed) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img,
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        imgSize = { w: img.naturalWidth, h: img.naturalHeight };
        texReady = true;
        resize();
        draw(clock);
        root.dataset.shader = 'ready';
        kick();
      };

      const ro = new ResizeObserver(() => {
        resize();
        if (!raf) draw(clock);
      });
      ro.observe(root);

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) kick();
        },
        { rootMargin: '120px' },
      );
      io.observe(root);

      const onVisibility = () => kick();
      document.addEventListener('visibilitychange', onVisibility);

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      };
      const onLeave = () => {
        mouse.x = -1;
        mouse.y = -1;
      };
      if (interactive && shouldAnimate) {
        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);
      }

      return () => {
        disposed = true;
        redrawRef.current = null;
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerleave', onLeave);
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    };

    let stop: (() => void) | undefined;
    const gate = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || stop) return;
        gate.disconnect();
        stop = start();
      },
      { rootMargin: '400px 0px' },
    );
    gate.observe(root);
    return () => {
      gate.disconnect();
      stop?.();
    };
  }, [animated, image, interactive]);

  return (
    <div
      ref={rootRef}
      className={cn('sx-watercolor', className)}
      data-image={image}
      style={style}
    >
      <canvas ref={canvasRef} className="sx-watercolor-canvas" aria-hidden />
      {children}
    </div>
  );
}
