import { Object3d } from "@core/object3d"
import { Matrix4 } from "@math/matrix4"

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
    this.boneMatrices = new Float32Array(bones.length * Matrix4.size)
  }

  public update(node: Object3d) {
    const globalWorldInverse = node.worldMatrix.clone().invert()
    this.bones.forEach((bone, i) => {
      const boneMatrix = globalWorldInverse.clone().multiply(bone.worldMatrix).multiply(this.boneInverses[i])
      this.boneMatrices.set(boneMatrix.elements, i * Matrix4.size)
    })
  }
}
