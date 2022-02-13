export type Matrix4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]

export const m00 = (m: Matrix4) => m[0]
export const m01 = (m: Matrix4) => m[1]
export const m02 = (m: Matrix4) => m[2]
export const m03 = (m: Matrix4) => m[3]

export const m10 = (m: Matrix4) => m[4]
export const m11 = (m: Matrix4) => m[5]
export const m12 = (m: Matrix4) => m[6]
export const m13 = (m: Matrix4) => m[7]

export const m20 = (m: Matrix4) => m[8]
export const m21 = (m: Matrix4) => m[9]
export const m22 = (m: Matrix4) => m[10]
export const m23 = (m: Matrix4) => m[11]

export const m30 = (m: Matrix4) => m[12]
export const m31 = (m: Matrix4) => m[13]
export const m32 = (m: Matrix4) => m[14]
export const m33 = (m: Matrix4) => m[15]

export const identity = (): Matrix4 => [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]

export const det = (m: Matrix4): number =>
  (m00(m) * m11(m) - m01(m) * m10(m)) * (m22(m) * m33(m) - m23(m) * m32(m)) -
  (m00(m) * m12(m) - m02(m) * m10(m)) * (m21(m) * m33(m) - m23(m) * m31(m)) +
  (m00(m) * m13(m) - m03(m) * m10(m)) * (m21(m) * m32(m) - m22(m) * m31(m)) +
  (m01(m) * m12(m) - m02(m) * m11(m)) * (m20(m) * m33(m) - m23(m) * m30(m)) -
  (m01(m) * m13(m) - m03(m) * m11(m)) * (m20(m) * m32(m) - m22(m) * m30(m)) +
  (m02(m) * m13(m) - m03(m) * m12(m)) * (m20(m) * m31(m) - m21(m) * m30(m))

export const transpose = (m: Matrix4): Matrix4 => [
  m00(m), m10(m), m20(m), m30(m),
  m01(m), m11(m), m21(m), m31(m),
  m02(m), m12(m), m22(m), m32(m),
  m03(m), m13(m), m23(m), m33(m),
]

export const invert = (m: Matrix4): Matrix4 | null => {
  const d = det(m)
  if (d === 0) return null
  return [
    (m11(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m12(m) * (m21(m) * m33(m) - m23(m) * m31(m)) + m13(m) * (m21(m) * m32(m) - m22(m) * m31(m))) / d,
    (m02(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m01(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m03(m) * (m21(m) * m32(m) - m22(m) * m31(m))) / d,
    (m31(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m32(m) * (m01(m) * m13(m) - m03(m) * m11(m)) + m33(m) * (m01(m) * m12(m) - m02(m) * m11(m))) / d,
    (m22(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m21(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m23(m) * (m01(m) * m12(m) - m02(m) * m11(m))) / d,
    (m12(m) * (m20(m) * m33(m) - m23(m) * m30(m)) - m10(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m13(m) * (m20(m) * m32(m) - m22(m) * m30(m))) / d,
    (m00(m) * (m22(m) * m33(m) - m23(m) * m32(m)) - m02(m) * (m20(m) * m33(m) - m23(m) * m30(m)) + m03(m) * (m20(m) * m32(m) - m22(m) * m30(m))) / d,
    (m32(m) * (m00(m) * m13(m) - m03(m) * m10(m)) - m30(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m33(m) * (m00(m) * m12(m) - m02(m) * m10(m))) / d,
    (m20(m) * (m02(m) * m13(m) - m03(m) * m12(m)) - m22(m) * (m00(m) * m13(m) - m03(m) * m10(m)) + m23(m) * (m00(m) * m12(m) - m02(m) * m10(m))) / d,
    (m10(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m11(m) * (m20(m) * m33(m) - m23(m) * m30(m)) + m13(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m01(m) * (m20(m) * m33(m) - m23(m) * m30(m)) - m00(m) * (m21(m) * m33(m) - m23(m) * m31(m)) - m03(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m30(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m31(m) * (m00(m) * m13(m) - m03(m) * m10(m)) + m33(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m21(m) * (m00(m) * m13(m) - m03(m) * m10(m)) - m20(m) * (m01(m) * m13(m) - m03(m) * m11(m)) - m23(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m11(m) * (m20(m) * m32(m) - m22(m) * m30(m)) - m10(m) * (m21(m) * m32(m) - m22(m) * m31(m)) - m12(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m00(m) * (m21(m) * m32(m) - m22(m) * m31(m)) - m01(m) * (m20(m) * m32(m) - m22(m) * m30(m)) + m02(m) * (m20(m) * m31(m) - m21(m) * m30(m))) / d,
    (m31(m) * (m00(m) * m12(m) - m02(m) * m10(m)) - m30(m) * (m01(m) * m12(m) - m02(m) * m11(m)) - m32(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
    (m20(m) * (m01(m) * m12(m) - m02(m) * m11(m)) - m21(m) * (m00(m) * m12(m) - m02(m) * m10(m)) + m22(m) * (m00(m) * m11(m) - m01(m) * m10(m))) / d,
  ]
}

export const add = (a: Matrix4, b: Matrix4): Matrix4 => a.map((x, i) => x + b[i]) as Matrix4

export const subtract = (a: Matrix4, b: Matrix4): Matrix4 => a.map((x, i) => x - b[i]) as Matrix4

export const scalar = (a: Matrix4, c: number): Matrix4 => a.map((x) => x * c) as Matrix4
