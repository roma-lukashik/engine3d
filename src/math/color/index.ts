import { divide, Vector3 } from '../vector3'

export const hex2rgb = (hex: number): Vector3 => {
  const r = hex >> 16 & 255
  const g = hex >> 8 & 255
  const b = hex & 255
  return [r, g, b]
}

export const hex2rbgNormalized = (hex: number): Vector3 => divide(hex2rgb(hex), 255)
