import * as m4 from '../../math/matrix4'
import { PixelTexture, Texture } from '../textures'
import { Model } from '../types'

type Props = {
  data: Model;
  modelMatrix?: m4.Matrix4;
  texture?: Texture;
}

export class Mesh {
  public readonly data: Model
  public texture: Texture
  public modelMatrix: m4.Matrix4

  constructor({
    data,
    texture = new PixelTexture({}),
    modelMatrix = m4.identity(),
  }: Props) {
    this.data = data
    this.modelMatrix = modelMatrix
    this.texture = texture
  }
}
