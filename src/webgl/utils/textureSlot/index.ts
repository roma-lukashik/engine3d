type Props = {
  gl: WebGLRenderingContext
}

export class TextureSlot {
  private readonly maxTextures: number
  private slot: number = -1

  constructor({ gl }: Props) {
    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
  }

  public next(): number {
    this.slot += 1
    if (this.slot > this.maxTextures) {
      throw new Error(`Cannot use texture unit ${this.slot} while GPU supports only ${this.maxTextures}.`)
    }
    return this.slot
  }
}
