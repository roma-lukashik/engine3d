import { getID } from '../utils'

type PixelTextureOptions = {
  gl: WebGLRenderingContext;
}

export class PixelTexture {
  public readonly texture: WebGLTexture
  public readonly register: number = getID()

  constructor({ gl }: PixelTextureOptions) {
    const texture = gl.createTexture()
    if (!texture) {
      throw new Error('Cannot create a texture')
    }
    gl.activeTexture(gl.TEXTURE0 + this.register)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE
    const pixel = new Uint8Array([100, 100, 100, 255])
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

    this.texture = texture
  }
}
