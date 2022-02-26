import { Mesh } from '../mesh'
import { Camera } from '../camera'
import { Lighting } from '../lightings/point'
import { Program } from '../program'
import * as m4 from '../../math/matrix4'

type RendererOptions = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
}

type Renderer = {
  readonly gl: WebGLRenderingContext;
  resize: (width: number, height: number) => void;
  render: (program: Program, meshes: Mesh[], camera: Camera, lighting: Lighting) => void;
}

export const createRenderer = ({
  canvas = document.createElement('canvas'),
  width,
  height,
}: RendererOptions): Renderer => {
  return new RendererImpl({ canvas, width, height })
}

class RendererImpl implements Renderer {
  public readonly gl: WebGLRenderingContext

  constructor({
    canvas,
    width,
    height,
  }: Required<RendererOptions>) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      throw new Error('Unable to create WebGL context')
    }

    const ext = gl.getExtension('WEBGL_depth_texture')
    if (!ext) {
      throw new Error('Unable to get WEBGL_depth_texture extension')
    }

    this.gl = gl
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(program: Program, meshes: Mesh[], camera: Camera, lighting: Lighting): void {
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    let textureMatrix = m4.translate(m4.identity(), 0.5, 0.5, 0.5)
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5)
    textureMatrix = m4.multiply(textureMatrix, lighting.projectionMatrix)

    meshes.forEach((mesh) => mesh.render(program, camera, lighting, textureMatrix))
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
