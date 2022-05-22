import { Object3d } from "@core/object3d"
import { Matrix4 } from "@math/types"

describe("Object3d", () => {
  it("has a default properties", () => {
    const object = new Object3d()
    expect(object).toMatchObject<Partial<Object3d>>({
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, 1],
      matrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
    })
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

  it("updates TRS and matrix", () => {
    const object = new Object3d()
    const matrix: Matrix4 = [
      -1.414, 0, -1.414, 0,
      0, 3, 0, 0,
      1.414, 0, -1.414, 0,
      2, 3, 4, 1,
    ]
    object.updateMatrix(matrix)
    expect(object.matrix).toEqual(matrix)
    expect(object.position).toCloseEqual([2, 3, 4])
    expect(object.scale).toCloseEqual([2, 3, 2])
    expect(object.rotation).toCloseEqual([0, 0.924, 0, 0.3827])
  })

  it("adds children", () => {
    const parent = new Object3d()
    const child1 = new Object3d()
    const child2 = new Object3d()
    parent.add(child1, child2)
    expect(parent.children).toEqual([child1, child2])
  })
})
