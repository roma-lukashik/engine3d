import { gt } from '../operators'
import { Matrix4, Quaternion } from '../types'

export const quat = (x: number, y: number, z: number, w: number): Quaternion => [x, y, z, w]

export const identity = () => quat(0, 0, 0, 1)

export const fromRotationMatrix = (m: Matrix4): Quaternion => {
  const [
    a11, a12, a13, ,
    a21, a22, a23, ,
    a31, a32, a33, ,
  ] = m

  const trace = a11 + a22 + a33

  if (trace > 0) {
    const s = 2 * Math.sqrt(trace + 1.0)
    return [
      (a23 - a32) / s,
      (a31 - a13) / s,
      (a12 - a21) / s,
      0.25 * s,
    ]
  } else if (a11 > a22 && a11 > a33) {
    const s = 2 * Math.sqrt(1.0 + a11 - a22 - a33)
    return [
      0.25 * s,
      (a12 + a21) / s,
      (a31 + a13) / s,
      (a23 - a32) / s,
    ]
  } else if (a22 > a33) {
    const s = 2 * Math.sqrt(1.0 + a22 - a11 - a33)
    return [
      (a12 + a21) / s,
      0.25 * s,
      (a23 + a32) / s,
      (a31 - a13) / s,
    ]
  } else {
    const s = 2 * Math.sqrt(1.0 + a33 - a11 - a22)
    return [
      (a31 + a13) / s,
      (a23 + a32) / s,
      0.25 * s,
      (a12 - a21) / s,
    ]
  }
}

export const slerp = (a: Quaternion, b: Quaternion, t: number) => {
  const [ax, ay, az, aw] = a
  const [bx, by, bz, bw] = b

  const cosom = ax * bx + ay * by + az * bz + aw * bw
  const cosomSign = Math.sign(cosom)
  const cosomAbs = Math.abs(cosom)

  let scale0, scale1

  if (gt(1.0, cosomAbs)) {
    const omega = Math.acos(cosomAbs)
    const sinom = Math.sin(omega)
    scale0 = Math.sin((1 - t) * omega) / sinom
    scale1 = Math.sin(t * omega) / sinom
  } else {
    scale0 = 1.0 - t
    scale1 = t
  }

  return quat(
    scale0 * ax + scale1 * bx * cosomSign,
    scale0 * ay + scale1 * by * cosomSign,
    scale0 * az + scale1 * bz * cosomSign,
    scale0 * aw + scale1 * bw * cosomSign,
  )
}
