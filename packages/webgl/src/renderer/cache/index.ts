import { Mesh } from "@core/mesh"
import { BoneTexture } from "@webgl/textures/bone"
import { WebGLImageTexture } from "@webgl/textures/image"
import { Texture } from "@core/texture"

export class RenderCache {
  private readonly gl: WebGLRenderingContext

  private readonly boneTextures: WeakMap<Mesh, BoneTexture> = new WeakMap()
  private readonly colorTextures: WeakMap<Mesh, WebGLImageTexture> = new WeakMap()
  private readonly normalTextures: WeakMap<Mesh, WebGLImageTexture> = new WeakMap()

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
    return this.getImageTexture(mesh, this.colorTextures, mesh.material.colorTexture)
  }

  public getNormalTexture(mesh: Mesh): WebGLImageTexture | undefined {
    return this.getImageTexture(mesh, this.normalTextures, mesh.material.normalTexture)
  }

  private getImageTexture(
    mesh: Mesh,
    texturesMap: WeakMap<Mesh, WebGLImageTexture>,
    texture: Texture | undefined,
  ): WebGLImageTexture | undefined {
    if (!texture) {
      return
    }
    if (!texturesMap.has(mesh)) {
      texturesMap.set(mesh, new WebGLImageTexture(this.gl, texture.source))
    }
    return texturesMap.get(mesh)
  }
}
