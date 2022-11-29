import { Vector3 } from "@engine3d/math/src/vector3"
import { AABB } from "@engine3d/geometry/src/bbox/aabb"
import { gte, lte, neq } from "@engine3d/math/src/operators"
import { EPS } from "@math/constants"

const axes = [
  new Vector3(1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, 0, 1),
]

export const continuousAABBCollisionDetection = (
  movableBox: AABB,
  staticBox: AABB,
  movementVector: Vector3,
  resolvingAxes: Vector3[] = [movementVector],
): Vector3 | undefined => {
  const expandedMovableBox = expandBoxTowardMovementVector(movableBox, movementVector)
  const tests = []
  for (let i = 0; i < axes.length; i++) {
    const testResult = testAxis(
      axes[i],
      expandedMovableBox.min.elements[i],
      expandedMovableBox.max.elements[i],
      staticBox.min.elements[i],
      staticBox.max.elements[i],
      movementVector,
    )
    if (!testResult) {
      return
    }
    if (resolvingAxes.some((axis) => neq(testResult.axis.dot(axis), 0))) {
      tests.push(testResult)
    }
  }
  if (!tests.length) {
    return
  }
  const { axis, overlap } = tests.reduce((a, b) => a.overlap < b.overlap ? a : b)
  return axis.clone().multiplyScalar(overlap * (1 + EPS))
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
  const overlap = sign === 1 ? left : right
  return { axis: axis.clone().multiplyScalar(sign), overlap }
}
