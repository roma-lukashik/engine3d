import { WebGLDataTexture } from "@webgl/textures/data"
import { Skeleton } from "@core/skeleton"
import { ceilPowerOfTwo } from "@math/operators"
import { Vector4 } from "@math/vector4"

export class BoneTexture {
  public readonly texture: WebGLDataTexture<Float32Array>
  public readonly size: number

  private readonly skeleton: Skeleton

  public constructor(
    gl: WebGLRenderingContext,
    skeleton: Skeleton,
  ) {
    this.skeleton = skeleton
    this.size = Math.max(Vector4.size, ceilPowerOfTwo(Math.sqrt(skeleton.bones.length * Vector4.size)))
    this.texture = new WebGLDataTexture(gl, this.size, skeleton.boneMatrices)
  }

  public update(): void {
    this.texture.updateTexture(this.skeleton.boneMatrices, this.size)
  }
}
