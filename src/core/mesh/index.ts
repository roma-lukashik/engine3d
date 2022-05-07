import * as m4 from '../../math/matrix4'
import { Model } from '../types'
import { Material } from '../loaders/gltf/material'

type Props = {
  data: Model;
  modelMatrix?: m4.Matrix4;
  material: Material;
}

export class Mesh {
  public readonly data: Model
  public readonly material: Material
  public modelMatrix: m4.Matrix4

  constructor({
    data,
    material,
    modelMatrix = m4.identity(),
  }: Props) {
    this.data = data
    this.modelMatrix = modelMatrix
    this.material = material
  }
}
