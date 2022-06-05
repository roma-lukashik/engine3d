import { Program } from "@webgl/program"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { DataTexture } from "@webgl/textures/data"
import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { ceilPowerOfTwo } from "@math/operators"
import { transform } from "@utils/object"
import { Skeleton } from "@core/skeleton"

type Props = {
  gl: WebGLRenderingContext
  mesh: Mesh
}

export class WebGLMesh {
  private readonly gl: WebGLRenderingContext
  private readonly mesh: Mesh
  private readonly attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>>
  private boneTexture: DataTexture<Float32Array>
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
  }

  public render(program: Program): void {
    program.use()
    program.uniforms.setValues({
      worldMatrix: this.mesh.worldMatrix,
      boneTexture: this.boneTexture,
      boneTextureSize: this.boneTextureSize,
      material: {
        metalness: this.mesh.material.metalness,
        roughness: this.mesh.material.roughness,
        color: this.mesh.material.color,
      },
    })
    program.uniforms.update()
    program.attributes.update(this.attributes)
    this.drawBuffer()
  }

  private computeAttributes() {
    return transform(this.mesh.geometry, (value) => {
      return new WebglVertexAttribute(this.gl, value)
    })
  }

  private computeBoneTexture(skeleton: Skeleton): void {
    this.boneTextureSize = Math.max(4, ceilPowerOfTwo(Math.sqrt(skeleton.bones.length * 4)))
    this.boneTexture = new DataTexture({
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
