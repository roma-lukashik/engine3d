import { Matrix4 } from "@math/matrix4"
import { PI } from "@math/constants"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"

describe("Matrix4", () => {
  const a = new Matrix4()
  const b = new Matrix4()

  beforeEach(() => {
    a.set([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ])

    b.set([
      1, 4,	4, 3,
      2, 1,	3, 2,
      3, 3,	2, 4,
      4, 2,	1, 1,
    ])
  })

  it("constructor with no arguments", () => {
    expect(new Matrix4()).toValueEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })

  it("constructor with arguments", () => {
    expect(new Matrix4([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ])).toValueEqual([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ])
  })

  it("identity", () => {
    expect(Matrix4.identity()).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  })

  it("zero", () => {
    expect(Matrix4.zero()).toValueEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })

  it("rotationX", () => {
    expect(Matrix4.rotationX(PI / 3)).toValueEqual([
      1, 0, 0, 0,
      0, 0.5, -0.866, 0,
      0, 0.866, 0.5, 0,
      0, 0, 0, 1,
    ])
  })

  it("rotationY", () => {
    expect(Matrix4.rotationY(PI / 3)).toValueEqual([
      0.5, 0, 0.866, 0,
      0, 1, 0, 0,
      -0.866, 0, 0.5, 0,
      0, 0, 0, 1,
    ])
  })

  it("rotationZ", () => {
    expect(Matrix4.rotationZ(PI / 3)).toValueEqual([
      0.5, -0.866, 0, 0,
      0.866, 0.5, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  })

  it("translation", () => {
    expect(Matrix4.translation(2, 4, 6)).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      2, 4, 6, 1,
    ])
  })

  it("scaling", () => {
    expect(Matrix4.scaling(2, 4, 6)).toValueEqual([
      2, 0, 0, 0,
      0, 4, 0, 0,
      0, 0, 6, 0,
      0, 0, 0, 1,
    ])
  })

  it("perspective", () => {
    expect(Matrix4.perspective(Math.PI / 2, 1, 0.1, 100)).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, -1.002, -1,
      0, 0, -0.2002, 0,
    ])
  })

  it("orthographic", () => {
    expect(Matrix4.orthographic(-10, 10, -10, 10, 1, 100)).toValueEqual([
      0.1, 0, 0, 0,
      0, -0.1, 0, 0,
      0, 0, -0.02, 0,
      0, 0, -1.02, 1,
    ])
  })

  it("lookAt", () => {
    const eye = new Vector3(1, 1, 1)
    const target = Vector3.zero()
    const up = new Vector3(0, 1, 0)
    expect(Matrix4.lookAt(eye, target, up)).toValueEqual([
      0.707, 0, -0.707, 0,
      -0.408, 0.816, -0.408, 0,
      0.577, 0.577, 0.577, 0,
      1, 1, 1, 1,
    ])
  })

  it("compose", () => {
    const m = Matrix4.compose(
      new Quaternion(0, 0.9238795292366128, 0, 0.38268342717215614),
      new Vector3(2, 3, 4),
      new Vector3(2, 3, 4),
    )
    expect(m).toValueEqual([
      -1.414, 0, -1.414, 0,
      0, 3, 0, 0,
      2.828, 0, -2.828, 0,
      2, 3, 4, 1,
    ])
  })

  it("fromArray with no offset", () => {
    expect(Matrix4.fromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 2, 3, 4, 1])).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  })

  it("fromArray with offset", () => {
    expect(Matrix4.fromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 2, 3, 4, 1], 4)).toValueEqual([
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      2, 3, 4, 1,
    ])
  })

  it("clone", () => {
    expect(a.clone()).toEqual(a)
    expect(a.clone()).not.toBe(a)
  })

  it("set", () => {
    const m = new Matrix4()
    m.set([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ])
    expect(m).toValueEqual([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ])
  })

  it("det", () => {
    expect(a.det()).toBe(-80)
  })

  it("invert", () => {
    expect(a.invert()).toValueEqual([
      -0.1375, 0.3125, 0.1125, -0.1875,
      0.1125, -0.4375, 0.3625, 0.0625,
      -0.0125, -0.0625, -0.2625, 0.4375,
      0.2375, 0.1875, -0.0125, -0.3125,
    ])
  })

  it("invert with det=0", () => {
    const m = new Matrix4([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ])
    expect(m.invert()).toValueEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })

  it("transpose", () => {
    expect(a.transpose()).toValueEqual([
      1, 4, 4, 3,
      2, 1, 3, 2,
      3, 3, 2, 4,
      4, 2, 1, 1,
    ])
  })

  it("add", () => {
    expect(a.add(b)).toValueEqual([
      2, 6, 7, 7,
      6, 2, 6, 4,
      7, 6, 4, 5,
      7, 4, 5, 2,
    ])
  })

  it("subtract", () => {
    expect(a.subtract(b)).toValueEqual([
      0, -2, -1, 1,
      2, 0, 0, 0,
      1, 0, 0, -3,
      -1, 0, 3, 0,
    ])
  })

  it("scalar", () => {
    expect(a.scalar(2)).toValueEqual([
      2, 4, 6, 8,
      8, 2, 6, 4,
      8, 6, 4, 2,
      6, 4, 8, 2,
    ])
  })

  it("multiply", () => {
    expect(a.multiply(b)).toValueEqual([
      42, 24, 35, 19,
      24, 18, 23, 15,
      35, 23, 38, 24,
      19, 15, 24, 22,
    ])
  })

  it("rotateX", () => {
    expect(a.rotateX(Math.PI / 4)).toValueEqual([
      1, 2, 3, 4,
      0, -1.414, 0.707, 0.707,
      5.657, 2.828, 3.535, 2.121,
      3, 2, 4, 1,
    ])
  })

  it("rotateY", () => {
    expect(a.rotateY(Math.PI / 4)).toValueEqual([
      3.535, 3.535, 3.535, 3.535,
      4, 1, 3, 2,
      2.121, 0.707, -0.707, -2.121,
      3, 2, 4, 1,
    ])
  })

  it("rotateZ", () => {
    expect(a.rotateZ(Math.PI / 4)).toValueEqual([
      -2.121, 0.707, 0, 1.414,
      3.535, 2.121, 4.242, 4.242,
      4, 3, 2, 1,
      3, 2, 4, 1,
    ])
  })

  it("translate", () => {
    expect(a.translate(2, 3, 4)).toValueEqual([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      33, 21,	27, 19,
    ])
  })

  it("scale", () => {
    expect(a.scale(2, 3, 4)).toValueEqual([
      2, 4, 6, 8,
      12, 3, 9, 6,
      16, 12, 8, 4,
      3, 2, 4, 1,
    ])
  })

  it("translationVector", () => {
    const m = new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      2, 2, 2, 1,
    ])
    expect(m.translationVector()).toValueEqual([2, 2, 2])
  })

  it("toArray", () => {
    expect(a.toArray()).toEqual(new Float32Array([
      1, 2,	3, 4,
      4, 1,	3, 2,
      4, 3,	2, 1,
      3, 2,	4, 1,
    ]))
  })

  it("rotationVector", () => {
    const m = Matrix4.compose(
      new Quaternion(0, 0.9238795292366128, 0, 0.38268342717215614),
      new Vector3(2, 3, 4),
      new Vector3(2, 3, 4),
    )
    expect(m.rotationVector()).toValueEqual([0, 0.924, 0, 0.383])
  })

  it("scalingVector", () => {
    const m = Matrix4.compose(
      new Quaternion(0, 0.9238795292366128, 0, 0.38268342717215614),
      new Vector3(2, 3, 4),
      new Vector3(2, 3, 4),
    )
    expect(m.scalingVector()).toValueEqual([2, 3, 4])
  })
})
