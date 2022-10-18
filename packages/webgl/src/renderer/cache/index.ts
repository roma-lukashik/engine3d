import { Mesh } from "@core/mesh"
import { BoneTexture } from "@webgl/textures/bone"
import { WebGLImageTexture } from "@webgl/textures/image"
import { Geometry } from "@core/geometry"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { mapObject } from "@utils/object"

type MeshAttributes = Partial<Record<keyof Geometry, WebglVertexAttribute>>

export class RenderCache {
  private readonly gl: WebGLRenderingContext

  private readonly boneTextures: WeakMap<Mesh, BoneTexture> = new WeakMap()
  private readonly colorTextures: WeakMap<Mesh, WebGLImageTexture> = new WeakMap()
  private readonly meshAttributes: WeakMap<Mesh, MeshAttributes> = new WeakMap()

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

  public getAttributes(mesh: Mesh): MeshAttributes {
    if (!this.meshAttributes.has(mesh)) {
      this.meshAttributes.set(
        mesh,
        mapObject(mesh.geometry, (value) => new WebglVertexAttribute(this.gl, value)),
      )
    }
    return this.meshAttributes.get(mesh)!
  }
}
