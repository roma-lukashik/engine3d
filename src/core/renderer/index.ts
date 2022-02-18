import { Mesh } from '../mesh'
import { Program } from '../program'

type RendererProps = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
}

type Renderer = {
  gl: WebGL2RenderingContext;
  resize: (width: number, height: number) => void;
  render: (program: Program, meshes: Mesh[]) => void;
}

export const createRenderer = ({
  canvas = document.createElement('canvas'),
  width,
  height,
}: RendererProps): Renderer => {
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    throw new Error('Unable to create WebGL context')
  }

  const resize = (w: number, h: number) => setSize(gl, w, h)
  resize(width, height)

  gl.clearColor(1, 1, 1, 1)
  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  return {
    gl,
    resize,
    render: (program: Program, meshes: Mesh[]) => render(program, meshes),
  }
}

const setSize = (gl: WebGL2RenderingContext, width: number, height: number) => {
  gl.canvas.width = width
  gl.canvas.height = height
  gl.viewport(0, 0, width, height)
}

const render = (program: Program, meshes: Mesh[]) => {
  meshes.forEach((mesh) => mesh.render(program))
}
