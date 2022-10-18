import { ShadowAttributes, ShadowProgram } from "@webgl/program/shadow"
import { LightWithShadow } from "@core/lights"
import { Mesh } from "@core/mesh"
import { RenderState } from "@webgl/utils/state"
import { Scene } from "@webgl/scene"
import { WebGLShadowTexture } from "@webgl/textures/shadow"
import { RenderCache } from "@webgl/renderer/cache"
import { WebglVertexAttribute } from "@webgl/utils/attribute"

export class ShadowMaps {
  private readonly gl: WebGLRenderingContext
  private readonly state: RenderState
  private readonly cache: RenderCache
  private readonly programs: WeakMap<Mesh, ShadowProgram> = new WeakMap()
  private readonly textures: WeakMap<LightWithShadow, WebGLShadowTexture> = new WeakMap()

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    cache: RenderCache,
  ) {
    this.gl = gl
    this.state = state
    this.cache = cache
  }

  public create(scene: Scene): WebGLShadowTexture[] {
    this.gl.disable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)

    return scene.shadowLights.map((light) => {
      const texture = this.getTexture(light)

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, texture.frameBuffer)
      this.gl.viewport(0, 0, texture.width, texture.height)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      scene.objects.forEach((object) => {
        object.meshes.forEach((mesh) => {
          this.renderShadow(mesh, light)
        })
      })

      return texture
    })
  }

  private getTexture(light: LightWithShadow): WebGLShadowTexture {
    if (!this.textures.has(light)) {
      this.textures.set(light, new WebGLShadowTexture({ gl: this.gl }))
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

  private renderShadow(mesh: Mesh, light: LightWithShadow): void {
    const program = this.getProgram(mesh)
    program.use()
    const boneTexture = this.cache.getBoneTexture(mesh)
    boneTexture?.update()

    program.uniforms.setValues({
      worldMatrix: mesh.worldMatrix.elements,
      boneTexture: boneTexture?.texture,
      boneTextureSize: boneTexture?.size,
      projectionMatrix: light.projectionMatrix.elements,
    })

    const attributes = this.cache.getAttributes(mesh)
    program.attributes.update({
      position: attributes.position,
      skinIndex: attributes.skinIndex,
      skinWeight: attributes.skinWeight,
      index: attributes.index,
    })

    this.drawBuffer(attributes)
  }

  private drawBuffer({ index, position }: Partial<ShadowAttributes> & { index?: WebglVertexAttribute; }): void {
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, position?.count ?? 0)
    }
  }
}
