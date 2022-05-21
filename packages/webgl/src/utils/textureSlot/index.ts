type Props = {
  gl: WebGLRenderingContext
}

export class TextureSlot {
  private readonly maxTextures: number
  private slot: number = 0

  constructor({ gl }: Props) {
    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
  }

  public get current(): number {
    if (this.slot > this.maxTextures) {
      throw new Error(`Cannot use texture unit ${this.slot} while GPU supports only ${this.maxTextures}.`)
    }
    return this.slot
  }

  public next() {
    this.slot += 1
  }
}
