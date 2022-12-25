import { Vector3 } from "@math/vector3"
import { eq, gte, lte, neq } from "@math/operators"
import { EPS } from "@math/constants"
import { RigidBody } from "@core/object3d"
import { OOBB } from "@geometry/bbox/oobb"
import { Projection } from "@geometry/projection"

const units = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
]

type Manifold = {
  penetration: number
  axis: Vector3
}

export const detectContinuousCollision = (
  movableBody: RigidBody,
  staticBody: RigidBody,
  movementVector: Vector3,
): Manifold | undefined => {
  // const expandedMovableBox = expandBoxTowardMovementVector(movableBody.aabb, movementVector)
  // if (!expandedMovableBox.collide(staticBody.aabb)) {
  //   return
  // }
  const axes = getAxes(movableBody, staticBody)
  const expandedMovableBox = expandOOBBTowardMovementVector(movableBody.oobb, movementVector)
  const pointsA = getCornerPoints(expandedMovableBox)
  const pointsB = getCornerPoints(staticBody.oobb)
  const tests = []
  for (let i = 0; i < axes.length; i++) {
    const projectionA = new Projection(pointsA, axes[i])
    const projectionB = new Projection(pointsB, axes[i])
    const testResult = testAxis(axes[i], projectionA, projectionB, movementVector)
    if (!testResult) {
      return
    }
    if (neq(testResult.axis.dot(movementVector), 0)) {
      tests.push(testResult)
    }
  }
  if (!tests.length) {
    return
  }
  const { axis, penetration } = tests.reduce((a, b) => a.penetration < b.penetration ? a : b)
  return { axis, penetration: penetration * (1 + EPS) }
}

// const expandBoxTowardMovementVector = (box: AABB, movementVector: Vector3): AABB => {
//   return box
//     .clone()
//     .expandByPoint(box.min.clone().add(movementVector))
//     .expandByPoint(box.max.clone().add(movementVector))
// }

const expandOOBBTowardMovementVector = (oobb: OOBB, movementVector: Vector3): OOBB => {
  const box = oobb.clone()
  const halfVector = movementVector.clone().divideScalar(2)
  box.center.add(halfVector)
  box.halfSize.add(halfVector.abs())
  return box
}

const getAxes = (bodyA: RigidBody, bodyB: RigidBody): Vector3[] => {
  return units.reduce<Vector3[]>((axes, axis) => {
    const rotatedAxisA = axis.clone().rotateByQuaternion(bodyA.oobb.rotation)
    if (!axes.some((v) => eq(Math.abs(v.dot(rotatedAxisA)), 1))) {
      axes.push(rotatedAxisA)
    }
    const rotatedAxisB = axis.clone().rotateByQuaternion(bodyB.oobb.rotation)
    if (!axes.some((v) => eq(Math.abs(v.dot(rotatedAxisB)), 1))) {
      axes.push(rotatedAxisB)
    }
    return axes
  }, [])
}

const testAxis = (axis: Vector3, a: Projection, b: Projection, direction: Vector3) => {
  const left = b.max - a.min
  const right = a.max - b.min
  if (lte(left, 0) || lte(right, 0)) {
    return
  }
  const sign = gte(axis.dot(direction), 0) ? 1 : -1
  const penetration = sign === 1 ? right : left
  return { axis: axis.clone().multiplyScalar(sign), penetration }
}

const getCornerPoints = ({ halfSize, rotation, center }: OOBB): Vector3[] => {
  return [
    new Vector3(halfSize.x, halfSize.y, halfSize.z),
    new Vector3(-halfSize.x, halfSize.y, halfSize.z),
    new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
    new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
    new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
    new Vector3(halfSize.x, halfSize.y, -halfSize.z),
    new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
    new Vector3(halfSize.x, -halfSize.y, halfSize.z),
  ].map((v) => {
    return v.rotateByQuaternion(rotation).add(center)
  })
}
