import { ExtendedAttribute } from '../gl'
import { Model } from '../../../core/types'

type Attribute = {
  location: number;
  name: keyof Model;
}

type Props = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
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

  public update(attributes: Record<keyof Model, ExtendedAttribute>): void {
    this.data.forEach(({ location, name }) => {
      const attribute = attributes[name]
      this.gl.bindBuffer(attribute.target, attribute.buffer)
      this.bindBufferToVertexAttribute(attribute, location)
    })
    if (attributes.index) {
      this.gl.bindBuffer(attributes.index.target, attributes.index.buffer)
    }
  }

  private extractAttributes(): void {
    const activeAttributes = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES) as number
    for (let i = 0; i < activeAttributes; i++) {
      const info = this.gl.getActiveAttrib(this.program, i)
      if (info === null) {
        continue
      }
      const location = this.gl.getAttribLocation(this.program, info.name)
      if (location === null) {
        continue
      }
      this.data.push({ location, name: info.name as keyof Model })
    }
  }

  private bindBufferToVertexAttribute(attribute: ExtendedAttribute, location: number): void {
    const numLoc = this.bufferSize(attribute.type)
    const size = attribute.size / numLoc
    const stride = numLoc === 1 ? 0 : numLoc ** 3
    const offset = numLoc === 1 ? 0 : numLoc ** 2

    for (let i = 0; i < numLoc; i++) {
      this.gl.vertexAttribPointer(
        location + i,
        size,
        attribute.type,
        attribute.normalized,
        attribute.stride + stride,
        attribute.offset + i * offset,
      )
      this.gl.enableVertexAttribArray(location + i)
    }
  }

  private bufferSize(type: number): number {
    switch (type) {
      case this.gl.FLOAT_MAT2: return 2
      case this.gl.FLOAT_MAT3: return 3
      case this.gl.FLOAT_MAT4: return 4
      default: return 1
    }
  }
}
