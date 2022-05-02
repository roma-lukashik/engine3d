import { divide, Vector3 } from '../../math/vector3'

const MAX_BYTE = 255

export const normHex2rgb = (hex: number): Vector3 => normalize(hex2rgb(hex))

export const hex2rgb = (hex: number): Vector3 => {
  const r = hex >> 16 & MAX_BYTE
  const g = hex >> 8 & MAX_BYTE
  const b = hex & MAX_BYTE
  return [r, g, b]
}

export const rbg2hex = ([r, g, b]: Vector3): number => {
  return (r * MAX_BYTE << 16) + (g * MAX_BYTE << 8) + b * MAX_BYTE
}

const normalize = (rgb: Vector3): Vector3 => divide(rgb, MAX_BYTE)
