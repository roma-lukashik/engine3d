import { BufferAttribute } from "@core/bufferAttribute"
import { LocationAttribute } from "@webgl/attributes/locationAttribute"

export type AttributeValues<K extends string = string> = Record<K, BufferAttribute>

export class Attributes<T extends AttributeValues<K>, K extends string = string> {
  private readonly gl: WebGLRenderingContext
  private readonly program: WebGLProgram
  private readonly locationAttributes: LocationAttribute<K>[] = []
  private readonly buffers: WeakMap<BufferAttribute, WebGLBuffer | null> = new WeakMap()

  public constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
  ) {
    this.gl = gl
    this.program = program
    this.extractAttributes()
  }

  public update(attributes: Partial<T> & Partial<AttributeValues<"index">>): void {
    this.locationAttributes.forEach(({ location, type, name }) => {
      const attribute = attributes[name]
      if (attribute) {
        const buffer = this.getBuffer(attribute!)
        this.bindBuffer(attribute, buffer)
        this.bindBufferToVertexAttribute(attribute, location, type)
      }
    })
    if (attributes.index) {
      const indexBuffer = this.getBuffer(attributes.index)
      this.bindBuffer(attributes.index, indexBuffer)
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
      if (location === -1) {
        continue
      }
      this.locationAttributes.push(new LocationAttribute(location, info.type, info.name as K))
    }
  }

  private getBuffer(attribute: AttributeValues<K>[K]): WebGLBuffer | null {
    if (!this.buffers.has(attribute)) {
      const buffer = this.gl.createBuffer()
      this.buffers.set(attribute, buffer)
      this.bindBuffer(attribute, buffer)
      this.assignBufferData(attribute)
    }
    return this.buffers.get(attribute) ?? null
  }

  private bindBuffer(attribute: BufferAttribute, buffer: WebGLBuffer | null): void {
    this.gl.bindBuffer(attribute.target, buffer)
  }

  private assignBufferData(attribute: BufferAttribute): void {
    this.gl.bufferData(attribute.target, attribute.array, this.gl.STATIC_DRAW)
  }

  private bindBufferToVertexAttribute(attribute: BufferAttribute, location: number, type: number): void {
    const locationSize = this.getBufferSize(type)
    const size = attribute.itemSize / locationSize
    const stride = locationSize === 1 ? 0 : locationSize ** 3

    for (let i = 0; i < locationSize; i++) {
      this.gl.vertexAttribPointer(
        location + i,
        size,
        attribute.type,
        attribute.normalized,
        attribute.stride + stride,
        // TODO check for stride=0
        (attribute.offset + (size / locationSize) * i) * attribute.itemSize,
      )
      this.gl.enableVertexAttribArray(location + i)
    }
  }

  private getBufferSize(type: number): number {
    switch (type) {
      case this.gl.FLOAT_MAT2: return 2
      case this.gl.FLOAT_MAT3: return 3
      case this.gl.FLOAT_MAT4: return 4
      default: return 1
    }
  }
}
