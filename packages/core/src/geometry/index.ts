import { MeshPrimitiveAttributes } from "@core/loaders/types"
import { BufferAttribute } from "@core/bufferAttribute"
import { forEachKey } from "@utils/object"

export class Geometry {
  public position: BufferAttribute
  public normal?: BufferAttribute
  public tangent?: BufferAttribute
  public uv?: BufferAttribute
  public uv2?: BufferAttribute
  public color?: BufferAttribute
  public skinWeight?: BufferAttribute
  public skinIndex?: BufferAttribute
  public index?: BufferAttribute

  constructor(data: Partial<Record<keyof MeshPrimitiveAttributes | "index", BufferAttribute>> = {}) {
    forEachKey(data, (key, bufferAttribute) => this[attributesMapping[key]] = bufferAttribute)
  }
}

const attributesMapping: Record<keyof MeshPrimitiveAttributes | "index", keyof Geometry> = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex",
  index: "index",
}
