import { createTexture2D } from '../utils'

type PixelTextureOptions = {
  gl: WebGLRenderingContext;
  color?: number[];
  register: number
}

const DEFAULT_GRAY_COLOR = [100, 100, 100, 255]

export class PixelTexture {
  public readonly texture: WebGLTexture
  public readonly register: number

  constructor({
    gl,
    register,
    color = DEFAULT_GRAY_COLOR,
  }: PixelTextureOptions) {
    this.register = register
    this.texture = createTexture2D(gl, this.register)

    const level = 0
    const internalFormat = gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE
    const pixel = new Uint8Array(color)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)
  }
}
