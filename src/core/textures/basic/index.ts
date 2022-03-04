import { createTexture, getID } from '../utils'

type BasicTextureOptions = {
  gl: WebGLRenderingContext;
  image: TexImageSource;
}

export class BasicTexture {
  public readonly texture: WebGLTexture
  public readonly buffer: WebGLBuffer | null
  public readonly register: number = getID()

  constructor({
    gl,
    image,
  }: BasicTextureOptions) {
    this.texture = createTexture(gl, image, this.register)
    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }
}
