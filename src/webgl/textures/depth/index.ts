import { WebGLBaseTexture } from '../types'
import { createTexture2D } from '../utils'

type Props = {
  gl: WebGLRenderingContext
  width?: number
  height?: number
}

export class WebGLDepthTexture implements WebGLBaseTexture {
  public readonly width: number
  public readonly height: number
  public readonly texture: WebGLTexture
  public readonly frameBuffer: WebGLFramebuffer | null
  public readonly renderBuffer: WebGLRenderbuffer | null

  constructor({
    gl,
    width = 1000,
    height = 1000,
  }: Props) {
    this.width = width
    this.height = height
    this.texture = this.createTexture(gl)
    this.frameBuffer = this.createFrameBuffer(gl)
    this.renderBuffer = this.createRenderBuffer(gl)
  }

  private createTexture(gl: WebGLRenderingContext): WebGLTexture {
    const texture = createTexture2D(gl)
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

  private createFrameBuffer(gl: WebGLRenderingContext): WebGLFramebuffer | null {
    const framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    return framebuffer
  }

  private createRenderBuffer(gl: WebGLRenderingContext): WebGLRenderbuffer | null {
    const renderbuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return renderbuffer
  }
}
