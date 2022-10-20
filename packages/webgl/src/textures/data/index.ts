import { TypedArray } from "@core/types"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { createTexture2D } from "@webgl/textures/utils"
import { Vector4 } from "@math/vector4"

export class WebGLDataTexture<T extends TypedArray> implements WebGLBaseTexture {
  public texture: WebGLTexture

  private readonly gl: WebGLRenderingContext

  public constructor(
    gl: WebGLRenderingContext,
    size: number,
    data: T,
  ) {
    this.gl = gl
    this.texture = this.createTexture()
    this.updateTexture(data, size)
  }

  public updateTexture(data: T, size: number): void {
    const target = this.gl.TEXTURE_2D
    const level = 0
    const format = this.gl.RGBA
    const internalFormat = this.gl.RGBA
    const type = this.getTextureDataType(data)
    const border = 0
    // TODO change the array
    const dataArray = new Float32Array(size * size * Vector4.size)
    dataArray.set(data)
    this.gl.bindTexture(target, this.texture)
    this.gl.texImage2D(target, level, internalFormat, size, size, border, format, type, dataArray)
  }

  private createTexture(): WebGLTexture {
    const texture = createTexture2D(this.gl)
    const target = this.gl.TEXTURE_2D
    this.gl.texParameteri(target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    return texture
  }

  private getTextureDataType(data: T): number {
    if (data instanceof Float32Array) return this.gl.FLOAT
    if (data instanceof Uint32Array) return this.gl.UNSIGNED_INT
    if (data instanceof Uint16Array) return this.gl.UNSIGNED_SHORT
    return this.gl.UNSIGNED_BYTE
  }
}
