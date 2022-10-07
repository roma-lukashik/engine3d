import { MeshPrimitiveAttributes } from "@core/loaders/types"
import { BufferAttribute } from "@core/bufferAttribute"
import { forEachKey } from "@utils/object"

export class Geometry {
  public position: BufferAttribute
  public normal?: BufferAttribute
  public tangent?: BufferAttribute
  public uv?: BufferAttribute
  public uv2?: BufferAttribute
  public uv3?: BufferAttribute
  public uv4?: BufferAttribute
  public uv5?: BufferAttribute
  public uv6?: BufferAttribute
  public uv7?: BufferAttribute
  public uv8?: BufferAttribute
  public uv9?: BufferAttribute
  public uv10?: BufferAttribute
  public color?: BufferAttribute
  public skinWeight?: BufferAttribute
  public skinIndex?: BufferAttribute
  public index?: BufferAttribute

  public constructor(data: Partial<Record<keyof MeshPrimitiveAttributes | "index", BufferAttribute>> = {}) {
    forEachKey(data, (key, bufferAttribute) => this[attributesMapping[key]] = bufferAttribute)
  }
}

// @ts-ignore
const attributesMapping: Record<keyof MeshPrimitiveAttributes | "index", keyof Geometry> = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  TEXCOORD_2: "uv3",
  TEXCOORD_3: "uv4",
  TEXCOORD_4: "uv5",
  TEXCOORD_5: "uv6",
  TEXCOORD_6: "uv7",
  TEXCOORD_7: "uv8",
  TEXCOORD_8: "uv9",
  TEXCOORD_9: "uv10",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex",
  index: "index",
}
