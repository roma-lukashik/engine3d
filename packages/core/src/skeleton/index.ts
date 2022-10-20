import { Node } from "@core/node"
import { Matrix4 } from "@math/matrix4"

type SkeletonProps = {
  bones: Node[]
  boneInverses: Matrix4[]
}

export class Skeleton {
  public bones: Node[]
  public boneInverses: Matrix4[]
  public boneMatrices: Float32Array

  public constructor({ bones, boneInverses }: SkeletonProps) {
    this.bones = bones
    this.boneInverses = boneInverses
    this.boneMatrices = new Float32Array(bones.length * Matrix4.size)
  }

  public update(node: Node) {
    const globalWorldInverse = node.worldMatrix.clone().invert()
    this.bones.forEach((bone, i) => {
      const boneMatrix = globalWorldInverse.clone().multiply(bone.worldMatrix).multiply(this.boneInverses[i])
      this.boneMatrices.set(boneMatrix.elements, i * Matrix4.size)
    })
  }
}
