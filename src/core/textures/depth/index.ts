type DepthTextureOptions = {
  gl: WebGLRenderingContext;
  width?: number;
  height?: number;
}

export class DepthTexture {
  private readonly gl: WebGLRenderingContext

  public readonly width: number
  public readonly height: number
  public readonly texture: WebGLTexture
  public readonly buffer: WebGLBuffer | null

  constructor({
    gl,
    width = 1024,
    height = 1024,
  }: DepthTextureOptions) {
    Object.assign(this, { gl, width, height })

    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)

    this.texture = this.createTexture()
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0,
    )

    const depthBuffer = this.gl.createRenderbuffer()
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer)
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height)
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthBuffer)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  private createTexture(): WebGLTexture {
    const texture = this.gl.createTexture()
    if (!texture) {
      throw new Error('Cannot create a texture')
    }
    const target = this.gl.TEXTURE_2D
    const level = 0
    const format = this.gl.RGBA
    const internalFormat = format
    const type = this.gl.UNSIGNED_BYTE
    const border = 0
    this.gl.bindTexture(target, texture)
    this.gl.texParameteri(target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texImage2D(target, level, internalFormat, this.width, this.height, border, format, type, null)
    return texture
  }
}
