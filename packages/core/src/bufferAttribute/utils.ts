import { TypedArray } from "@core/types"
import { ComponentType } from "@core/loaders/types"

export const getArrayComponentType = (array: TypedArray): ComponentType => {
  if (array instanceof Float32Array) return ComponentType.Float32
  if (array instanceof Uint32Array) return ComponentType.Uint32
  if (array instanceof Int32Array) return ComponentType.Int32
  if (array instanceof Uint16Array) return ComponentType.Uint16
  if (array instanceof Int16Array) return ComponentType.Int16
  if (array instanceof Uint8Array) return ComponentType.Uint8
  return ComponentType.Int8
}

export const TypedArrayByComponentType = {
  [ComponentType.Int8]: Int8Array,
  [ComponentType.Uint8]: Uint8Array,
  [ComponentType.Int16]: Int16Array,
  [ComponentType.Uint16]: Uint16Array,
  [ComponentType.Int32]: Int32Array,
  [ComponentType.Uint32]: Uint32Array,
  [ComponentType.Float32]: Float32Array,
}
