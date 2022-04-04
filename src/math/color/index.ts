import { divide, Vector3 } from '../vector3'
import { Vector4 } from '../vector4'

const MAX_BYTE = 255

export class Color {
  public readonly rgb: Vector3
  public readonly rgba: Vector4
  public readonly normalized: Vector3

  constructor(hex: number) {
    this.rgb = hex2rgb(hex)
    this.rgba = [...this.rgb, MAX_BYTE]
    this.normalized = normalize(this.rgb)
  }
}

const hex2rgb = (hex: number): Vector3 => {
  const r = hex >> 16 & MAX_BYTE
  const g = hex >> 8 & MAX_BYTE
  const b = hex & MAX_BYTE
  return [r, g, b]
}

const normalize = (rbg: Vector3): Vector3 => divide(rbg, MAX_BYTE)
