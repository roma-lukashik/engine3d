type Props = {
  source: TexImageSource
}

export class Texture {
  public source: TexImageSource

  public constructor({ source }: Props) {
    this.source = source
  }
}
