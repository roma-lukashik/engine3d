import { SingleUniform } from "@webgl/uniforms/single"
import { Uniform } from "@webgl/uniforms/types"
import { RenderState } from "@webgl/utils/state"

export class StructureUniform<T extends Record<string, unknown>> implements Uniform<T> {
  public readonly name: string

  private readonly structProperty: keyof T
  private readonly uniform: SingleUniform<T[keyof T]>

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    name: string,
    location: WebGLUniformLocation,
    type: number,
    structProperty: keyof T,
  ) {
    this.name = name
    this.structProperty = structProperty
    this.uniform = new SingleUniform(gl, state, name, location, type)
  }

  public setValue(value: T): void {
    this.uniform.setValue(value[this.structProperty])
  }
}
