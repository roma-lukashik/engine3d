import * as m4 from "@math/matrix4"
import * as v3 from "@math/vector3"
import * as q from "@math/quaternion"
import { Matrix4, Quaternion, Vector3 } from "@math/types"

type ObjectProps = {
  name?: string
  position?: Vector3
  rotation?: Quaternion
  scale?: Vector3
  matrix?: Matrix4
}

export class Object3d {
  public name?: string
  public localMatrix: Matrix4
  public worldMatrix: Matrix4 = m4.identity()
  public position: Vector3
  public scale: Vector3
  public rotation: Quaternion
  public children: Object3d[] = []

  constructor({
    name,
    position = v3.zero(),
    scale = v3.one(),
    rotation = q.identity(),
    matrix,
  }: ObjectProps = {}) {
    if (matrix) {
      this.localMatrix = matrix
      this.position = m4.translationVector(matrix)
      this.scale = m4.scalingVector(matrix)
      this.rotation = m4.rotationVector(matrix)
    } else {
      this.position = position
      this.scale = scale
      this.rotation = rotation
      this.localMatrix = m4.compose(rotation, position, scale)
    }

    this.name = name
  }

  public add(objects: Object3d[]): void {
    this.children.push(...objects)
  }

  public traverse(fn: (object: Object3d) => void): void {
    fn(this)
    this.children.forEach((child) => child.traverse(fn))
  }

  public updateWorldMatrix(matrix: Matrix4): void {
    this.worldMatrix = m4.multiply(matrix, this.localMatrix)
    this.children.forEach((child) => child.updateWorldMatrix(this.worldMatrix))
  }
}
