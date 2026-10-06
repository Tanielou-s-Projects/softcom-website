/**
 * The hero's "fog bank": a full-screen ordered dither that rises over the
 * scene and resolves into solid brand blue, with a cyan band along its front.
 *
 * Plain WebGL rather than Paper Shaders: those loop on their own clock, and
 * this has to be a pure function of scroll — the same progress always draws
 * the same frame, forwards or backwards. Coverage is an 8×8 Bayer threshold
 * against a rising field (bottom first, broken up by low-frequency noise), so
 * the dissolve reads as the site's own dot matrix rather than a crossfade.
 */

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAGMENT = `
precision mediump float;
uniform vec2 u_res;
uniform float u_prog;
uniform float u_cell;
uniform vec3 u_blue;
uniform vec3 u_cyan;

float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  vec2 uv = cell * u_cell / u_res;
  // Rises from the bottom edge; noise keeps the front from reading as a line.
  float field = uv.y * 0.75 + noise(cell * 0.06) * 0.35;
  const float spread = 0.35;
  float cover = clamp((u_prog * (1.1 + spread) - field) / spread, 0.0, 1.0);
  if (bayer8(cell) >= cover) {
    gl_FragColor = vec4(0.0);
    return;
  }
  gl_FragColor = vec4(cover < 0.5 ? u_cyan : u_blue, 1.0);
}
`

/** CSS pixels per dither cell — the grid the other dot-matrix pieces use. */
const CELL = 6

export type DitherDissolve = {
  /** 0 = nothing drawn, 1 = solid blue. */
  draw(progress: number): void
  resize(): void
  dispose(): void
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/** Returns null where WebGL is unavailable; the caller falls back to a fade. */
export function createDitherDissolve(
  canvas: HTMLCanvasElement
): DitherDissolve | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false })
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
  const uRes = u("u_res")
  const uProg = u("u_prog")
  const uCell = u("u_cell")
  // Brand anchors: #004bff and #00ffff.
  gl.uniform3f(u("u_blue"), 0, 75 / 255, 1)
  gl.uniform3f(u("u_cyan"), 0, 1, 1)

  let last = -1
  const ratio = () => Math.min(window.devicePixelRatio || 1, 2)

  const api: DitherDissolve = {
    resize() {
      const r = ratio()
      const width = Math.round(canvas.clientWidth * r)
      const height = Math.round(canvas.clientHeight * r)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
        gl.uniform2f(uRes, width, height)
        gl.uniform1f(uCell, CELL * r)
        last = -1
      }
    },
    draw(progress) {
      // Scroll-driven, so identical progress means an identical frame: skip it.
      if (progress === last) return
      last = progress
      gl.uniform1f(uProg, progress)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (progress > 0) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    dispose() {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    },
  }
  api.resize()
  return api
}
