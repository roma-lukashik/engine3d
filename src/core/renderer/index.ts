import { Mesh } from '../mesh'
import { Camera } from '../camera'
import { Lighting } from '../lightings/point'
import * as m4 from '../../math/matrix4'

type RendererOptions = {
  canvas?: HTMLCanvasElement;
  width: number;
  height: number;
}

type Renderer = {
  readonly gl: WebGLRenderingContext;
  resize: (width: number, height: number) => void;
  render: (meshes: Mesh[], camera: Camera, lighting: Lighting) => void;
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

  private readonly biasMatrix: m4.Matrix4 = m4.scale(m4.translation(0.5, 0.5, 0.5), 0.5, 0.5, 0.5)

  constructor({
    canvas,
    width,
    height,
  }: Required<RendererOptions>) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      throw new Error('Unable to create WebGL context')
    }

    this.gl = gl
    this.resize(width, height)
    this.gl.clearColor(0, 0, 0, 1)
  }

  public render(meshes: Mesh[], camera: Camera, lighting: Lighting): void {
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    const textureMatrix = m4.multiply(this.biasMatrix, lighting.projectionMatrix)
    meshes.forEach((mesh) => mesh.render(camera, lighting, textureMatrix))
  }

  public resize(width: number, height: number): void {
    this.gl.canvas.width = width
    this.gl.canvas.height = height
    this.gl.viewport(0, 0, width, height)
  }
}
