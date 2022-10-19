import { Mesh } from "@core/mesh"
import { BoneTexture } from "@webgl/textures/bone"
import { WebGLImageTexture } from "@webgl/textures/image"

export class RenderCache {
  private readonly gl: WebGLRenderingContext

  private readonly boneTextures: WeakMap<Mesh, BoneTexture> = new WeakMap()
  private readonly colorTextures: WeakMap<Mesh, WebGLImageTexture> = new WeakMap()

  public constructor(gl: WebGLRenderingContext) {
    this.gl = gl
  }

  public getBoneTexture(mesh: Mesh): BoneTexture | undefined {
    if (!mesh.skeleton) {
      return
    }
    if (!this.boneTextures.has(mesh)) {
      this.boneTextures.set(mesh, new BoneTexture(this.gl, mesh.skeleton))
    }
    return this.boneTextures.get(mesh)
  }

  public getColorTexture(mesh: Mesh): WebGLImageTexture | undefined {
    if (!mesh.material.colorTexture) {
      return
    }
    if (!this.colorTextures.has(mesh)) {
      this.colorTextures.set(mesh, new WebGLImageTexture(this.gl, mesh.material.colorTexture.source))
    }
    return this.colorTextures.get(mesh)
  }
}
