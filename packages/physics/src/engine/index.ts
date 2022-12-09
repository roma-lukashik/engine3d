import { RigidBody } from "@core/object3d"
import { Vector3 } from "@math/vector3"
import { continuousAABBCollisionDetection } from "@physics/sat"
import { lt } from "@math/operators"

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
        this.applyImpulse(rigidBody, collider, contactNormal)
        this.applyFrictionImpulse(rigidBody, collider, contactNormal)
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

  private applyImpulse(a: RigidBody, b: RigidBody, contactNormal: Vector3): void {
    const relativeVelocity = a.velocity.clone().subtract(b.velocity)
    const impactSpeed = contactNormal.dot(relativeVelocity)
    const commonRestitution = 1 + a.restitution * b.restitution
    const reducedMass = a.invMass + b.invMass
    const impulseMagnitude = commonRestitution * impactSpeed / reducedMass
    const impulse = contactNormal.clone().multiplyScalar(impulseMagnitude)

    a.velocity.subtract(impulse.clone().multiplyScalar(a.invMass))
    b.velocity.add(impulse.clone().multiplyScalar(b.invMass))
  }

  private applyFrictionImpulse(a: RigidBody, b: RigidBody, contactNormal: Vector3): void {
    const relativeVelocity = b.velocity.clone().subtract(a.velocity)
    const tangent = relativeVelocity.clone().cross(contactNormal).cross(contactNormal).normalize()
    const reducedMass = a.invMass + b.invMass
    const impulseMagnitude = tangent.dot(relativeVelocity) / reducedMass
    const commonStaticFriction = a.staticFriction * b.staticFriction
    const frictionImpulse = Vector3.zero()
    // Should be: Math.abs(impulseMagnitude) < impulse * commonStaticFriction
    if (lt(Math.abs(impulseMagnitude), impulseMagnitude * commonStaticFriction)) {
      frictionImpulse.copy(tangent.multiplyScalar(impulseMagnitude))
    } else {
      const commonDynamicFriction = a.friction * b.friction
      frictionImpulse.copy(tangent.multiplyScalar(-commonDynamicFriction * impulseMagnitude))
    }

    a.velocity.subtract(frictionImpulse.clone().multiplyScalar(a.invMass))
    b.velocity.add(frictionImpulse.clone().multiplyScalar(b.invMass))
  }
}
