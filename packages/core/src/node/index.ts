import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"

type Options = {
  name?: string
  position?: Vector3
  rotation?: Quaternion
  scale?: Vector3
  matrix?: Matrix4
}

export class Node {
  public name?: string
  public localMatrix: Matrix4
  public worldMatrix: Matrix4 = Matrix4.identity()
  public position: Vector3
  public scale: Vector3
  public rotation: Quaternion
  public children: Node[] = []
  public parent?: Node

  public constructor({
    name,
    position = Vector3.zero(),
    scale = Vector3.one(),
    rotation = Quaternion.identity(),
    matrix,
  }: Options = {}) {
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

  public getWorldPosition(): Vector3 {
    return this.worldMatrix.translationVector()
  }

  public getWorldRotation(): Quaternion {
    return this.worldMatrix.rotationVector()
  }

  public add(nodes: Node[]): void {
    this.children.push(...nodes)
    nodes.forEach((node) => node.parent = this)
  }

  public traverse(fn: (node: Node) => void): void {
    fn(this)
    this.children.forEach((child) => child.traverse(fn))
  }

  public updateWorldMatrix(): void {
    if (this.parent) {
      this.worldMatrix.set(this.parent.worldMatrix.elements).multiply(this.localMatrix)
    } else {
      this.worldMatrix.set(this.localMatrix.elements)
    }
    this.children.forEach((child) => child.updateWorldMatrix())
  }
}
