import { Object3d } from "@core/object3d"

describe("Object3d", () => {
  it("has a default properties", () => {
    const object = new Object3d()
    expect(object.position).toEqual([0, 0, 0])
    expect(object.scale).toEqual([1, 1, 1])
    expect(object.rotation).toEqual([0, 0, 0, 1])
    expect(object.matrix).toEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(object.children).toHaveLength(0)
  })

  it("updates a matrix when TRS is passed", () => {
    const object = new Object3d({
      position: [2, 3, 4],
      rotation: [0, 0.9238795292366128, 0, 0.38268342717215614],
      scale: [2, 3, 2],
    })
    expect(object.matrix).toCloseEqual([
      -1.414, 0, -1.414, 0,
      0, 3, 0, 0,
      1.414, 0, -1.414, 0,
      2, 3, 4, 1,
    ])
  })

  it("updates TRS when a matrix is passed", () => {
    const object = new Object3d({
      matrix: [
        -1.414, 0, -1.414, 0,
        0, 3, 0, 0,
        1.414, 0, -1.414, 0,
        2, 3, 4, 1,
      ],
    })
    expect(object.position).toCloseEqual([2, 3, 4])
    expect(object.scale).toCloseEqual([2, 3, 2])
    expect(object.rotation).toCloseEqual([0, 0.924, 0, 0.3827])
  })
})
