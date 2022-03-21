import { WebGLBaseTexture } from '../types'
import { createTexture2D, supportMipmap } from '../utils'

type Props = {
  gl: WebGLRenderingContext;
  image: TexImageSource;
}

export class WebGLImageTexture implements WebGLBaseTexture {
  private readonly buffer: WebGLBuffer | null

  public readonly texture: WebGLTexture

  constructor({
    gl,
    image,
  }: Props) {
    this.texture = this.createTexture(gl, image)
    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }

  private createTexture(gl: WebGLRenderingContext, image: TexImageSource): WebGLTexture {
    const texture = createTexture2D(gl)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (supportMipmap(image)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }
    return texture
  }
}
