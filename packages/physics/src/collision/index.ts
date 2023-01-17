import { Vector3 } from "@math/vector3"
import { eq, gte, lt, lte } from "@math/operators"
import { EPS } from "@math/constants"
import { OBB } from "@geometry/bbox/obb"
import { AABB } from "@geometry/bbox/aabb"
import { Projection } from "@geometry/projection"
import { Plane } from "@geometry/plane"
import { forEachPair } from "@utils/array"

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
  // but both of axes are unit vectors, so just compare them with 1.
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
  const [faceA, coefA] = findSignificantFace(boxA, pointsA, contactNormal, sign === 1 ? Math.max : Math.min)
  const [faceB, coefB] = findSignificantFace(boxB, pointsB, contactNormal, sign === 1 ? Math.min : Math.max)
  const [incidentFace, referenceBox] = coefA > coefB ? [faceA, boxB] : [faceB, boxA]
  const planes = referenceBox.faces.map((face) => {
    const normal = getFaceNormal(face)
    return new Plane(normal, -normal.dot(face[0]))
  })
  return clipIncidentFace(incidentFace, planes)
}

function findSignificantFace(
  box: OBB,
  points: Vector3[],
  collisionNormal: Vector3,
  extremumFn: (...values: number[]) => number,
): [face: Vector3[], coefficient: number] {
  const furthestPoints = findFurthestPointsAlongCollisionNormal(points, collisionNormal, extremumFn)
  const furthestFaces = box.faces.filter((face) => furthestPoints.every((point) => face.includes(point)))
  if (!furthestFaces.length) {
    throw new Error("Cannot find the furthest face.")
  }
  const parallelCoefficients = furthestFaces.map((face) => getFaceNormal(face).dot(collisionNormal))
  const maxParallel = Math.max(...parallelCoefficients)
  return [furthestFaces[parallelCoefficients.indexOf(maxParallel)], maxParallel]
}

function findFurthestPointsAlongCollisionNormal(
  points: Vector3[],
  collisionNormal: Vector3,
  extremumFn: (...values: number[]) => number,
): Vector3[] {
  const distances = points.map((point) => point.dot(collisionNormal))
  const furthestDistance = extremumFn(...distances)
  return points.filter((_, i) => eq(distances[i], furthestDistance))
}

function getFaceNormal(face: Vector3[]): Vector3 {
  const a = face[1].clone().subtract(face[0])
  const b = face[2].clone().subtract(face[0])
  return a.cross(b).normalize()
}

// Sutherland Hodgman
function clipIncidentFace(incidentFace: Vector3[], clippingPlanes: Plane[]): Vector3[] {
  let finalPolygon = incidentFace
  clippingPlanes.forEach((plane) => {
    const clippedPolygon: Vector3[] = []
    forEachPair(finalPolygon, (current, next) => {
      const d1 = plane.distanceToPoint(current)
      const d2 = plane.distanceToPoint(next)
      if (inFront(d1) && inFront(d2)) {
        clippedPolygon.push(next)
      } else if (inFront(d1) && behind(d2)) {
        clippedPolygon.push(plane.intersectSegment(current, next)!)
      } else if (behind(d1) && inFront(d2)) {
        clippedPolygon.push(plane.intersectSegment(current, next)!)
        clippedPolygon.push(next)
      }
    })
    finalPolygon = clippedPolygon
  })
  return finalPolygon
}

function inFront(distance: number): boolean {
  return gte(distance, 0)
}

function behind(distance: number): boolean {
  return lt(distance, 0)
}
