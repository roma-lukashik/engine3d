import { BufferAttribute } from '../../../core/loaders/gltf/bufferAttribute'

export class WebglVertexAttribute {
  private readonly gl: WebGLRenderingContext
  private readonly array: BufferAttribute['array']
  private readonly buffer: WebGLBuffer | null

  public readonly itemSize: number
  public readonly type: number
  public readonly normalized: boolean
  public readonly stride: number
  public readonly offset: number
  public readonly target: number
  public readonly count: number

  constructor(gl: WebGLRenderingContext, attribute: BufferAttribute) {
    Object.assign(this, attribute)

    this.gl = gl;
    this.type = this.getType()
    this.buffer = gl.createBuffer()

    this.bindBuffer()
    this.assignBufferData()
  }

  public bindBuffer(): void {
    this.gl.bindBuffer(this.target, this.buffer)
  }

  public bindBufferToVertexAttribute(location: number): void {
    const numLoc = this.bufferSize
    const size = this.itemSize / numLoc
    const stride = numLoc === 1 ? 0 : numLoc ** 3
    const offset = numLoc === 1 ? 0 : numLoc ** 2

    for (let i = 0; i < numLoc; i++) {
      this.gl.vertexAttribPointer(
        location + i,
        size,
        this.type,
        this.normalized,
        this.stride + stride,
        this.offset + i * offset,
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
    if (this.array.constructor === Float32Array) {
      return this.gl.FLOAT
    }
    if (this.array.constructor === Uint16Array) {
      return this.gl.UNSIGNED_SHORT
    }
    return this.gl.UNSIGNED_INT
  }

  private assignBufferData(): void {
    this.gl.bufferData(this.target, this.array, this.gl.STATIC_DRAW)
  }
}
