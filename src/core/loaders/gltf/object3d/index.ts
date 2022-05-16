import * as m4 from '../../../../math/matrix4'
import * as v3 from '../../../../math/vector3'
import * as q from '../../../../math/quaternion'

type Matrix4 = m4.Matrix4
type Vector3 = v3.Vector3
type Quaternion = q.Quaternion

type ObjectProps = {
  translation?: Vector3
  rotation?: Quaternion
  scale?: Vector3
  matrix?: Matrix4
}

export class Object3d {
  public matrix: Matrix4
  public children: Object3d[] = []

  constructor({
    translation = v3.zero(),
    scale = v3.one(),
    rotation = q.identity(),
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
