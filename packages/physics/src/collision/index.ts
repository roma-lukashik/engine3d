import { Vector3 } from "@math/vector3"
import { eq, gte, lte, neq } from "@math/operators"
import { EPS } from "@math/constants"
import { RigidBody } from "@core/object3d"
import { OBB } from "@geometry/bbox/obb"
import { AABB } from "@geometry/bbox/aabb"
import { Projection } from "@geometry/projection"

type Manifold = {
  penetration: number
  contactNormal: Vector3
  contactPoints: Vector3[]
}

export const detectContinuousCollision = (
  movableBody: RigidBody,
  staticBody: RigidBody,
  movementVector: Vector3,
): Manifold | undefined => {
  if (!expandBoxTowardMovementVector(movableBody.aabb, movementVector).collide(staticBody.aabb)) {
    return
  }
  const separateAxes = mergeAxes(movableBody.obb.getBasis(), staticBody.obb.getBasis())
  const expandedMovableBox = expandOBBTowardMovementVector(movableBody.obb, movementVector)
  const pointsA = expandedMovableBox.getPoints()
  const pointsB = staticBody.obb.getPoints()
  const tests = []
  for (const axis of separateAxes) {
    const testResult = testAxis(axis, pointsA, pointsB, movementVector)
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
  const { contactNormal, penetration, sign } = tests.reduce((a, b) => a.penetration < b.penetration ? a : b)

  const nearestPointsA = getNearestPoints(pointsA, contactNormal, sign ? Math.min : Math.max)
  const contactPointsA = getContactPoints(nearestPointsA, staticBody.obb)

  const nearestPointsB = getNearestPoints(pointsB, contactNormal, sign ? Math.max : Math.max)
  const contactPointsB = getContactPoints(nearestPointsB, expandedMovableBox)

  return {
    contactNormal: contactNormal.clone().multiplyScalar(sign),
    penetration: penetration * (1 + EPS),
    contactPoints: mergeContactPoints(contactPointsA, contactPointsB),
  }
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

const mergeAxes = (axesA: Vector3[], axesB: Vector3[]): Vector3[] => {
  return [...axesA, ...axesB].reduce<Vector3[]>((result, axis) => {
    if (!result.some((v) => eq(v.dot(axis), 1))) {
      result.push(axis)
    }
    return result
  }, [])
}

type AxisTest = {
  contactNormal: Vector3
  penetration: number
  sign: number
}

const testAxis = (axis: Vector3, pointsA: Vector3[], pointsB: Vector3[], direction: Vector3): AxisTest | undefined => {
  const projectionA = new Projection(pointsA, axis)
  const projectionB = new Projection(pointsB, axis)
  const left = projectionB.max - projectionA.min
  const right = projectionA.max - projectionB.min
  if (lte(left, 0) || lte(right, 0)) {
    return
  }
  const sign = gte(axis.dot(direction), 0) ? 1 : -1
  const penetration = sign === 1 ? right : left
  return { contactNormal: axis, penetration, sign }
}

const getNearestPoints = (
  points: Vector3[],
  contactNormal: Vector3,
  extremum: (...values: number[]) => number,
): Vector3[] => {
  // Distances to points toward contact normal.
  const dots = points.map((p) => p.dot(contactNormal))
  const extremumValue = extremum(...dots)
  return points.filter((_, i) => eq(dots[i], extremumValue))
}

const getContactPoints = (points: Vector3[], obb: OBB): Vector3[] => {
  return points.filter((point) => obb.containsPoint(point))
}

const mergeContactPoints = (pointsA: Vector3[], pointsB: Vector3[]): Vector3[] => {
  return [...pointsA, ...pointsB].reduce<Vector3[]>((result, point) => {
    if (!result.some((p) => p.equal(point))) {
      result.push(point)
    }
    return result
  }, [])
}
