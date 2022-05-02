import { Texture, TextureType } from '../types'

type Props = {
  color?: number;
}

export class ColorTexture implements Texture {
  public color: number
  public type: TextureType = TextureType.Color

  constructor({
    color = 0x646464,
  }: Props = {}) {
    this.color = color
  }
}
