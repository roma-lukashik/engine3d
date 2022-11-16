import { Vector3 } from "@engine3d/math/src/vector3"
import { PI } from "@math/constants"

export const calculateForces = (mass: number, velocity: Vector3, angularVelocity: Vector3, radius: number): Vector3 => {
  const Fg = calculateGravityForce(mass)
  const Fd = calculateDragForce(velocity, radius)
  const Fm = calculateMagnusEffect(velocity, angularVelocity, radius)
  return Fg.add(Fd).add(Fm)
}

const gravity = new Vector3(0, -9.81, 0)
const calculateGravityForce = (mass: number): Vector3 => {
  return gravity.clone().multiplyScalar(mass)
}

const calculateDragForce = (velocity: Vector3, radius: number): Vector3 => {
  const density = 1.204
  const Cd = 0.47 // Rough sphere
  const A = PI * radius * radius
  // Drag force is directed in opposite of the motion
  const direction = velocity.clone().sign().negate()
  return direction
    .multiply(velocity)
    .multiply(velocity)
    .multiplyScalar(0.5 * density * Cd * A)
}

const calculateMagnusEffect = (velocity: Vector3, angularVelocity: Vector3, radius: number): Vector3 => {
  const density = 1.204
  // The force is directed perpendicular to the motion and perpendicular to the axis of rotation
  return velocity
    .clone()
    .cross(angularVelocity)
    .multiplyScalar(8 / 3 * PI * radius * radius * radius * density)
}
