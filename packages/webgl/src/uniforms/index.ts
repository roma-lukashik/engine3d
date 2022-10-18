import { SingleUniform } from "@webgl/uniforms/single"
import { Uniform } from "@webgl/uniforms/types"
import { ArrayUniform } from "@webgl/uniforms/array"
import { StructureUniform } from "@webgl/uniforms/structure"
import { StructureArrayUniform } from "@webgl/uniforms/structureArray"
import { RenderState } from "@webgl/utils/state"

export type UniformValues = Record<string, any>

export class Uniforms<U extends UniformValues> {
  private readonly gl: WebGLRenderingContext
  private readonly state: RenderState
  private readonly program: WebGLProgram
  private readonly uniforms: Uniform<U[keyof U]>[] = []

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    program: WebGLProgram,
  ) {
    this.gl = gl
    this.state = state
    this.program = program
    this.extractUniforms()
  }

  public setValues(uniforms: Partial<U>): void {
    this.uniforms.forEach((uniform) => {
      const u = uniforms[uniform.name]
      if (u !== undefined) {
        uniform.setValue(u)
      }
    })
  }

  private extractUniforms() {
    const activeUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS) as number
    for (let i = 0; i < activeUniforms; i++) {
      const activeInfo = this.gl.getActiveUniform(this.program, i)
      if (activeInfo === null) {
        continue
      }
      const location = this.gl.getUniformLocation(this.program, activeInfo.name)
      if (location === null) {
        continue
      }
      const value = this.gl.getUniform(this.program, location)
      const split = activeInfo.name.match(/(\w+)/g)
      if (!split) {
        throw new Error(`Uniform ${activeInfo.name} contains an error.`)
      }
      const type = activeInfo.type
      const uniform = this.parseUniform(split, location, type, value)
      this.uniforms.push(uniform)
    }
  }

  private parseUniform(split: string[], location: WebGLUniformLocation, type: number, value: any): Uniform<U[keyof U]> {
    if (split.length === 3) {
      return new StructureArrayUniform(this.gl, this.state, split[0], location, type, split[2], Number(split[1]))
    }
    if (split.length === 2 && isNaN(Number(split[1]))) {
      return new StructureUniform(this.gl, this.state, split[0], location, type, split[1])
    }
    if (split.length === 2) {
      return new ArrayUniform(this.gl, this.state, split[0], value, location, type)
    }
    return new SingleUniform(this.gl, this.state, split[0], location, type)
  }
}
