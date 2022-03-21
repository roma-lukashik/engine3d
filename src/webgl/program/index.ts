import { compileShader } from '../utils/gl'
import { UniformValues, Uniforms } from '../utils/uniform'
import { Attributes } from '../utils/attribute'

type Props = {
  gl: WebGLRenderingContext;
  vertex: string;
  fragment: string;
}

export type Program<U extends UniformValues> = {
  readonly uniforms: Uniforms<U>;
  readonly attributes: Attributes;
  use(): void;
}

export class BaseProgram<U extends UniformValues> implements Program<U> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram

  public readonly uniforms: Uniforms<U>
  public readonly attributes: Attributes

  constructor({
    gl,
    vertex,
    fragment,
  }: Props) {
    const vertexShader = compileShader(gl, vertex, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(gl, fragment, gl.FRAGMENT_SHADER)
    const program = gl.createProgram()

    if (!program) {
      throw new Error('Cannot create a program')
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    this.gl = gl
    this.program = program
    this.uniforms = new Uniforms({ gl, program })
    this.attributes = new Attributes({ gl, program })
  }

  public use(): void {
    this.gl.useProgram(this.program)
  }
}
