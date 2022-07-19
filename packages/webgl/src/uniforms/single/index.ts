import { Uniform, UniformSetter } from "@webgl/uniforms/types"
import { WebGLBaseTexture } from "@webgl/textures/types"
import { bindTexture } from "@webgl/textures/utils"
import { WebglRenderState } from "@webgl/utils/renderState"

export class SingleUniform<T> implements Uniform<T> {
  public readonly name: string

  private readonly gl: WebGLRenderingContext
  private readonly state: WebglRenderState
  private readonly location: WebGLUniformLocation
  private readonly uniformSetter: UniformSetter
  private value: T

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    name: string,
    value: T,
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

  public setValue(value: T): void {
    this.value = value
    this.uniformSetter(this.location, value)
  }

  private getUniformSetter(type: number): UniformSetter {
    const gl = this.gl
    switch (type) {
      case gl.FLOAT_VEC2: return (location, value) => gl.uniform2fv(location, value)
      case gl.FLOAT_VEC3: return (location, value) => gl.uniform3fv(location, value)
      case gl.FLOAT_VEC4: return (location, value) => gl.uniform4fv(location, value)

      case gl.FLOAT: return (location, value) => gl.uniform1f(location, value)
      case gl.BOOL: case gl.INT: return (location, value) => gl.uniform1i(location, value)

      case gl.SAMPLER_2D: return (location, value) => this.setSampler2DTexture(location, value)

      case gl.BOOL_VEC2: case gl.INT_VEC2: return (location, value) => gl.uniform2iv(location, value)
      case gl.BOOL_VEC3: case gl.INT_VEC3: return (location, value) => gl.uniform3iv(location, value)
      case gl.BOOL_VEC4: case gl.INT_VEC4: return (location, value) => gl.uniform4iv(location, value)

      case gl.FLOAT_MAT2: return (location, value) => gl.uniformMatrix2fv(location, false, value)
      case gl.FLOAT_MAT3: return (location, value) => gl.uniformMatrix3fv(location, false, value)
      case gl.FLOAT_MAT4: return (location, value) => gl.uniformMatrix4fv(location, false, value)

      default: throw new Error(`Unsupported type ${type}.`)
    }
  }

  private setSampler2DTexture(location: WebGLUniformLocation, value: WebGLBaseTexture): void {
    const textureUnit = this.state.getCurrentTextureUnit() + 1
    this.state.setCurrentTextureUnit(textureUnit)
    bindTexture(this.gl, value.texture, textureUnit)
    this.gl.uniform1i(location, textureUnit)
  }
}
