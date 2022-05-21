import { WebGLBaseTexture } from "@webgl/textures/types"

type Props<T = any> = {
  gl: WebGLRenderingContext
  activeInfo: WebGLActiveInfo
  location: WebGLUniformLocation
  value: T
}

export class Uniform<T = any> {
  private readonly gl: WebGLRenderingContext
  private readonly location: WebGLUniformLocation
  private readonly type: number
  private readonly structProperty?: string
  private readonly arrayIndex?: number

  public readonly name: string
  public value: T

  constructor({ gl, activeInfo, location, value }: Props<T>) {
    const split = activeInfo.name.match(/(\w+)/g)
    if (!split) {
      throw new Error(`Uniform ${activeInfo.name} contains an error.`)
    }

    this.gl = gl
    this.value = value
    this.type = activeInfo.type
    this.location = location
    this.name = split[0]
    if (split.length === 3) {
      this.arrayIndex = Number(split[1])
      this.structProperty = split[2]
    } else if (split.length === 2 && isNaN(Number(split[1]))) {
      this.structProperty = split[1]
    } else if (split.length === 2) {
      this.arrayIndex = Number(split[1])
    }
  }

  public isTexture(): this is Uniform<WebGLBaseTexture> {
    return this.type === this.gl.SAMPLER_2D || this.type === this.gl.SAMPLER_CUBE
  }

  public isTextureArray(): this is Uniform<WebGLBaseTexture[]> {
    return this.isTexture() && Array.isArray(this.value)
  }

  public setValue(value: any): void {
    if (this.structProperty !== undefined && this.arrayIndex !== undefined) {
      this.value = value[this.arrayIndex][this.structProperty]
    } else if (this.structProperty !== undefined) {
      this.value = value[this.structProperty]
    } else if (this.arrayIndex !== undefined) {
      this.value = value.flat()
    } else {
      this.value = value
    }
  }

  public specifyValue(value: any = this.value): void {
    switch (this.type) {
      case this.gl.FLOAT:
        return value.length ? this.gl.uniform1fv(this.location, value) : this.gl.uniform1f(this.location, value)
      case this.gl.FLOAT_VEC2:
        return this.gl.uniform2fv(this.location, value)
      case this.gl.FLOAT_VEC3:
        return this.gl.uniform3fv(this.location, value)
      case this.gl.FLOAT_VEC4:
        return this.gl.uniform4fv(this.location, value)
      case this.gl.BOOL:
      case this.gl.INT:
      case this.gl.SAMPLER_2D:
      case this.gl.SAMPLER_CUBE:
        return value.length ? this.gl.uniform1iv(this.location, value) : this.gl.uniform1i(this.location, value)
      case this.gl.BOOL_VEC2:
      case this.gl.INT_VEC2:
        return this.gl.uniform2iv(this.location, value)
      case this.gl.BOOL_VEC3:
      case this.gl.INT_VEC3:
        return this.gl.uniform3iv(this.location, value)
      case this.gl.BOOL_VEC4:
      case this.gl.INT_VEC4:
        return this.gl.uniform4iv(this.location, value)
      case this.gl.FLOAT_MAT2:
        return this.gl.uniformMatrix2fv(this.location, false, value)
      case this.gl.FLOAT_MAT3:
        return this.gl.uniformMatrix3fv(this.location, false, value)
      case this.gl.FLOAT_MAT4:
        return this.gl.uniformMatrix4fv(this.location, false, value)
    }
  }
}
