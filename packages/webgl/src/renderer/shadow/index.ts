import { WebGLMesh } from "@webgl/mesh"
import { ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"
import { TexturesStore } from "@webgl/renderer/shadow/texturesStore"

type Props = {
  gl: WebGLRenderingContext
}

export class ShadowRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly programs: WeakMap<WebGLMesh, ShadowProgram> = new WeakMap()

  public readonly texturesStore: TexturesStore<LightWithShadow>

  constructor({ gl }: Props) {
    this.gl = gl
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
          this.programs.set(mesh, new ShadowProgram({
            gl: this.gl,
            useSkinning: !!key.skeleton,
          }))
        }
        const program = this.programs.get(mesh)!
        program.uniforms.setValues({ projectionMatrix: light.projectionMatrix.toArray() })
        mesh.render(program)
      })
    })
  }
}
