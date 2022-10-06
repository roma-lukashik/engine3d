import { Program } from "@webgl/program"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { WebGLDataTexture } from "@webgl/textures/data"
import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { ceilPowerOfTwo } from "@math/operators"
import { transform } from "@utils/object"
import { Skeleton } from "@core/skeleton"
import { WebGLImageTexture } from "@webgl/textures/image"
import { AABB } from "@geometry/bbox/aabb"
import { Matrix4 } from "@math/matrix4"

type Props = {
  gl: WebGLRenderingContext
  mesh: Mesh
}

export class WebGLMesh {
  public readonly colorTexture: WebGLImageTexture
  public projectionMatrix: Matrix4
  public readonly mesh: Mesh

  private readonly gl: WebGLRenderingContext
  private readonly attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>>
  private boneTexture: WebGLDataTexture<Float32Array>
  private boneTextureSize: number

  constructor({
    gl,
    mesh,
  }: Props) {
    this.gl = gl
    this.mesh = mesh
    this.attributes = this.computeAttributes()
    if (this.mesh.skeleton) {
      this.computeBoneTexture(this.mesh.skeleton)
    }
    this.projectionMatrix = mesh.worldMatrix
    if (this.mesh.material.colorTexture) {
      this.colorTexture = new WebGLImageTexture({ gl, image: this.mesh.material.colorTexture.source })
    }
  }

  public render(program: Program): void {
    if (this.mesh.skeleton) {
      this.boneTexture.updateTexture(this.mesh.skeleton.boneMatrices, this.boneTextureSize)
    }
    this.projectionMatrix = this.mesh.worldMatrix
    program.uniforms.setValues({
      worldMatrix: this.mesh.worldMatrix.toArray(),
      boneTexture: this.boneTexture,
      boneTextureSize: this.boneTextureSize,
      material: {
        metalness: this.mesh.material.metalness,
        roughness: this.mesh.material.roughness,
        color: this.mesh.material.color.toArray(),
        colorTexture: this.colorTexture,
      },
    })
    program.attributes.update(this.attributes)
    this.drawBuffer()
  }

  public computeBoundingBox(): AABB {
    return new AABB(this.mesh.geometry.position.array)
  }

  private computeAttributes() {
    return transform(this.mesh.geometry, (value) => {
      return new WebglVertexAttribute(this.gl, value)
    })
  }

  private computeBoneTexture(skeleton: Skeleton): void {
    this.boneTextureSize = Math.max(4, ceilPowerOfTwo(Math.sqrt(skeleton.bones.length * 4)))
    this.boneTexture = new WebGLDataTexture({
      gl: this.gl,
      size: this.boneTextureSize,
      data: skeleton.boneMatrices,
    })
  }

  private drawBuffer(): void {
    const { index } = this.attributes
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position?.count ?? 0)
    }
  }
}
