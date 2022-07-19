import { Uniform, UniformSetter } from "@webgl/uniforms/types"
import { TypedArray } from "@core/types"
import { WebglRenderState } from "@webgl/utils/renderState"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { bindTexture } from "@webgl/textures/utils"
import { range } from "@utils/array"

export class ArrayUniform<T> implements Uniform<T[]> {
  public readonly name: string

  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly location: WebGLUniformLocation
  private readonly uniformSetter: UniformSetter
  private value: T[]

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    name: string,
    value: T[],
    location: WebGLUniformLocation,
    type: number,
  ) {
    this.gl = gl
    this.state = state
    this.name = name
    this.value = value
    this.location = location
    this.uniformSetter = this.getUniformSetter(type)
  }

  public setValue(value: T[]): void {
    if (this.value !== value) {
      this.value = value
      this.uniformSetter(this.location, value)
    }
  }

  private getUniformSetter(type: number): UniformSetter {
    const gl = this.gl

    switch (type) {
      case gl.FLOAT_VEC2:
        return (location, value: Float32Array[]) => gl.uniform2fv(location, flatten(value))
      case gl.FLOAT_VEC3:
        return (location, value: Float32Array[]) => gl.uniform3fv(location, flatten(value))
      case gl.FLOAT_VEC4:
        return (location, value: Float32Array[]) => gl.uniform4fv(location, flatten(value))

      case gl.SAMPLER_2D:
        return (location, value: WebGLBaseTexture[]) => this.setSampler2DTexture(location, value)

      case gl.BOOL_VEC2:
      case gl.INT_VEC2:
        return (location, value: Int32Array[]) => gl.uniform2iv(location, flatten(value))
      case gl.BOOL_VEC3:
      case gl.INT_VEC3:
        return (location, value: Int32Array[]) => gl.uniform3iv(location, flatten(value))
      case gl.BOOL_VEC4:
      case gl.INT_VEC4:
        return (location, value: Int32Array[]) => gl.uniform4iv(location, flatten(value))

      case gl.FLOAT_MAT2:
        return (location, value: Float32Array[]) => gl.uniformMatrix2fv(location, false, flatten(value))
      case gl.FLOAT_MAT3:
        return (location, value: Float32Array[]) => gl.uniformMatrix3fv(location, false, flatten(value))
      case gl.FLOAT_MAT4:
        return (location, value: Float32Array[]) => gl.uniformMatrix4fv(location, false, flatten(value))

      default:
        throw new Error(`Unsupported type ${type}.`)
    }
  }

  private setSampler2DTexture(location: WebGLUniformLocation, value: WebGLBaseTexture[]): void {
    const firstUnit = this.state.getCurrentTextureUnit() + 1
    value.forEach((texture, i) => {
      const textureUnit = firstUnit + i
      this.state.setCurrentTextureUnit(textureUnit)
      bindTexture(this.gl, texture.texture, textureUnit)
    })
    this.gl.uniform1iv(location, range(firstUnit, this.state.getCurrentTextureUnit() + 1))
  }
}

const flatten = <T extends TypedArray>(arrays: T[] | T): T => {
  if (!Array.isArray(arrays)) {
    return arrays
  }
  if (!arrays.length) {
    return new Float32Array() as T // Create an empty Float32Array by default.
  }
  const ArrayConstructor = getArrayConstructor(arrays[0])
  const length = arrays[0].length * arrays.length
  const flattened = new ArrayConstructor(length) as T
  arrays.forEach((array, i) => flattened.set(array, i * array.length))
  return flattened
}

const getArrayConstructor = <T extends TypedArray>(array: T) => {
  if (array instanceof Int8Array) return Int8Array
  if (array instanceof Uint8Array) return Uint8Array
  if (array instanceof Int16Array) return Int16Array
  if (array instanceof Uint16Array) return Uint16Array
  if (array instanceof Int32Array) return Int32Array
  if (array instanceof Uint32Array) return Uint32Array
  if (array instanceof Float32Array) return Float32Array
  throw new Error("Unsupported array constructor")
}
