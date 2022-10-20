import { Skeleton } from "@core/skeleton"
import { Node } from "@core/node"
import { Matrix4 } from "@math/matrix4"

describe("Skeleton", () => {
  const bone1 = new Node({ matrix: Matrix4.scaling(2, 2, 2) })
  const bone2 = new Node({ matrix: Matrix4.scaling(3, 3, 3) })
  const bones = [bone1, bone2]
  bone1.updateWorldMatrix()
  bone2.updateWorldMatrix()

  const boneInverses = [
    Matrix4.translation(2, 2, 2),
    Matrix4.translation(3, 3, 3),
  ]

  it("to be defined", () => {
    expect(new Skeleton({ bones, boneInverses })).toBeDefined()
  })

  it("has correct assignment", () => {
    const skeleton = new Skeleton({ bones, boneInverses })
    expect(skeleton.bones).toBe(bones)
    expect(skeleton.boneInverses).toBe(boneInverses)
  })

  it("creates a boneMatrices with 32 length", () => {
    const skeleton = new Skeleton({ bones, boneInverses })
    expect(skeleton.boneMatrices).toHaveLength(32)
  })

  it("fills a boneMatrices array", () => {
    const skeleton = new Skeleton({ bones, boneInverses })
    const node = new Node({
      matrix: new Matrix4([
        1, 1, 1, -1,
        1, 1, -1, 1,
        1, -1, 1, 1,
        -1, 1, 1, 1,
      ]),
    })
    node.updateWorldMatrix()
    skeleton.update(node)

    expect(skeleton.boneMatrices).toEqual(new Float32Array([
      0.5, 0.5, 0.5, -0.5,
      0.5, 0.5, -0.5, 0.5,
      0.5, -0.5, 0.5, 0.5,
      2.75, 1.25, 1.25, 1.25,

      0.75, 0.75, 0.75, -0.75,
      0.75, 0.75, -0.75, 0.75,
      0.75, -0.75, 0.75, 0.75,
      6.5, 2.5, 2.5, 2.5,
    ]))
  })
})
