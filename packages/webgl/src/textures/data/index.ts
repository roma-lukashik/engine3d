import { TypedArray } from "@core/types"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { createTexture2D } from "@webgl/textures/utils"

type Props<T extends TypedArray> = {
  gl: WebGLRenderingContext
  size: number
  data: T
}

export class DataTexture<T extends TypedArray> implements WebGLBaseTexture {
  public texture: WebGLTexture

  private gl: WebGLRenderingContext

  constructor({ gl, size, data }: Props<T>) {
    this.gl = gl
    this.texture = this.createTexture(gl, data, size)
  }

  private createTexture(gl: WebGLRenderingContext, data: T, size: number): WebGLTexture {
    const texture = createTexture2D(gl)
    const target = gl.TEXTURE_2D
    const level = 0
    const format = gl.RGBA
    const internalFormat = gl.RGBA
    const type = this.getTextureDataType(data)
    const border = 0
    // TODO change the array
    const dataArray = new Float32Array(size * size * 4)
    dataArray.set(data)
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(target, level, internalFormat, size, size, border, format, type, dataArray)
    return texture
  }

  private getTextureDataType(data: T): number {
    if (data instanceof Float32Array) return this.gl.FLOAT
    if (data instanceof Uint32Array) return this.gl.UNSIGNED_INT
    if (data instanceof Uint16Array) return this.gl.UNSIGNED_SHORT
    return this.gl.UNSIGNED_BYTE
  }
}
