import { Node } from "@core/node"
import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { PI } from "@math/constants"

describe("Node", () => {
  it("has a default properties", () => {
    const node = new Node()
    expect(node).toMatchObject<Partial<Node>>({
      position: Vector3.zero(),
      scale: Vector3.one(),
      rotation: Quaternion.identity(),
      localMatrix: Matrix4.identity(),
    })
  })

  it("updates a matrix when TRS is passed", () => {
    const node = new Node({
      position: new Vector3(2, 3, 4),
      rotation: new Quaternion(0, 0.9238795292366128, 0, 0.38268342717215614),
      scale: new Vector3(2, 3, 2),
    })
    expect(node.localMatrix).toValueEqual([
      -1.414, 0, -1.414, 0,
      0, 3, 0, 0,
      1.414, 0, -1.414, 0,
      2, 3, 4, 1,
    ])
  })

  it("updates TRS when a matrix is passed", () => {
    const node = new Node({
      matrix: new Matrix4([
        -1.414, 0, -1.414, 0,
        0, 3, 0, 0,
        1.414, 0, -1.414, 0,
        2, 3, 4, 1,
      ]),
    })
    expect(node.position).toValueEqual([2, 3, 4])
    expect(node.scale).toValueEqual([2, 3, 2])
    expect(node.rotation).toValueEqual([0, 0.924, 0, 0.3827])
  })

  it("adds children", () => {
    const parent = new Node()
    const child1 = new Node()
    const child2 = new Node()
    parent.add([child1, child2])
    expect(parent.children).toEqual([child1, child2])
  })

  it("goes through all children", () => {
    const fn = jest.fn()
    const root = new Node()
    const child1 = new Node()
    const child2 = new Node()
    const child11 = new Node()
    root.add([child1, child2])
    child1.add([child11])
    root.traverse(fn)
    expect(fn).toHaveBeenNthCalledWith(1, root)
    expect(fn).toHaveBeenNthCalledWith(2, child1)
    expect(fn).toHaveBeenNthCalledWith(3, child11)
    expect(fn).toHaveBeenNthCalledWith(4, child2)
  })

  it("updates world matrices", () => {
    const root = new Node()
    const child1 = new Node({ matrix: Matrix4.translation(2, 2, 2) })
    const child2 = new Node({ matrix: Matrix4.scaling(1, 2, 3) })
    const child11 = new Node({ matrix: Matrix4.rotationY(PI) })
    root.add([child1, child2])
    child1.add([child11])
    root.localMatrix = Matrix4.translation(1, 2, 3)
    root.updateWorldMatrix()

    expect(root.worldMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      1, 2, 3, 1,
    ])

    expect(child1.worldMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      3, 4, 5, 1,
    ])

    expect(child2.worldMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 3, 0,
      1, 2, 3, 1,
    ])

    expect(child11.worldMatrix).toValueEqual([
      -1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, -1, 0,
      3, 4, 5, 1,
    ])
  })
})
