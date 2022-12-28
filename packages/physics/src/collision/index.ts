import { Vector3 } from "@math/vector3"
import { eq, gte, lte, neq } from "@math/operators"
import { EPS } from "@math/constants"
import { RigidBody } from "@core/object3d"
import { OBB } from "@geometry/bbox/obb"
import { AABB } from "@geometry/bbox/aabb"
import { Projection } from "@geometry/projection"

const units = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
]

type Manifold = {
  penetration: number
  contactNormal: Vector3
}

export const detectContinuousCollision = (
  movableBody: RigidBody,
  staticBody: RigidBody,
  movementVector: Vector3,
): Manifold | undefined => {
  if (!expandBoxTowardMovementVector(movableBody.aabb, movementVector).collide(staticBody.aabb)) {
    return
  }
  const axes = getAxes(movableBody.obb).concat(getAxes(staticBody.obb))
  const expandedMovableBox = expandOBBTowardMovementVector(movableBody.obb, movementVector)
  const pointsA = expandedMovableBox.getPoints()
  const pointsB = staticBody.obb.getPoints()
  const tests = []
  for (let i = 0; i < axes.length; i++) {
    const projectionA = new Projection(pointsA, axes[i])
    const projectionB = new Projection(pointsB, axes[i])
    const testResult = testAxis(axes[i], projectionA, projectionB, movementVector)
    if (!testResult) {
      return
    }
    if (neq(testResult.contactNormal.dot(movementVector), 0)) {
      tests.push(testResult)
    }
  }
  if (!tests.length) {
    return
  }
  const { contactNormal, penetration } = tests.reduce((a, b) => a.penetration < b.penetration ? a : b)
  return { contactNormal, penetration: penetration * (1 + EPS) }
}

const expandBoxTowardMovementVector = (box: AABB, movementVector: Vector3): AABB => {
  const v = box.min.clone()
  return box
    .clone()
    .expandByPoint(v.add(movementVector))
    .expandByPoint(v.copy(box.max).add(movementVector))
}

const expandOBBTowardMovementVector = (obb: OBB, movementVector: Vector3): OBB => {
  const box = obb.clone()
  const halfVector = movementVector.clone().divideScalar(2)
  box.center.add(halfVector)
  box.halfSize.add(halfVector.abs())
  return box
}

const getAxes = (box: OBB): Vector3[] => {
  return units.reduce<Vector3[]>((axes, axis) => {
    const rotatedAxis = axis.clone().rotateByQuaternion(box.rotation)
    if (!axes.some((v) => eq(Math.abs(v.dot(rotatedAxis)), 1))) {
      axes.push(rotatedAxis)
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
  return { contactNormal: axis.clone().multiplyScalar(sign), penetration }
}
