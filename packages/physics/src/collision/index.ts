import { Vector3 } from "@math/vector3"
import { AABB } from "@geometry/bbox/aabb"
import { gte, lte, neq } from "@math/operators"
import { EPS } from "@math/constants"
import { RigidBody } from "@core/object3d"

const axes = [
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
  const expandedMovableBox = expandBoxTowardMovementVector(movableBody.aabb, movementVector)
  if (!expandedMovableBox.collide(staticBody.aabb)) {
    return
  }
  const tests = []
  for (let i = 0; i < axes.length; i++) {
    const testResult = testAxis(
      axes[i],
      expandedMovableBox.min.elements[i],
      expandedMovableBox.max.elements[i],
      staticBody.aabb.min.elements[i],
      staticBody.aabb.max.elements[i],
      movementVector,
    )
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
  const { axis, overlap } = tests.reduce((a, b) => a.overlap < b.overlap ? a : b)
  return { axis, penetration: overlap * (1 + EPS) }
}

const expandBoxTowardMovementVector = (box: AABB, movementVector: Vector3): AABB => {
  return box
    .clone()
    .expandByPoint(box.min.clone().add(movementVector))
    .expandByPoint(box.max.clone().add(movementVector))
}

const testAxis = (axis: Vector3, minA: number, maxA: number, minB: number, maxB: number, direction: Vector3) => {
  const left = maxB - minA
  const right = maxA - minB
  if (lte(left, 0) || lte(right, 0)) {
    return
  }
  const sign = gte(axis.dot(direction), 0) ? 1 : -1
  const overlap = sign === 1 ? right : left
  return { axis: axis.clone().multiplyScalar(sign), overlap }
}
