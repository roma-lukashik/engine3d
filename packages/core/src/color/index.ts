import { Vector3, Vector3Tuple } from "@math/vector3"
import { Vector4 } from "@math/vector4"

export class Color {
  public readonly rgb: Vector3
  public readonly rgba: Vector4

  constructor(hex: number, opacity = 1) {
    const [r, g, b] = hexToRgb(hex)

    this.rgb = new Vector3(r, g, b)
    this.rgba = new Vector4(r, g, b, opacity)
  }
}

const MAX_BYTE = 255

const hexToRgb = (hex: number): Vector3Tuple => {
  const r = (hex >> 16 & MAX_BYTE) / MAX_BYTE
  const g = (hex >> 8 & MAX_BYTE) / MAX_BYTE
  const b = (hex & MAX_BYTE) / MAX_BYTE
  return [r, g, b]
}
