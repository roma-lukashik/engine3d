type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Uint32Array
  | Float32Array

export class BufferAttribute {
  public count: number

  constructor(
    public array: TypedArray,
    public itemSize: number,
    public normalized: boolean,
  ) {
    this.count = array.length / itemSize
  }
}
