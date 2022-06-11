type Props = {
  buffer: ArrayBuffer
  mimeType?: string
}

export class Texture {
  public imageSource: TexImageSource

  constructor({ buffer, mimeType }: Props) {
    const blob = new Blob([buffer], { type: mimeType })
    const link = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => URL.revokeObjectURL(link)
    img.src = link
    this.imageSource = img
  }
}
