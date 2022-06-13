import { Object3d } from "@core/object3d"
import * as m4 from "@math/matrix4"
import { PI } from "@math/constants"

describe("Object3d", () => {
  it("has a default properties", () => {
    const object = new Object3d()
    expect(object).toMatchObject<Partial<Object3d>>({
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, 1],
      localMatrix: [
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
    expect(object.localMatrix).toCloseEqual([
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

  it("adds children", () => {
    const parent = new Object3d()
    const child1 = new Object3d()
    const child2 = new Object3d()
    parent.add([child1, child2])
    expect(parent.children).toEqual([child1, child2])
  })

  it("goes through all children", () => {
    const fn = jest.fn()
    const root = new Object3d()
    const child1 = new Object3d()
    const child2 = new Object3d()
    const child11 = new Object3d()
    root.add([child1, child2])
    child1.add([child11])
    root.traverse(fn)
    expect(fn).toHaveBeenNthCalledWith(1, root)
    expect(fn).toHaveBeenNthCalledWith(2, child1)
    expect(fn).toHaveBeenNthCalledWith(3, child11)
    expect(fn).toHaveBeenNthCalledWith(4, child2)
  })

  it("updates world matrices", () => {
    const root = new Object3d()
    const child1 = new Object3d({ matrix: m4.translation(2, 2, 2) })
    const child2 = new Object3d({ matrix: m4.scaling(1, 2, 3) })
    const child11 = new Object3d({ matrix: m4.rotateY(m4.identity(), PI) })
    root.add([child1, child2])
    child1.add([child11])
    root.updateWorldMatrix(m4.translation(1, 2, 3))

    expect(root.worldMatrix).toCloseEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      1, 2, 3, 1,
    ])

    expect(child1.worldMatrix).toCloseEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      3, 4, 5, 1,
    ])

    expect(child2.worldMatrix).toCloseEqual([
      1, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 3, 0,
      1, 2, 3, 1,
    ])

    expect(child11.worldMatrix).toCloseEqual([
      -1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, -1, 0,
      3, 4, 5, 1,
    ])
  })
})
