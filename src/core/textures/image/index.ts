import { Texture, TextureType } from '../types'

type Props = {
  image: TexImageSource;
}

export class ImageTexture implements Texture {
  public image: TexImageSource
  public type: TextureType = TextureType.Image

  constructor({ image }: Props) {
    this.image = image
  }
}
