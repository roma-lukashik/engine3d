import { WebGLMesh } from '../mesh'
import { WebGLDepthTexture } from '../textures/depth'
import { LightWithShadow } from '../../core/lights'
import { Mesh } from '../../core/mesh'
import { createShadowProgram, ShadowProgram } from '../program/shadow'

type Props = {
  gl: WebGLRenderingContext
}

export class Shadow {
  private readonly gl: WebGLRenderingContext
  private readonly program: ShadowProgram

  public readonly depthTexture: WebGLDepthTexture

  constructor({ gl }: Props) {
    this.gl = gl
    this.program = createShadowProgram({ gl })
    this.depthTexture = new WebGLDepthTexture({ gl })
  }

  public render(lights: LightWithShadow[], meshes: Map<Mesh, WebGLMesh>): void {
    this.gl.depthMask(true)
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depthTexture.buffer)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    const width = this.depthTexture.width / lights.length

    lights.forEach((light, i) => {
      this.gl.viewport(width * i, 0, width, this.depthTexture.height)
      this.program.uniforms.setValues({ projectionMatrix: light.projectionMatrix })
      meshes.forEach((mesh) => mesh.render(this.program))
    })
  }
}
