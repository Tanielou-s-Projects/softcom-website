import {
  BLUE,
  CELL,
  CYAN,
  GLSL_DITHER,
  GLSL_GLYPH,
  GLYPH_MIN,
  GLYPH_STREAM,
} from "@/lib/dither"
import { glyphAtlas } from "@/components/motion/dither-glyphs"

/**
 * A full-bleed canvas that draws the site's dither (see `lib/dither.ts`):
 * brand blue rising from the bottom in Bayer order, cyan along its front.
 *
 * Plain WebGL rather than Paper Shaders: those loop on their own clock, and
 * this has to be a pure function of progress — the same value always draws
 * the same frame, forwards or backwards — so scroll, a timer or any other
 * driver can own it.
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
uniform sampler2D u_atlas;
uniform float u_glyphs;
uniform float u_gcell;
${GLSL_DITHER}
${GLSL_GLYPH}
void main() {
  // The tech layer, decided at glyph resolution so characters stay whole:
  // a glyph cell sitting in the front band shows its data glyph.
  vec2 g = floor(gl_FragCoord.xy / u_gcell);
  vec2 gc = (g + 0.5) * u_gcell / u_cell;
  float gcover = ditherCoverage(u_prog, ditherField(floor(gc), gc.y * u_cell / u_res.y));
  if (gcover > 0.0 && gcover < FRONT && bayer8(g) < gcover) {
    vec2 local = fract(gl_FragCoord.xy / u_gcell);
    float index = glyphIndex(g, u_glyphs);
    vec2 uv = vec2((index + local.x) / u_glyphs, 1.0 - local.y);
    float ink = texture2D(u_atlas, uv).a;
    gl_FragColor = ink > 0.5 ? vec4(u_cyan, 1.0) : vec4(0.0);
    return;
  }

  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  float cover = ditherCoverage(u_prog, ditherField(cell, cell.y * u_cell / u_res.y));
  if (bayer8(cell) >= cover) {
    gl_FragColor = vec4(0.0);
    return;
  }
  gl_FragColor = vec4(cover < FRONT ? u_cyan : u_blue, 1.0);
}
`

export type DitherField = {
  /** 0 = nothing drawn, 1 = solid blue. */
  draw(progress: number): void
  resize(): void
  /** Frees the GPU context too — effects that mount per use must call it. */
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

/**
 * Returns null where WebGL is unavailable; callers fall back to a fade.
 * `scale` multiplies the 6px base cell — coarser effects stay on the grid.
 */
export function createDitherField(
  canvas: HTMLCanvasElement,
  { scale = 1 }: { scale?: number } = {}
): DitherField | null {
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
  gl.uniform3f(u("u_blue"), ...BLUE)
  gl.uniform3f(u("u_cyan"), ...CYAN)

  // One-row atlas of the glyph stream (non-power-of-two: clamp, no mips).
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    glyphAtlas()
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.uniform1i(u("u_atlas"), 0)
  gl.uniform1f(u("u_glyphs"), GLYPH_STREAM.length)
  const uGcell = u("u_gcell")

  let last = -1
  const ratio = () => Math.min(window.devicePixelRatio || 1, 2)

  const api: DitherField = {
    resize() {
      const r = ratio()
      const width = Math.round(canvas.clientWidth * r)
      const height = Math.round(canvas.clientHeight * r)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
        gl.uniform2f(uRes, width, height)
        gl.uniform1f(uCell, CELL * scale * r)
        gl.uniform1f(uGcell, Math.max(CELL * scale, GLYPH_MIN) * r)
        last = -1
      }
    },
    draw(progress) {
      // A pure function of progress: an unchanged value is an unchanged frame.
      if (progress === last) return
      last = progress
      gl.uniform1f(uProg, progress)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (progress > 0) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    dispose() {
      gl.deleteBuffer(buffer)
      gl.deleteTexture(texture)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    },
  }
  api.resize()
  return api
}
