import { Skeleton } from "@core/skeleton"
import { Object3d } from "@core/object3d"
import * as m4 from "@math/matrix4"

describe("Skeleton", () => {
  const bone1 = new Object3d({ matrix: m4.scaling(2, 2, 2) })
  const bone2 = new Object3d({ matrix: m4.scaling(3, 3, 3) })
  const bones = [bone1, bone2]
  bone1.updateWorldMatrix(m4.identity())
  bone2.updateWorldMatrix(m4.identity())

  const boneInverseMatrix1 = m4.translation(2, 2, 2)
  const boneInverseMatrix2 = m4.translation(3, 3, 3)
  const boneInverses = [boneInverseMatrix1, boneInverseMatrix2]

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
    skeleton.update(new Object3d())

    expect(skeleton.boneMatrices).toEqual(new Float32Array([
      2, 0, 0, 0,
      0, 2, 0, 0,
      0, 0, 2, 0,
      4, 4, 4, 1,

      3, 0, 0, 0,
      0, 3, 0, 0,
      0, 0, 3, 0,
      9, 9, 9, 1,
    ]))
  })
})