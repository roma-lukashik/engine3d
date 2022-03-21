import { bindBufferToVertexAttribute, ExtendedAttribute } from '../gl'

type Attribute = {
  location: number;
  info: WebGLActiveInfo;
}

type Props = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
}

export class Attributes {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly data: Record<string, Attribute> = {}

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractAttributes()
  }

  public update(attributes: Record<string, ExtendedAttribute>): void {
    Object.values(this.data).forEach(({ location, info }) => {
      const attribute = attributes[info.name]
      this.gl.bindBuffer(attribute.target, attribute.buffer)
      bindBufferToVertexAttribute(this.gl, attribute, location)
    })
  }

  private extractAttributes(): void {
    const activeAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES) as number
    for (let i = 0; i < activeAttributes; i++) {
      const info = this.gl.getActiveAttrib(this.program, i)
      if (info === null) {
        return
      }
      const location = this.gl.getAttribLocation(this.program, info.name)
      if (location === null) {
        return
      }
      this.data[info.name] = { info, location }
    }
  }
}
