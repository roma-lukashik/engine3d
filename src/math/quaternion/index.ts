import { gt } from '../operators'

export type Quaternion = [x: number, y: number, z: number, w: number]

export const quat = (x: number, y: number, z: number, w: number): Quaternion => [x, y, z, w]

export const identity = () => quat(0, 0, 0, 1)

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
