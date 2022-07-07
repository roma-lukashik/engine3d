import { Frustum } from "@geometry/frustum"
import { Matrix4 } from "@math/matrix4"
import { PI } from "@math/constants"
import { Plane } from "@geometry/plane"
import { Vector3 } from "@math/vector3"
import { Sphere } from "@geometry/bbox/sphere"

describe("Frustum", () => {
  it("to be created", () => {
    const left = new Plane(new Vector3(1, 0, 0), 0)
    const right = new Plane(new Vector3(-1, 0, 0), 0)
    const bottom = new Plane(new Vector3(0, 1, 0), 0)
    const top = new Plane(new Vector3(0, -1, 0), 0)
    const near = new Plane(new Vector3(0, 0, -1), -1)
    const far = new Plane(new Vector3(0, 0, 1), 1)
    const frustum = new Frustum(left, right, bottom, top, near, far)

    expect(frustum.left.normal).toValueEqual([1, 0, 0])
    expect(frustum.left.constant).toBeCloseTo(0)

    expect(frustum.right.normal).toValueEqual([-1, 0, 0])
    expect(frustum.right.constant).toBeCloseTo(0)

    expect(frustum.bottom.normal).toValueEqual([0, 1, 0])
    expect(frustum.bottom.constant).toBeCloseTo(0)

    expect(frustum.top.normal).toValueEqual([0, -1, 0])
    expect(frustum.top.constant).toBeCloseTo(0)

    expect(frustum.near.normal).toValueEqual([0, 0, -1])
    expect(frustum.near.constant).toBeCloseTo(-1)

    expect(frustum.far.normal).toValueEqual([0, 0, 1])
    expect(frustum.far.constant).toBeCloseTo(1)
  })

  it("fromProjectionMatrix", () => {
    const matrix = Matrix4.perspective(PI / 4, 1, 1, 100)
    const frustum = Frustum.fromProjectionMatrix(matrix)

    expect(frustum.left.normal).toValueEqual([0.924, 0, -0.383])
    expect(frustum.left.constant).toBeCloseTo(0)

    expect(frustum.right.normal).toValueEqual([-0.924, 0, -0.383])
    expect(frustum.right.constant).toBeCloseTo(0)

    expect(frustum.bottom.normal).toValueEqual([0, 0.924, -0.383])
    expect(frustum.bottom.constant).toBeCloseTo(0)

    expect(frustum.top.normal).toValueEqual([0, -0.924, -0.383])
    expect(frustum.top.constant).toBeCloseTo(0)

    expect(frustum.near.normal).toValueEqual([0, 0, -1])
    expect(frustum.near.constant).toBeCloseTo(-1)

    expect(frustum.far.normal).toValueEqual([0, 0, 1])
    expect(frustum.far.constant).toBeCloseTo(100)
  })

  it("setFromProjectionMatrix", () => {
    const matrix = Matrix4.perspective(PI / 3, 1, 0.5, 50)
    const frustum = new Frustum(
      new Plane(Vector3.zero(), 0),
      new Plane(Vector3.zero(), 0),
      new Plane(Vector3.zero(), 0),
      new Plane(Vector3.zero(), 0),
      new Plane(Vector3.zero(), 0),
      new Plane(Vector3.zero(), 0),
    )
    frustum.setFromProjectionMatrix(matrix)

    expect(frustum.left.normal).toValueEqual([0.866, 0, -0.5])
    expect(frustum.left.constant).toBeCloseTo(0)

    expect(frustum.right.normal).toValueEqual([-0.866, 0, -0.5])
    expect(frustum.right.constant).toBeCloseTo(0)

    expect(frustum.bottom.normal).toValueEqual([0, 0.866, -0.5])
    expect(frustum.bottom.constant).toBeCloseTo(0)

    expect(frustum.top.normal).toValueEqual([0, -0.866, -0.5])
    expect(frustum.top.constant).toBeCloseTo(0)

    expect(frustum.near.normal).toValueEqual([0, 0, -1])
    expect(frustum.near.constant).toBeCloseTo(-0.5)

    expect(frustum.far.normal).toValueEqual([0, 0, 1])
    expect(frustum.far.constant).toBeCloseTo(50)
  })

  it.each([
    new Sphere(Vector3.zero(), 1), // inside
    new Sphere(Vector3.zero(), 10), // inscribed
    new Sphere(Vector3.zero(), 12), // bigger
    new Sphere(new Vector3(8, 8, 8), 5), // intersect when sphere center is inside
    new Sphere(new Vector3(12, 12, 12), 5), // intersect when sphere center is outside
  ])("intersectSphere to be true %#", (sphere) => {
    const matrix = Matrix4.orthographic(-10, 10, 10, -10, -10, 10)
    const frustum = Frustum.fromProjectionMatrix(matrix)
    expect(frustum.intersectSphere(sphere)).toBe(true)
  })

  it.each([
    new Sphere(new Vector3(12, 12, 12), 1),
    new Sphere(new Vector3(-12, -12, 12), 1),
  ])("intersectSphere to be false %#", (sphere) => {
    const matrix = Matrix4.orthographic(-10, 10, 10, -10, -10, 10)
    const frustum = Frustum.fromProjectionMatrix(matrix)
    expect(frustum.intersectSphere(sphere)).toBe(false)
  })
})
