import { BufferViewTarget, ComponentType } from "@core/loaders/types"
import { TypedArray } from "@core/types"
import { getArrayComponentType } from "@core/bufferAttribute/utils"

type Props = {
  array: TypedArray
  itemSize: number
  normalized?: boolean
  stride?: number
  offset?: number
  target?: BufferViewTarget
}

export class BufferAttribute {
  public array: TypedArray
  public itemSize: number
  public type: ComponentType
  public normalized: boolean
  public count: number
  public stride: number
  public offset: number
  public target: BufferViewTarget

  public constructor({
    array,
    itemSize,
    normalized = false,
    stride = 0,
    offset = 0,
    target = BufferViewTarget.ArrayBuffer,
  }: Props) {
    this.array = array
    this.itemSize = itemSize
    this.type = getArrayComponentType(array)
    this.normalized = normalized
    this.stride = stride
    this.offset = offset
    this.count = array.length / itemSize
    this.target = target
  }

  public getBufferElement(index: number): TypedArray {
    const start = this.offset + index * (this.stride ?? this.itemSize)
    const end = start + this.itemSize
    return this.array.slice(start, end)
  }
}
