type RendererProps = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
}

export const renderer = ({
  canvas = document.createElement('canvas'),
  width,
  height,
}: RendererProps): WebGL2RenderingContext => {
  const gl = canvas.getContext('webgl2')
  if (!gl) {
    return new Error('Unable to create WebGL context') as never
  }
  setSize(gl, width, height)
  return gl
}

const setSize = (gl: WebGL2RenderingContext, width: number, height: number) => {
  gl.canvas.width = width
  gl.canvas.height = height
}
