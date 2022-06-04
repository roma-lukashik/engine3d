import { Vector3 } from "@math/types"

const MAX_BYTE = 255

export const hexToRgb = (hex: number): Vector3 => {
  const r = (hex >> 16 & MAX_BYTE) / MAX_BYTE
  const g = (hex >> 8 & MAX_BYTE) / MAX_BYTE
  const b = (hex & MAX_BYTE) / MAX_BYTE
  return [r, g, b]
}
