import { Vector3 } from "@math/vector3"
import { eq, gte, lt, lte, neq } from "@math/operators"
import { EPS } from "@math/constants"
import { OBB } from "@geometry/bbox/obb"
import { AABB } from "@geometry/bbox/aabb"
import { Projection } from "@geometry/projection"

export type CollisionBox = {
  aabb: AABB
  obb: OBB
}

type Manifold = {
  penetration: number
  contactNormal: Vector3
  contactPoints: Vector3[]
}

export const detectContinuousCollision = (
  movableBody: CollisionBox,
  staticBody: CollisionBox,
  movementVector: Vector3,
): Manifold | undefined => {
  if (!expandBoxTowardMovementVector(movableBody.aabb, movementVector).collide(staticBody.aabb)) {
    return
  }
  const boxA = expandOBBTowardMovementVector(movableBody.obb, movementVector)
  const boxB = staticBody.obb
  const pointsA = boxA.getPoints()
  const pointsB = boxB.getPoints()
  const separateAxes = findSeparateAxes(boxA, boxB)
  const collision = findCollision(pointsA, pointsB, separateAxes, movementVector)
  if (!collision) {
    return
  }
  const { contactNormal, penetration, sign } = collision
  const contacts = findContacts(pointsA, boxA, pointsB, boxB, contactNormal, sign)
  return {
    contactNormal: contactNormal.clone().multiplyScalar(sign),
    penetration: penetration * (1 + EPS),
    contactPoints: contacts,
  }
}

function expandBoxTowardMovementVector(box: AABB, movementVector: Vector3): AABB {
  const v = box.min.clone()
  return box
    .clone()
    .expandByPoint(v.add(movementVector))
    .expandByPoint(v.copy(box.max).add(movementVector))
}

function expandOBBTowardMovementVector(obb: OBB, movementVector: Vector3): OBB {
  const box = obb.clone()
  const halfVector = movementVector.clone().divideScalar(2)
  box.center.add(halfVector)
  box.halfSize.add(halfVector.abs())
  return box
}

function findSeparateAxes(boxA: OBB, boxB: OBB): Vector3[] {
  const axes: Vector3[] = []
  collectSeparateAxes(boxA, axes)
  collectSeparateAxes(boxB, axes)
  return axes
}

function collectSeparateAxes(box: OBB, axes: Vector3[]): void {
  box.getBasis().forEach((basis) => {
    if (!axes.some((axis) => axesParallel(axis, basis))) {
      axes.push(basis)
    }
  })
}

function axesParallel(a: Vector3, b: Vector3): boolean {
  // To check if vectors are parallel we need to compare dot product with product of axes magnitudes,
  // but both of axes are unit vector, so we can compare just with 1.
  return eq(a.dot(b), 1)
}

type AxisTest = {
  contactNormal: Vector3
  penetration: number
  sign: number
}

function findCollision(
  pointsA: Vector3[],
  pointsB: Vector3[],
  separateAxes: Vector3[],
  resolvingAxis: Vector3,
): AxisTest | undefined {
  let collision: AxisTest | undefined
  for (const axis of separateAxes) {
    const testResult = testAxis(axis, pointsA, pointsB, resolvingAxis)
    // There is an axis with no overlap: boxes are not overlapped.
    if (!testResult) {
      return
    }
    // TODO Take axes which directs in resolvingAxis direction
    if (eq(testResult.contactNormal.dot(resolvingAxis), 0)) {
      continue
    }
    if (!collision || lt(testResult.penetration, collision.penetration)) {
      collision = testResult
    }
  }
  return collision
}

function testAxis(axis: Vector3, pointsA: Vector3[], pointsB: Vector3[], direction: Vector3): AxisTest | undefined {
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

function findContacts(
  pointsA: Vector3[],
  boxA: OBB,
  pointsB: Vector3[],
  boxB: OBB,
  contactNormal: Vector3,
  sign: number,
): Vector3[] {
  const contacts: Vector3[] = []
  collectContacts(contacts, pointsA, boxB, contactNormal, sign === 1 ? Math.max : Math.min)
  collectContacts(contacts, pointsB, boxA, contactNormal, sign === 1 ? Math.min : Math.max)
  return contacts
}

function collectContacts(
  existingContacts: Vector3[],
  contactCandidates: Vector3[],
  colliderOBB: OBB,
  contactNormal: Vector3,
  extremumFn: (...values: number[]) => number,
): void {
  const distances = contactCandidates.map((p) => p.dot(contactNormal))
  const extremum = extremumFn(...distances)

  contactCandidates.forEach((point, i) => {
    if (neq(distances[i], extremum)) {
      return
    }
    if (existingContacts.some((contact) => contact.equal(point))) {
      return
    }
    if (colliderOBB.containsPoint(point)) {
      existingContacts.push(point)
    }
  })
}
