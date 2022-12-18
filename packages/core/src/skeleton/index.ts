import { Node } from "@core/node"
import { Matrix4 } from "@math/matrix4"

export class Skeleton {
  public bones: Node[]
  public boneInverses: Matrix4[]
  public boneMatrices: Float32Array

  private globalWorldInverse: Matrix4 = new Matrix4()
  private boneMatrix: Matrix4 = new Matrix4()

  public constructor(bones: Node[], boneInverses: Matrix4[]) {
    this.bones = bones
    this.boneInverses = boneInverses
    this.boneMatrices = new Float32Array(bones.length * Matrix4.size)
  }

  public update(node: Node) {
    this.globalWorldInverse.copy(node.worldMatrix).invert()
    this.bones.forEach((bone, i) => {
      this.boneMatrix.copy(this.globalWorldInverse).multiply(bone.worldMatrix).multiply(this.boneInverses[i])
      this.boneMatrices.set(this.boneMatrix.elements, i * Matrix4.size)
    })
  }
}
