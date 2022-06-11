type Props = {
  source: TexImageSource
}

export class Texture {
  public source: TexImageSource

  constructor({ source }: Props) {
    this.source = source
  }
}
