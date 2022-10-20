import { UniformValues, Uniforms } from "@webgl/uniforms"
import { Attributes, AttributeValues } from "@webgl/utils/attributes"
import { RenderState } from "@webgl/utils/state"

export class Program<U extends UniformValues, A extends AttributeValues> {
  public readonly uniforms: Uniforms<U>
  public readonly attributes: Attributes<A>

  private readonly gl: WebGLRenderingContext
  private readonly state: RenderState
  private readonly program: WebGLProgram

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    vertex: string,
    fragment: string,
  ) {
    this.gl = gl
    this.state = state

    const vertexShader = this.compileShader(vertex, gl.VERTEX_SHADER)
    const fragmentShader = this.compileShader(fragment, gl.FRAGMENT_SHADER)
    const program = gl.createProgram()

    if (!program) {
      throw new Error("Cannot create a program")
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    this.program = program
    this.uniforms = new Uniforms(gl, state, program)
    this.attributes = new Attributes(gl, program)
  }

  public use(): void {
    this.state.resetTextureUnit()
    this.gl.useProgram(this.program)
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type)
    if (!shader) {
      throw new Error("Cannot create a shader")
    }
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    return shader
  }
}
