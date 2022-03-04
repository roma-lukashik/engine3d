import { createTexture2D, getID } from '../utils'

type DepthTextureOptions = {
  gl: WebGLRenderingContext;
  width?: number;
  height?: number;
}

export class DepthTexture {
  public readonly width: number
  public readonly height: number
  public readonly texture: WebGLTexture
  public readonly buffer: WebGLBuffer | null
  public readonly register: number = getID()

  constructor({
    gl,
    width = 1024,
    height = 1024,
  }: DepthTextureOptions) {
    this.width = width
    this.height = height
    this.texture = this.createTexture(gl)
    this.buffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)

    const depthBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  private createTexture(gl: WebGLRenderingContext): WebGLTexture {
    const texture = createTexture2D(gl, this.register)
    const target = gl.TEXTURE_2D
    const level = 0
    const format = gl.RGBA
    const internalFormat = format
    const type = gl.UNSIGNED_BYTE
    const border = 0
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(target, level, internalFormat, this.width, this.height, border, format, type, null)
    return texture
  }
}
