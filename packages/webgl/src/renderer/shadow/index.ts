import { WebGLMesh } from "@webgl/mesh"
import { ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"
import { TexturesStore } from "@webgl/renderer/shadow/texturesStore"
import { WebglRenderState } from "@webgl/utils/renderState"

export class ShadowRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly programs: WeakMap<WebGLMesh, ShadowProgram> = new WeakMap()

  public readonly texturesStore: TexturesStore<LightWithShadow>

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    this.gl = gl
    this.state = state
    this.texturesStore = new TexturesStore(gl)
  }

  public render(lights: LightWithShadow[], meshes: Map<Mesh, WebGLMesh>): void {
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)

    lights.forEach((light) => {
      const texture = this.texturesStore.getOrCreate(light)
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, texture.frameBuffer)
      this.gl.viewport(0, 0, texture.width, texture.height)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      meshes.forEach((mesh, key) => {
        if (!this.programs.has(mesh)) {
          this.programs.set(mesh, new ShadowProgram(this.gl, this.state, {
            useSkinning: !!key.skeleton,
          }))
        }
        const program = this.programs.get(mesh)!
        program.use()
        program.uniforms.setValues({ projectionMatrix: light.projectionMatrix.elements })
        mesh.render(program)
      })
    })
  }
}
