import { WebGLMesh } from "@webgl/mesh"
import { ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Scene } from "@webgl/scene"
import { WebGLDepthTexture } from "@webgl/textures/depth"

export class ShadowMaps {
  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly programs: WeakMap<Mesh, ShadowProgram> = new WeakMap()
  private readonly meshes: WeakMap<Mesh, WebGLMesh> = new WeakMap()
  private readonly textures: WeakMap<LightWithShadow, WebGLDepthTexture> = new WeakMap()

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    this.gl = gl
    this.state = state
  }

  public create(scene: Scene): WebGLDepthTexture[] {
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)

    return scene.shadowLights.map((light) => {
      const texture = this.getTexture(light)

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, texture.frameBuffer)
      this.gl.viewport(0, 0, texture.width, texture.height)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      scene.objects.forEach((object) => {
        object.meshes.forEach((mesh) => {
          const program = this.getProgram(mesh)
          program.use()

          if (!this.meshes.get(mesh)) {
            this.meshes.set(mesh, new WebGLMesh(this.gl, mesh))
          }
          const webglMesh = this.meshes.get(mesh)!

          program.uniforms.setValues({
            worldMatrix: mesh.worldMatrix.elements,
            boneTexture: webglMesh.boneTexture,
            boneTextureSize: webglMesh.boneTextureSize,
            projectionMatrix: light.projectionMatrix.elements,
          })
          program.attributes.update({
            position: webglMesh.attributes.position,
            skinIndex: webglMesh.attributes.skinIndex,
            skinWeight: webglMesh.attributes.skinWeight,
            index: webglMesh.attributes.index,
          })
          webglMesh.render()
        })
      })
      return texture
    })
  }

  private getTexture(light: LightWithShadow): WebGLDepthTexture {
    if (!this.textures.has(light)) {
      this.textures.set(light, new WebGLDepthTexture({ gl: this.gl }))
    }
    return this.textures.get(light)!
  }

  private getProgram(mesh: Mesh): ShadowProgram {
    if (!this.programs.has(mesh)) {
      this.programs.set(mesh, new ShadowProgram(this.gl, this.state, {
        useSkinning: !!mesh.skeleton,
      }))
    }
    return this.programs.get(mesh)!
  }
}
