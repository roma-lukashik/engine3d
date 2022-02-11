export type Matrix3 = [
  number, number, number,
  number, number, number,
  number, number, number,
]

export const a00 = (m: Matrix3) => m[0]

export const a01 = (m: Matrix3) => m[1]

export const a02 = (m: Matrix3) => m[2]

export const a10 = (m: Matrix3) => m[3]

export const a11 = (m: Matrix3) => m[4]

export const a12 = (m: Matrix3) => m[5]

export const a20 = (m: Matrix3) => m[6]

export const a21 = (m: Matrix3) => m[7]

export const a22 = (m: Matrix3) => m[8]

export const identity = (): Matrix3 => [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
]

export const det = (m: Matrix3): number =>
  a00(m) * (a22(m) * a11(m) - a12(m) * a21(m)) +
  a01(m) * (-a22(m) * a10(m) + a12(m) * a20(m)) +
  a02(m) * (a21(m) * a10(m) - a11(m) * a20(m))

export const transpose = (m: Matrix3): Matrix3 => [
  a00(m), a10(m), a20(m),
  a01(m), a11(m), a21(m),
  a02(m), a12(m), a22(m),
]

export const invert = (m: Matrix3): Matrix3 | null => {
  const d = det(m)
  if (!d) return null
  return [
    (a22(m) * a11(m) - a12(m) * a21(m)) / d,
    (-a22(m) * a01(m) + a02(m) * a21(m)) / d,
    (a12(m) * a01(m) - a02(m) * a11(m)) / d,
    (-a22(m) * a10(m) + a12(m) * a20(m)) / d,
    (a22(m) * a00(m) - a02(m) * a20(m)) / d,
    (-a12(m) * a00(m) + a02(m) * a10(m)) * d,
    (a21(m) * a10(m) - a11(m) * a20(m)) / d,
    (-a21(m) * a00(m) + a01(m) * a20(m)) / d,
    (a11(m) * a00(m) - a01(m) * a10(m)) / d,
  ]
}

export const add = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x + b[i]) as Matrix3

export const subtract = (a: Matrix3, b: Matrix3): Matrix3 => a.map((x, i) => x - b[i]) as Matrix3

export const scalar = (a: Matrix3, c: number): Matrix3 => a.map((x) => x * c) as Matrix3
