import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { Geometry } from "@core/geometry"

type Attribute = {
  location: number
  name: keyof Geometry
}

type Props = {
  gl: WebGLRenderingContext
  program: WebGLProgram
}

export class Attributes {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly data: Attribute[] = []

  constructor({ gl, program }: Props) {
    this.gl = gl
    this.program = program
    this.extractAttributes()
  }

  public update(attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>>): void {
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
      this.data.push({ location, name: info.name as keyof Geometry })
    }
  }
}
