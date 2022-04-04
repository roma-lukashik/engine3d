import { WebGLBaseTexture } from '../types'
import { createTexture2D } from '../utils'
import { Color } from '../../../math/color'

type Props = {
  gl: WebGLRenderingContext
  color: number
}

export class WebGLPixelTexture implements WebGLBaseTexture {
  public readonly texture: WebGLTexture

  constructor({
    gl,
    color,
  }: Props) {
    this.texture = createTexture2D(gl)

    const level = 0
    const internalFormat = gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE
    const pixel = new Uint8Array(new Color(color).rgba)
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)
  }
}
