import { RigidBody } from "@core/object3d"
import { Vector3 } from "@math/vector3"
import { continuousAABBCollisionDetection } from "@physics/sat"

type Props = {
  gravity?: Vector3
  airDensity?: number
  deltaTime?: number
}

export class PhysicsEngine {
  private readonly gravity: Vector3
  private airDensity: number
  private deltaTime: number

  public constructor({
    gravity = new Vector3(0, -9.81, 0),
    airDensity = 1.204,
    deltaTime = 0.1,
  }: Props = {}) {
    this.gravity = gravity
    this.airDensity = airDensity
    this.deltaTime = deltaTime
  }

  public run(rigidBodies: Iterable<RigidBody>): void {
    for (const rigidBody of rigidBodies) {
      if (!rigidBody.isMovable) {
        continue
      }
      const deltaPosition = this.explicitEulerMethod(rigidBody)
      rigidBody.colliders.forEach((collider) => {
        const penetration = continuousAABBCollisionDetection(rigidBody.aabb, collider.aabb, deltaPosition)
        if (!penetration) {
          return
        }
        const contactNormal = penetration.clone().normalize()
        const impulseMagnitude = this.calculateImpulseMagnitude(rigidBody, collider, contactNormal)
        const deltaRigidBodyVelocity = contactNormal.clone().multiplyScalar(-impulseMagnitude / rigidBody.mass)
        const deltaColliderVelocity = contactNormal.multiplyScalar(impulseMagnitude / collider.mass)
        rigidBody.velocity.add(deltaRigidBodyVelocity)
        collider.velocity.add(deltaColliderVelocity)
        deltaPosition.subtract(penetration)
      })
      rigidBody.node.localMatrix.translateByVector(deltaPosition)
    }

    for (const rigidBody of rigidBodies) {
      // Assume, that if velocity magnitude less than 1, the body is not moving
      if (rigidBody.isMovable && rigidBody.velocity.lengthSquared() > 1) {
        rigidBody.updateWorldMatrix()
      }
    }
  }

  private explicitEulerMethod(rigidBody: RigidBody): Vector3 {
    const forces = this.calculateForces(rigidBody)
    const acceleration = forces.divideScalar(rigidBody.mass)
    const deltaVelocity = acceleration.multiplyScalar(this.deltaTime)
    rigidBody.velocity.add(deltaVelocity)
    return rigidBody.velocity.clone().multiplyScalar(this.deltaTime)
  }

  private calculateForces(rigidBody: RigidBody): Vector3 {
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

  private calculateImpulseMagnitude(rigidBodyA: RigidBody, rigidBodyB: RigidBody, contactNormal: Vector3): number {
    const reducedMass = rigidBodyA.mass * rigidBodyB.mass / (rigidBodyA.mass + rigidBodyB.mass)
    const impactSpeed = contactNormal.dot(rigidBodyA.velocity.clone().subtract(rigidBodyB.velocity))
    return (1 + rigidBodyA.restitution * rigidBodyB.restitution) * reducedMass * impactSpeed
  }
}
