import { Texture, TextureType } from '../types'
import { Vector3 } from '../../../math/vector3'
import { hexToNormRgb } from '../../../utils/color'

type Props = {
  color?: Vector3 | number
}

export class ColorTexture implements Texture {
  public color: Vector3
  public type: TextureType = TextureType.Color

  constructor({
    color = 0x646464,
  }: Props = {}) {
    this.color = Array.isArray(color) ? color : hexToNormRgb(color)
  }
}
