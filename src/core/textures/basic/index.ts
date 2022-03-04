import { createTexture2D, isPowerOf2 } from '../utils'

type BasicTextureOptions = {
  gl: WebGLRenderingContext;
  image: TexImageSource;
  register: number;
}

export class BasicTexture {
  public readonly texture: WebGLTexture
  public readonly buffer: WebGLBuffer | null
  public readonly register: number

  constructor({
    gl,
    image,
    register,
  }: BasicTextureOptions) {
    this.register = register
    this.texture = this.createTexture(gl, image)
    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }

  private createTexture(gl: WebGLRenderingContext, image: TexImageSource): WebGLTexture {
    const texture = createTexture2D(gl, this.register)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
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
