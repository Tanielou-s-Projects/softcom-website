/**
 * A WebGL renderer that turns a video (or image) into coloured ASCII on a
 * curved CRT-style screen — the Alumni hero's engine.
 *
 * Every cell carries a glyph chosen by its (lifted) luminance and is tinted
 * with the source's own colour, so the picture reads through colour while the
 * glyphs give it texture; bright cells bloom. `tv` (1 → 0) bends the frame
 * into a bulging tube with a fisheye pull, relaxing to a flat rectangle as
 * the screen fills. `power` / `flash` drive a CRT switch-on: a bright line
 * that opens vertically into the picture. A pointer trail disturbs the cells
 * it passes over — displacement, chroma split and glyph noise.
 */

const VERTEX = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const TRAIL = 12

const FRAGMENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_src;
uniform sampler2D u_atlas;
uniform vec2 u_res;
uniform vec2 u_srcRes;
uniform float u_cell;
uniform float u_glyphs;
uniform float u_tv;
uniform float u_power;
uniform float u_flash;
uniform float u_time;
uniform vec3 u_focus;
uniform float u_trailN;
uniform vec3 u_trail[${TRAIL}];

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// Cover-fit the source into the screen, as object-fit: cover would, then
// zoom in on the subject (u_focus: x, y with y up, and zoom).
vec2 cover(vec2 uv) {
  float s = u_srcRes.x / u_srcRes.y;
  float d = u_res.x / u_res.y;
  if (d > s) uv.y = (uv.y - 0.5) * (s / d) + 0.5;
  else uv.x = (uv.x - 0.5) * (d / s) + 0.5;
  vec2 f = u_focus.xy;
  // Keep the zoomed window inside the frame.
  vec2 span = 0.5 / vec2(u_focus.z);
  vec2 lo = clamp(f - span, vec2(0.0), vec2(1.0) - 2.0 * span) + span;
  return clamp(lo + (uv - 0.5) / u_focus.z, 0.0, 1.0);
}

// Tone map for a high-contrast source (white sand, navy shirts, dark skin):
// pull every luminance into the mid band — highlights down, shadows up —
// keeping each pixel's hue, then lift saturation so the colour carries the
// picture. Without it the sand becomes a wall of dense glyphs and the people
// sink into black.
vec3 grade(vec3 c) {
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  float target = mix(0.3, 0.78, pow(l, 0.75));
  c *= target / max(l, 0.04);
  float g = dot(c, vec3(0.299, 0.587, 0.114));
  return clamp(mix(vec3(g), c, 1.3), 0.0, 1.0);
}

void main() {
  vec2 frag = v_uv * u_res;
  vec2 cell = floor(frag / u_cell);
  vec2 centre = (cell + 0.5) * u_cell / u_res;

  // Pointer trail: how disturbed this cell is, and which way it's pushed.
  float aspect = u_res.x / u_res.y;
  float influence = 0.0;
  vec2 push = vec2(0.0);
  for (int i = 0; i < ${TRAIL}; i++) {
    if (float(i) >= u_trailN) break;
    vec2 d = (centre - u_trail[i].xy) * vec2(aspect, 1.0);
    float m = (1.0 - smoothstep(0.03, 0.16, length(d))) * u_trail[i].z;
    influence += m;
    push += normalize(d + 0.0001) * m;
  }
  influence = clamp(influence, 0.0, 1.0);

  // Displace whole cells, so the disturbance stays on the grid.
  vec2 uv = centre + push * 0.05;
  uv = (floor(uv * u_res / u_cell) + 0.5) * u_cell / u_res;

  // Fisheye pull while the screen is still a tube.
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;
  p *= 1.0 + 0.26 * u_tv * dot(p, p) / (aspect * aspect);
  p.x /= aspect;
  uv = clamp(p * 0.5 + 0.5, 0.001, 0.999);

  vec2 s = cover(uv);
  float ch = 0.006 * influence;
  vec3 col = vec3(
    texture2D(u_src, s + vec2(ch, 0.0)).r,
    texture2D(u_src, s).g,
    texture2D(u_src, s - vec2(ch, 0.0)).b
  );
  col = grade(col);

  // Luminance, pushed bright so most cells carry dense glyphs and colour
  // does the picture-making; the trail adds flicker.
  // Already tone-mapped into the mid band: a gentle lift so most cells
  // carry dense glyphs and colour does the picture-making.
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  l = clamp(l * 1.05 + 0.12, 0.0, 1.0);
  l = clamp(l + (hash(cell + floor(u_time * 40.0)) - 0.5) * 0.8 * influence, 0.0, 1.0);
  float gi = floor((1.0 - l) * (u_glyphs - 1.0) + 0.5);
  vec2 local = (fract(frag / u_cell) - 0.5) / 1.3 + 0.5;
  float glyph = texture2D(u_atlas, vec2((gi + local.x) / u_glyphs, local.y)).r;
  vec3 outc = col * glyph;

  // Bloom from the bright neighbourhood.
  vec2 o = 2.0 * u_cell / u_res;
  vec3 blur = (
    texture2D(u_src, cover(uv + vec2(o.x, 0.0))).rgb +
    texture2D(u_src, cover(uv - vec2(o.x, 0.0))).rgb +
    texture2D(u_src, cover(uv + vec2(0.0, o.y))).rgb +
    texture2D(u_src, cover(uv - vec2(0.0, o.y))).rgb
  ) * 0.25;
  float bright = max(max(blur.r, blur.g), blur.b);
  outc += blur * smoothstep(0.62, 1.0, bright) * 0.55;

  // The tube: edges bow out (more top and bottom), flattening as tv → 0.
  vec2 q = v_uv * 2.0 - 1.0;
  vec2 size = mix(vec2(1.0), vec2(0.94, 0.82), u_tv);
  float xn = clamp(q.x / size.x, -1.0, 1.0);
  float yn = clamp(q.y / size.y, -1.0, 1.0);
  float w = size.x + 0.035 * u_tv * (1.0 - yn * yn);
  float h = size.y + 0.15 * u_tv * (1.0 - xn * xn);
  vec2 e = abs(q) - vec2(w, h);
  float edge = u_cell * 1.6 / min(u_res.x, u_res.y);
  float tube = 1.0 - smoothstep(0.0, edge, max(e.x, e.y));

  // Switch-on: a line that opens vertically, with a cyan-white flare.
  float aperture = mix(0.002, 1.0, u_power);
  float open = 1.0 - smoothstep(aperture, aperture + edge, abs(v_uv.y - 0.5) * 2.0);
  float flare = (
    exp(-abs(v_uv.y - 0.5) / (0.012 + u_flash * 0.06)) * 1.2 +
    exp(-length((v_uv - 0.5) * vec2(1.8, 1.0)) / (0.03 + u_flash * 0.12))
  ) * u_flash;

  vec3 lit = outc * open + vec3(0.75, 1.0, 1.0) * flare;
  float alpha = clamp(tube * max(open, flare * 0.5), 0.0, 1.0);
  gl_FragColor = vec4(clamp(lit, 0.0, 1.0) * alpha, alpha);
}
`

/** Dense to sparse — index 0 is the brightest cell's glyph. */
const RAMP = "@#W$%0981x?+=;:-,. "

function glyphAtlas(font: string, size = 48) {
  const canvas = document.createElement("canvas")
  canvas.width = RAMP.length * size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.font = `700 ${Math.floor(size * 0.8)}px ${font}`
  ;[...RAMP].forEach((char, i) =>
    ctx.fillText(char, i * size + size / 2, size * 0.54)
  )
  return canvas
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Never fail silently: the caller falls back to the poster image.
    if (process.env.NODE_ENV !== "production")
      console.error("ascii-screen shader:", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export type ScreenState = {
  tv: number
  power: number
  flash: number
  time: number
  /** Pointer trail, newest first: [x, y (0–1, y up), strength]. */
  trail: [number, number, number][]
}

export type AsciiScreen = {
  /** Upload the current frame of the source (call when it changes). */
  upload(source: TexImageSource, width: number, height: number): void
  draw(state: ScreenState): void
  resize(): void
  dispose(): void
}

/** Null where WebGL is unavailable; the caller shows the poster instead. */
export function createAsciiScreen(
  canvas: HTMLCanvasElement,
  {
    cell = 5,
    font = "ui-monospace, monospace",
    focus = { x: 0.5, y: 0.5, zoom: 1 },
  }: {
    cell?: number
    font?: string
    /** Where the subject sits in the source (x, y from the top) and zoom. */
    focus?: { x: number; y: number; zoom: number }
  } = {}
): AsciiScreen | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  })
  if (!gl) return null

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  )
  const position = gl.getAttribLocation(program, "a_pos")
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const u = (name: string) => gl.getUniformLocation(program, name)
  const texture = (unit: number) => {
    const t = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    return t
  }

  // Both textures flipped so v runs bottom-up, matching gl_FragCoord.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  const srcTexture = texture(0)
  gl.uniform1i(u("u_src"), 0)
  const atlasTexture = texture(1)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    glyphAtlas(font)
  )
  gl.uniform1i(u("u_atlas"), 1)
  gl.uniform1f(u("u_glyphs"), RAMP.length)

  const uRes = u("u_res")
  const uSrcRes = u("u_srcRes")
  const uCell = u("u_cell")
  const uTv = u("u_tv")
  const uPower = u("u_power")
  const uFlash = u("u_flash")
  const uTime = u("u_time")
  const uFocus = u("u_focus")
  gl.uniform3f(uFocus, focus.x, 1 - focus.y, focus.zoom)
  const uTrailN = u("u_trailN")
  const uTrail = u("u_trail")
  const trailData = new Float32Array(TRAIL * 3)

  const api: AsciiScreen = {
    upload(source, width, height) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, srcTexture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
      )
      gl.uniform2f(uSrcRes, width, height)
    },
    resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const h = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uCell, cell * ratio)
    },
    draw(state) {
      gl.uniform1f(uTv, state.tv)
      gl.uniform1f(uPower, state.power)
      gl.uniform1f(uFlash, state.flash)
      gl.uniform1f(uTime, state.time)
      const n = Math.min(TRAIL, state.trail.length)
      trailData.fill(0)
      for (let i = 0; i < n; i++) trailData.set(state.trail[i], i * 3)
      gl.uniform1f(uTrailN, n)
      gl.uniform3fv(uTrail, trailData)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    dispose() {
      gl.deleteTexture(srcTexture)
      gl.deleteTexture(atlasTexture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    },
  }
  api.resize()
  return api
}
