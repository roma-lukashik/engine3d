import { Vector3 } from "@engine3d/math/src/vector3"
import { RigidBody } from "@core/object3d"

type Props = {
  gravity?: Vector3
  airDensity?: number
}

export class Physics {
  private readonly gravity: Vector3
  private airDensity: number

  public constructor({
    gravity = new Vector3(0, -9.81, 0),
    airDensity = 1.204,
  }: Props = {}) {
    this.gravity = gravity
    this.airDensity = airDensity
  }

  public calculateForces(rigidBody: RigidBody): Vector3 {
    const Fg = this.calculateGravityForce(rigidBody)
    const Fd = this.calculateDragForce(rigidBody)
    const Fm = this.calculateMagnusEffect(rigidBody)
    return Fg.add(Fd).add(Fm)
  }

  private calculateGravityForce(rigidBody: RigidBody): Vector3 {
    return this.gravity.clone().multiplyScalar(rigidBody.mass)
  }

  private calculateDragForce(rigidBody: RigidBody): Vector3 {
    const { velocity, airFriction } = rigidBody
    // Drag force is directed in opposite of the motion
    const direction = velocity.clone().sign().negate()
    return direction
      .multiply(velocity)
      .multiply(velocity)
      .multiplyScalar(0.01 * airFriction * this.airDensity)
  }

  private calculateMagnusEffect(rigidBody: RigidBody): Vector3 {
    const { velocity, angularVelocity, airFriction } = rigidBody
    // The force is directed perpendicular to the motion and perpendicular to the axis of rotation
    return velocity
      .clone()
      .cross(angularVelocity)
      .multiplyScalar(0.01 * airFriction * this.airDensity)
  }
}
