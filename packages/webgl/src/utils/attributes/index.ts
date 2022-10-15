import { WebglVertexAttribute } from "@webgl/utils/attribute"

type Attribute<T extends AttributeValues> = {
  location: number
  name: keyof T
}

type Props = {
  gl: WebGLRenderingContext
  program: WebGLProgram
}

export type AttributeValues = Record<string, WebglVertexAttribute>

export class Attributes<A extends AttributeValues> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly data: Attribute<A>[] = []

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractAttributes()
  }

  public update(attributes: Partial<A & { index: WebglVertexAttribute; }>): void {
    this.data.forEach(({ location, name }) => {
      const attribute = attributes[name]
      attribute?.bindBuffer()
      attribute?.bindBufferToVertexAttribute(location)
    })
    attributes.index?.bindBuffer()
  }

  private extractAttributes(): void {
    const activeAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES) as number
    for (let i = 0; i < activeAttributes; i++) {
      const info = this.gl.getActiveAttrib(this.program, i)
      if (info === null) {
        continue
      }
      const location = this.gl.getAttribLocation(this.program, info.name)
      if (location === -1) {
        continue
      }
      this.data.push({ location, name: info.name })
    }
  }
}
