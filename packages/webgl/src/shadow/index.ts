import { WebGLMesh } from "@webgl/mesh"
import { WebGLDepthTexture } from "@webgl/textures/depth"
import { ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"

type Props = {
  gl: WebGLRenderingContext
}

export class ShadowRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly programs: WeakMap<WebGLMesh, ShadowProgram> = new WeakMap()

  public readonly depthTextures: WeakMap<LightWithShadow, WebGLDepthTexture> = new WeakMap()

  constructor({ gl }: Props) {
    this.gl = gl
  }

  public render(lights: LightWithShadow[], meshes: Map<Mesh, WebGLMesh>): void {
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)

    lights.forEach((light) => {
      if (!this.depthTextures.has(light)) {
        this.depthTextures.set(light, new WebGLDepthTexture({ gl: this.gl }))
      }
      const texture = this.depthTextures.get(light)!
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, texture.frameBuffer)
      this.gl.viewport(0, 0, texture.width, texture.height)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      meshes.forEach((mesh, key) => {
        if (!this.programs.has(mesh)) {
          this.programs.set(mesh, new ShadowProgram({
            gl: this.gl,
            useSkinning: !!key.skeleton,
          }))
        }
        const program = this.programs.get(mesh)!
        program.uniforms.setValues({ projectionMatrix: light.projectionMatrix })
        mesh.render(program)
      })
    })
  }
}
