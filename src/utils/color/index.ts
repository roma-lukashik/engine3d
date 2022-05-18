import { Vector3 } from '../../math/types'
import { divide } from '../../math/vector3'

const MAX_BYTE = 255

export const hexToNormRgb = (hex: number): Vector3 => normalize(hexToRgb(hex))

export const hexToRgb = (hex: number): Vector3 => {
  const r = hex >> 16 & MAX_BYTE
  const g = hex >> 8 & MAX_BYTE
  const b = hex & MAX_BYTE
  return [r, g, b]
}

const normalize = (rgb: Vector3): Vector3 => divide(rgb, MAX_BYTE)
