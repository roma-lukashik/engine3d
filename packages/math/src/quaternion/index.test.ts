import { Quaternion } from "@math/quaternion"
import { PI } from "@math/constants"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

describe("Quaternion", () => {
  const q = new Quaternion()

  beforeEach(() => {
    q.set(0.1, 0.2, 0.3, 0.5)
  })

  it("constructor with no arguments", () => {
    expect(new Quaternion()).toValueEqual([0, 0, 0, 1])
  })

  it("constructor with arguments", () => {
    expect(new Quaternion(0.1, 0.2, 0.3, 0.5)).toValueEqual([0.1, 0.2, 0.3, 0.5])
  })

  it("identity", () => {
    expect(Quaternion.identity()).toValueEqual([0, 0, 0, 1])
  })

  it("fromArray", () => {
    expect(Quaternion.fromArray([0, 1, 2, 3, 4, 5, 6])).toValueEqual([0, 1, 2, 3])
    expect(Quaternion.fromArray([0, 1, 2, 3, 4, 5, 6], 3)).toValueEqual([3, 4, 5, 6])
  })

  it("fromAxisAngle", () => {
    const axis = new Vector3(0.802, 0.267, 0.534)
    const angle = PI / 4
    expect(Quaternion.fromAxisAngle(axis, angle)).toValueEqual([0.307, 0.102, 0.204, 0.924])
  })

  it.each<[Matrix4, [number, number, number, number]]>([
    [Matrix4.rotationX(PI / 4), [-0.383, 0, 0, 0.924]],
    [Matrix4.rotationX(PI), [1, 0, 0, 0]],
    [Matrix4.rotationY(PI / 6), [0, -0.259, 0, 0.966]],
    [Matrix4.rotationZ(4 * PI / 3), [0, 0, 0.866, 0.5]],
  ])("fromRotationMatrix", (matrix, result) => {
    expect(Quaternion.fromRotationMatrix(matrix)).toValueEqual(result)
  })

  it("x", () => {
    expect(q.x).toBeCloseTo(0.1)
  })

  it("y", () => {
    expect(q.y).toBeCloseTo(0.2)
  })

  it("z", () => {
    expect(q.z).toBeCloseTo(0.3)
  })

  it("w", () => {
    expect(q.w).toBeCloseTo(0.5)
  })

  it("clone", () => {
    expect(q.clone()).toEqual(q)
    expect(q.clone()).not.toBe(q)
  })

  it("copy", () => {
    expect(q.copy(new Quaternion(0.1, 0.3, 0.5, 0.7))).toValueEqual([0.1, 0.3, 0.5, 0.7])
  })

  it("set", () => {
    const q = new Quaternion()
    q.set(0.1, 0.2, 0.3, 0.5)
    expect(q).toValueEqual([0.1, 0.2, 0.3, 0.5])
  })

  it.each<[number, [number, number, number, number]]>([
    [0, [0.307, 0.102, 0.204, 0.924]],
    [0.5, [0.249, 0.192, 0.291, 0.904]],
    [1, [0.1855, 0.278, 0.371, 0.866]],
  ])("slerp #1", (t, result) => {
    const startTheta = PI / 4
    const startAxis = new Vector3(0.802, 0.267, 0.534)
    const start = Quaternion.fromAxisAngle(startAxis, startTheta)

    const endTheta = PI / 3
    const endAxis = new Vector3(0.371, 0.557, 0.743)
    const end = Quaternion.fromAxisAngle(endAxis, endTheta)

    expect(start.slerp(end, t)).toValueEqual(result)
  })

  it.each<[number, [number, number, number, number]]>([
    [0, [0.765, 1.148, 1.531, 0.924]],
    [0.5, [1.682, 2.306, 2.93, 0.712]],
    [1, [2.598, 3.464, 4.33, 0.5]],
  ])("slerp #2", (t, result) => {
    const startTheta = PI / 4
    const startAxis = new Vector3(2, 3, 4)
    const start = Quaternion.fromAxisAngle(startAxis, startTheta)

    const endTheta = 2 * PI / 3
    const endAxis = new Vector3(3, 4, 5)
    const end = Quaternion.fromAxisAngle(endAxis, endTheta)

    expect(start.slerp(end, t)).toValueEqual(result)
  })

  it("toArray", () => {
    expect(q.toArray()).toValueEqual([0.1, 0.2, 0.3, 0.5])
  })
})
