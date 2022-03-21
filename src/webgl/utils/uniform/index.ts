import { bindTexture } from '../../textures/utils'
import { WebGLBaseTexture } from '../../textures/types'

type Uniform<T extends any = any> = {
  value: T;
  type: number;
  location: WebGLUniformLocation;
  isTexture?: boolean;
  isArray?: boolean;
}

export type UniformValues = {
  [key: string]: any;
}

type Props = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
}

export class Uniforms<U extends UniformValues> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly data = {} as { [key in keyof U]: Uniform<U[key]> }

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractUniforms()
  }

  public update() {
    let textureSlot = 0
    Object.values(this.data).forEach((uniform) => {
      if (isTextureUniform(uniform)) {
        bindTexture(this.gl, uniform.value.texture, textureSlot)
        setUniform(this.gl, { ...uniform, value: textureSlot })
        textureSlot++
      } else {
        setUniform(this.gl, uniform)
      }
    })
  }

  public setValues(values: U): void {
    Object.entries(values).forEach(([key, value]) => {
      if (this.data[key]) {
        this.data[key].value = this.data[key].isArray ? value.flat() : value
      }
    })
  }

  private extractUniforms() {
    const activeUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS) as number
    for (let i = 0; i < activeUniforms; i++) {
      const info = this.gl.getActiveUniform(this.program, i)
      if (info === null) {
        return
      }
      const location = this.gl.getUniformLocation(this.program, info?.name)
      if (location === null) {
        return
      }
      const name = info.name.replace('[0]', '') as keyof U
      this.data[name] = {
        location,
        type: info.type,
        isTexture: isTextureType(this.gl, info.type),
        isArray: info.name.includes('[0]'),
        value: this.gl.getUniform(this.program, location),
      }
    }
  }
}

const isTextureUniform = (uniform: Uniform): uniform is Uniform<WebGLBaseTexture> => {
  return !!uniform.isTexture
}

const isTextureType = (gl: WebGLRenderingContext, type: number): boolean => {
  return type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE
}

const setUniform = (gl: WebGLRenderingContext, { type, location, value }: Uniform): void => {
  switch (type) {
    case gl.FLOAT:
      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value)
    case gl.FLOAT_VEC2:
      return gl.uniform2fv(location, value)
    case gl.FLOAT_VEC3:
      return gl.uniform3fv(location, value)
    case gl.FLOAT_VEC4:
      return gl.uniform4fv(location, value)
    case gl.BOOL:
    case gl.INT:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value)
    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
      return gl.uniform2iv(location, value)
    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
      return gl.uniform3iv(location, value)
    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
      return gl.uniform4iv(location, value)
    case gl.FLOAT_MAT2:
      return gl.uniformMatrix2fv(location, false, value)
    case gl.FLOAT_MAT3:
      return gl.uniformMatrix3fv(location, false, value)
    case gl.FLOAT_MAT4:
      return gl.uniformMatrix4fv(location, false, value)
  }
}
