type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Uint32Array
  | Float32Array

type Props = {
  array: TypedArray
  itemSize: number
  normalized?: boolean
  stride?: number
  offset?: number
  divisor?: number
}

export class BufferAttribute {
  public array: TypedArray
  public itemSize: number
  public normalized: boolean
  public count: number
  public stride: number
  public offset: number
  public divisor: number
  public type: number

  constructor({
    array,
    itemSize,
    normalized = false,
    stride = 0,
    offset = 0,
    divisor = 0,
  }: Props) {
    this.array = array
    this.itemSize = itemSize
    this.normalized = normalized
    this.stride = stride
    this.offset = offset
    this.divisor = divisor
    this.count = array.length / itemSize
    this.type = 4 // Replace
  }
}
