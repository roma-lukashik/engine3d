import { WebGLMesh } from "@webgl/mesh"
import { WebGLDepthTexture } from "@webgl/textures/depth"
import { ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"

type Props = {
  gl: WebGLRenderingContext
  light: LightWithShadow
}

export class Shadow {
  private readonly gl: WebGLRenderingContext
  private readonly program: ShadowProgram
  private readonly light: LightWithShadow

  public depthTexture: WebGLDepthTexture

  constructor({ gl, light }: Props) {
    this.gl = gl
    this.light = light
    this.program = new ShadowProgram({ gl })
    this.depthTexture = new WebGLDepthTexture({ gl })
  }

  public render(meshes: Map<Mesh, WebGLMesh>): void {
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.depthTexture.frameBuffer)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.viewport(0, 0, this.depthTexture.width, this.depthTexture.height)
    this.program.uniforms.setValues({ projectionMatrix: this.light.projectionMatrix })
    meshes.forEach((mesh) => mesh.render(this.program))
  }
}
