import { MeshPrimitiveAttributes } from "@core/loaders/types"
import { BufferAttribute } from "@core/bufferAttribute"
import { forEachKey } from "@utils/object"
import { TypedArray } from "@core/types"
import { TypedArrayByComponentType } from "@core/bufferAttribute/utils"

export class Geometry extends autoImplement<GeometryAttributes>() {
  public readonly positionPoints: TypedArray

  public constructor(data: Partial<Record<keyof MeshPrimitiveAttributes | "index", BufferAttribute>> = {}) {
    super()
    forEachKey(data, (key, bufferAttribute) => {
      const attributeKey = getAttributeKey(key)
      if (attributeKey) {
        this[attributeKey] = bufferAttribute
      }
    })
    this.positionPoints = this.getPositionPoints()
  }

  private getPositionPoints(): TypedArray {
    const { position, index } = this
    const TypedArrayConstructor = TypedArrayByComponentType[position.type]
    if (index) {
      const points = new TypedArrayConstructor(index.count * position.itemSize)
      index.forEach(([positionIndex], i) => {
        points.set(position.getBufferElement(positionIndex), i * position.itemSize)
      })
      return points
    } else {
      const points = new TypedArrayConstructor(position.count * position.itemSize)
      position.forEach((pointArray, i) => points.set(pointArray, i * position.itemSize))
      return points
    }
  }
}

type Digits = "" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type GeometryAttributes = {
  position: BufferAttribute
  normal?: BufferAttribute
  tangent?: BufferAttribute
  index?: BufferAttribute
} & {
  [K in `uv${Digits}`]?: BufferAttribute
} & {
  [K in `color${Digits}`]?: BufferAttribute
} & {
  [K in `skinWeight${Digits}`]?: BufferAttribute
} & {
  [K in `skinIndex${Digits}`]?: BufferAttribute
}

function autoImplement<T>(): new () => T {
  return class { } as any
}

function getAttributeKey(key: keyof MeshPrimitiveAttributes | "index"): keyof GeometryAttributes | undefined {
  if (key === "POSITION") return "position"
  if (key === "NORMAL") return "normal"
  if (key === "TANGENT") return "tangent"
  if (key === "index") return "index"
  const digit = getDigit(key)
  if (digit === undefined) return
  if (key.includes("TEXCOORD_")) return `uv${digit}`
  if (key.includes("COLOR_")) return `color${digit}`
  if (key.includes("WEIGHTS_")) return `skinWeight${digit}`
  if (key.includes("JOINTS_")) return `skinIndex${digit}`
  return
}

function getDigit(string: string): Digits | undefined {
  const digit = Number(string[string.length - 1])
  if (isNaN(digit)) {
    return
  }
  return digit === 0 ? "" : digit + 1 as Digits
}
