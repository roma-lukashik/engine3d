import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { TypedArray } from "@core/types"

export class WebglVertexAttribute {
  private readonly gl: WebGLRenderingContext
  private readonly array: TypedArray
  private readonly buffer: WebGLBuffer | null

  public readonly itemSize: number
  public readonly type: number
  public readonly normalized: boolean
  public readonly stride: number
  public readonly offset: number
  public readonly count: number
  public readonly target: BufferViewTarget

  constructor(gl: WebGLRenderingContext, attribute: BufferAttribute) {
    Object.assign(this, attribute)

    this.gl = gl
    this.type = this.getType()
    this.buffer = gl.createBuffer()

    this.bindBuffer()
    this.assignBufferData()
  }

  public bindBuffer(): void {
    this.gl.bindBuffer(this.target, this.buffer)
  }

  public bindBufferToVertexAttribute(location: number): void {
    const locationSize = this.bufferSize
    const size = this.itemSize / locationSize
    const stride = locationSize === 1 ? 0 : locationSize ** 3

    for (let i = 0; i < locationSize; i++) {
      this.gl.vertexAttribPointer(
        location + i,
        size,
        this.type,
        this.normalized,
        this.stride + stride,
        // TODO check for stride=0
        (this.offset + (size / locationSize) * i) * this.array.BYTES_PER_ELEMENT,
      )
      this.gl.enableVertexAttribArray(location + i)
    }
  }

  private get bufferSize(): number {
    switch (this.type) {
      case this.gl.FLOAT_MAT2: return 2
      case this.gl.FLOAT_MAT3: return 3
      case this.gl.FLOAT_MAT4: return 4
      default: return 1
    }
  }

  private getType(): number {
    if (this.array instanceof Float32Array) return this.gl.FLOAT
    if (this.array instanceof Uint32Array) return this.gl.UNSIGNED_INT
    if (this.array instanceof Uint16Array) return this.gl.UNSIGNED_SHORT
    return this.gl.UNSIGNED_BYTE
  }

  private assignBufferData(): void {
    this.gl.bufferData(this.target, this.array, this.gl.STATIC_DRAW)
  }
}
