import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"

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
  public worldMatrix: Matrix4 = Matrix4.identity()
  public position: Vector3
  public scale: Vector3
  public rotation: Quaternion
  public children: Object3d[] = []

  constructor({
    name,
    position = Vector3.zero(),
    scale = Vector3.one(),
    rotation = Quaternion.identity(),
    matrix,
  }: ObjectProps = {}) {
    if (matrix) {
      this.localMatrix = matrix
      this.position = matrix.translationVector()
      this.scale = matrix.scalingVector()
      this.rotation = matrix.rotationVector()
    } else {
      this.position = position
      this.scale = scale
      this.rotation = rotation
      this.localMatrix = Matrix4.compose(rotation, position, scale)
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

  public updateWorldMatrix(matrix: Matrix4 = Matrix4.identity()): void {
    this.worldMatrix = matrix.clone().multiply(this.localMatrix)
    this.children.forEach((child) => child.updateWorldMatrix(this.worldMatrix))
  }
}
