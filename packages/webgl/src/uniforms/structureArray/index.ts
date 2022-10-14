import { Uniform } from "@webgl/uniforms/types"
import { WebglRenderState } from "@webgl/utils/renderState"
import { StructureUniform } from "@webgl/uniforms/structure"

export class StructureArrayUniform<T extends Record<string, unknown>> implements Uniform<T[]> {
  public name: string

  private readonly uniform: StructureUniform<T>
  private readonly arrayIndex: number

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    name: string,
    value: T[keyof T],
    location: WebGLUniformLocation,
    type: number,
    structProperty: keyof T,
    arrayIndex: number,
  ) {
    this.name = name
    this.arrayIndex = arrayIndex
    this.uniform = new StructureUniform(gl, state, name, value, location, type, structProperty)
  }

  public setValue(value: T[]): void {
    this.uniform.setValue(value[this.arrayIndex])
  }
}
