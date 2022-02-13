import { Mesh } from '../mesh'

type RendererProps = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
}

type Renderer = {
  gl: WebGL2RenderingContext;
  resize: (width: number, height: number) => void;
  render: (meshes: Mesh[]) => void;
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

  return {
    gl,
    resize,
    render: (meshes: Mesh[]) => render(gl, meshes),
  }
}

const setSize = (gl: WebGL2RenderingContext, width: number, height: number) => {
  gl.canvas.width = width
  gl.canvas.height = height
}

const render = (_gl: WebGL2RenderingContext, meshes: Mesh[]) => {
  meshes.forEach((mesh) => mesh.render())
}
