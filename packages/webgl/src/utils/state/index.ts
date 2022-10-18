export class RenderState {
  private readonly maxTextures: number
  private textureUnit: number = -1

  public constructor(gl: WebGLRenderingContext) {
    this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
  }

  public getCurrentTextureUnit(): number {
    return this.textureUnit
  }

  public setCurrentTextureUnit(textureUnit: number): void {
    if (textureUnit > this.maxTextures) {
      throw new Error(`Cannot use texture unit ${textureUnit} while GPU supports only ${this.maxTextures}.`)
    }
    this.textureUnit = textureUnit
  }

  public resetTextureUnit(): void {
    this.textureUnit = -1
  }
}
