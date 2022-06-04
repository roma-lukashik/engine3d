import { Object3d } from "@core/object3d"
import { Matrix4 } from "@math/types"
import * as m4 from "@math/matrix4"

type SkeletonProps = {
  bones: Object3d[]
  boneInverses: Matrix4[]
}

export class Skeleton {
  public bones: Object3d[]
  public boneInverses: Matrix4[]
  public boneMatrices: Float32Array

  constructor({ bones, boneInverses }: SkeletonProps) {
    this.bones = bones
    this.boneInverses = boneInverses
    this.boneMatrices = new Float32Array(bones.length * m4.size)
  }

  public update(node: Object3d) {
    const globalWorldInverse = m4.invert(node.worldMatrix)
    this.bones.forEach((bone, i) => {
      const boneMatrix = m4.multiply(m4.multiply(globalWorldInverse, bone.worldMatrix), this.boneInverses[i])
      this.boneMatrices.set(boneMatrix, i * m4.size)
    })
  }
}
