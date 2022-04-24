import * as v3  from '../../../../math/vector3'
import * as v4 from '../../../../math/vector4'
import * as m4 from '../../../../math/matrix4'
import { GltfNode } from '../../types'

type Vector3 = v3.Vector3
type Vector4 = v4.Vector4
type Matrix4 = m4.Matrix4

export class Node {
  public name: string
  public position: Vector3
  public scale: Vector3
  public rotation: Vector4
  public matrix: Matrix4

  constructor({
    name = '',
    translation = v3.zero(),
    scale = v3.one(),
    rotation = v4.zero(),
    matrix,
  }: GltfNode) {
    this.name = name
    if (matrix) {
      this.matrix = matrix
    } else {
      this.position = translation
      this.scale = scale
      this.rotation = rotation
    }
  }
}
