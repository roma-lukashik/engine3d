import { UniformValues, Uniforms } from "@webgl/utils/uniforms"
import { Attributes } from "@webgl/utils/attributes"

type Props = {
  gl: WebGLRenderingContext
  vertex: string
  fragment: string
}

export class Program<U extends UniformValues = UniformValues> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram

  public readonly uniforms: Uniforms<U>
  public readonly attributes: Attributes

  constructor({
    gl,
    vertex,
    fragment,
  }: Props) {
    this.gl = gl

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
    this.uniforms = new Uniforms({ gl, program })
    this.attributes = new Attributes({ gl, program })
  }

  public use(): void {
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
