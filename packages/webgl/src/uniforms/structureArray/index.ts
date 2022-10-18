import { Uniform } from "@webgl/uniforms/types"
import { RenderState } from "@webgl/utils/state"
import { StructureUniform } from "@webgl/uniforms/structure"

export class StructureArrayUniform<T extends Record<string, unknown>> implements Uniform<T[]> {
  public name: string

  private readonly uniform: StructureUniform<T>
  private readonly arrayIndex: number

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    name: string,
    location: WebGLUniformLocation,
    type: number,
    structProperty: keyof T,
    arrayIndex: number,
  ) {
    this.name = name
    this.arrayIndex = arrayIndex
    this.uniform = new StructureUniform(gl, state, name, location, type, structProperty)
  }

  public setValue(value: T[]): void {
    this.uniform.setValue(value[this.arrayIndex])
  }
}
