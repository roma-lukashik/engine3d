import { Vector3 } from "@engine3d/math/src/vector3"
import { PI } from "@math/constants"
import { RigidBody } from "@core/object3d"

// type Props = {
//   gravity?: Vector3
//   airDensity?: number
// }
//
// type RigidBody = {
//   mass: number
//   velocity: Vector3
//   angularVelocity: Vector3
//   radius: number
//   dragCoefficient: number
// }
//
// export class Physics {
//   private gravity: Vector3
//   private airDensity: number
//
//   public constructor({
//     gravity = new Vector3(0, -9.81, 0),
//     airDensity = 1.204,
//   }: Props) {
//     this.gravity = gravity
//     this.airDensity = airDensity
//   }
//
//   public calculateForces(rigidBody: RigidBody): Vector3 {
//     const Fg = this.calculateGravityForce(rigidBody)
//     const Fd = this.calculateDragForce(rigidBody)
//     const Fm = this.calculateMagnusEffect(rigidBody)
//     return Fg.add(Fd).add(Fm)
//   }
//
//   private calculateGravityForce(rigidBody: RigidBody): Vector3 {
//     return this.gravity.clone().multiplyScalar(rigidBody.mass)
//   }
//
//   private calculateDragForce(rigidBody: RigidBody): Vector3 {
//     const { radius, dragCoefficient, velocity } = rigidBody
//     const Cd = dragCoefficient
//     const A = PI * radius * radius
//     // Drag force is directed in opposite of the motion
//     const direction = velocity.clone().sign().negate()
//     return direction
//       .multiply(velocity)
//       .multiply(velocity)
//       .multiplyScalar(0.5 * this.airDensity * Cd * A)
//   }
//
//   private calculateMagnusEffect(rigidBody: RigidBody): Vector3 {
//     const { velocity, angularVelocity, radius } = rigidBody
//     // The force is directed perpendicular to the motion and perpendicular to the axis of rotation
//     return velocity
//       .clone()
//       .cross(angularVelocity)
//       .multiplyScalar(8 / 3 * PI * radius * radius * radius * this.airDensity)
//   }
// }

export const calculateForces = (rigidBody: RigidBody, radius: number): Vector3 => {
  const Fg = calculateGravityForce(rigidBody.mass)
  const Fd = calculateDragForce(rigidBody.velocity, radius)
  const Fm = calculateMagnusEffect(rigidBody.velocity, rigidBody.angularVelocity, radius)
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
