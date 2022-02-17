import { Matrix4 } from '../matrix4'

type Vector4 = [number, number, number, number]

export const vector4 = (x: number, y: number, z: number, w: number): Vector4 => [x, y, z, w]

export const multiplyByMatrix = (v: Vector4, m: Matrix4): Vector4 => {
  const dst = []
  for (let i = 0; i < 4; ++i) {
    dst[i] = 0.0
    for (let j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i]
    }
  }
  return dst as Vector4
}
