import * as m4 from '../../../../math/matrix4'
import * as v3 from '../../../../math/vector3'
import * as v4 from '../../../../math/vector4'

type Matrix4 = m4.Matrix4
type Vector3 = v3.Vector3
type Vector4 = v4.Vector4

type ObjectProps = {
  translation?: Vector3
  rotation?: Vector4
  scale?: Vector3
  matrix?: Matrix4
}

export class Object3d {
  public matrix: Matrix4
  public children: Object3d[] = []

  constructor({
    translation = v3.zero(),
    scale = v3.one(),
    rotation = v4.vector4(0, 0, 0, 1),
    matrix,
  }: ObjectProps = {}) {
    this.matrix = matrix ?? m4.compose(rotation, translation, scale)
  }

  public add(...objects: Object3d[]): void {
    this.children.push(...objects)
  }

  public traverse(fn: (object: Object3d) => void): void {
    fn(this)
    this.children.forEach((child) => child.traverse(fn))
  }
}
