import { compileShader } from '../utils/gl'
import { extractUniforms, Uniform } from '../utils/uniform'
import { Attribute, extractAttributes } from '../utils/attribute'

type ProgramOptions = {
  gl: WebGLRenderingContext;
  vertex: string;
  fragment: string;
}

export type Program = {
  readonly uniforms: Record<string, Uniform>;
  readonly attributes: Record<string, Attribute>;
  use: () => void;
  updateUniforms: (values: Record<string, any>) => void;
}

export const createProgram = (options: ProgramOptions): Program => {
  return new ProgramImpl(options)
}

class ProgramImpl implements Program {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram

  public readonly uniforms: Record<string, Uniform>
  public readonly attributes: Record<string, Attribute>

  constructor({
    gl,
    vertex,
    fragment,
  }: ProgramOptions) {
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
    this.uniforms = extractUniforms(gl, program)
    this.attributes = extractAttributes(gl, program)
  }

  public use(): void {
    this.gl.useProgram(this.program)
  }

  public updateUniforms(values: Record<string, any>): void {
    Object.entries(values).forEach(([name, value]) => {
      const uniform = this.uniforms[name]
      if (uniform) {
        uniform.value = value
      }
    })
  }
}
