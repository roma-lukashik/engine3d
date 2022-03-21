import { Texture, TextureType } from '../types'

type Props = {
  color?: number;
}

export class PixelTexture implements Texture {
  public color: number
  public type: TextureType = TextureType.Pixel

  constructor({
    color = 0x646464,
  }: Props) {
    this.color = color
  }
}
