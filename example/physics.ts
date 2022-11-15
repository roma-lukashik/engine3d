import { Vector3 } from "@engine3d/math/src/vector3"
import { PI } from "@math/constants"

export const calculateForces = (mass: number, v: Vector3, radius: number): Vector3 => {
  const Fg = calculateGravityForce(mass)
  const Fd = calculateDragForce(v, radius)
  return Fg.add(Fd)
}

const gravity = new Vector3(0, -9.81, 0)
const calculateGravityForce = (mass: number): Vector3 => {
  return gravity.clone().multiplyScalar(mass)
}

const calculateDragForce = (v: Vector3, radius: number): Vector3 => {
  const density = 1.204
  const Cd = 0.47 // Rough sphere
  const A = PI * radius * radius
  // Drag force is directed in opposite of velocity direction
  const sign = new Vector3(-Math.sign(v.x), -Math.sign(v.y), -Math.sign(v.z))
  return sign
    .multiply(v)
    .multiply(v)
    .multiplyScalar(0.5 * density * Cd * A)
}
