import { Object3D } from "@core/object3d"
import { Mesh } from "@core/mesh"
import { Geometry } from "@core/geometry"
import { BufferAttribute } from "@core/bufferAttribute"
import { Material } from "@core/material"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"

describe("Object3D", () => {
  let object3d: Object3D
  beforeEach(() => {
    object3d = new Object3D(createNode())
  })

  describe("setMass", () => {
    it("handles mass correctly", () => {
      object3d.setMass(10)
      expect(object3d.mass).toBe(10)
      expect(object3d.invMass).toBe(0.1)
    })

    it("handles zero mass correctly", () => {
      object3d.setMass(0)
      expect(object3d.mass).toBe(0)
      expect(object3d.invMass).toBe(0)
    })
  })

  describe("calculates bounding boxes", () => {
    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-5, 0, -1])
      expect(object3d.aabb.max).toValueEqual([5, 5, 1])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([0, 2.5, 0])
      expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("move", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-4, 2, 2])
      expect(object3d.aabb.max).toValueEqual([6, 7, 4])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([1, 4.5, 3])
      expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setPosition", () => {
    beforeEach(() => {
      object3d.setPosition(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-4, 2, 2])
      expect(object3d.aabb.max).toValueEqual([6, 7, 4])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([1, 4.5, 3])
      expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setScale", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2.5, 0, -5])
      expect(object3d.aabb.max).toValueEqual([2.5, 10, 5])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([0, 5, 0])
      expect(object3d.oobb.halfSize).toValueEqual([2.5, 5, 5])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setRotation", () => {
    describe("by 90 deg", () => {
      beforeEach(() => {
        object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      })

      it("aabb", () => {
        expect(object3d.aabb.min).toValueEqual([-1, 0, -5])
        expect(object3d.aabb.max).toValueEqual([1, 5, 5])
      })

      it("oobb", () => {
        expect(object3d.oobb.center).toValueEqual([0, 2.5, 0])
        expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
        expect(object3d.oobb.rotation).toValueEqual([0, 0.707, 0, 0.707])
      })
    })

    describe("by 45 deg", () => {
      beforeEach(() => {
        object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4))
      })

      it("aabb", () => {
        expect(object3d.aabb.min).toValueEqual([-4.243, 0, -4.243]) // 2.828
        expect(object3d.aabb.max).toValueEqual([4.243, 5, 4.243])
      })

      it("oobb", () => {
        expect(object3d.oobb.center).toValueEqual([0, 2.5, 0])
        expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
        expect(object3d.oobb.rotation).toValueEqual([0, 0.383, 0, 0.924])
      })
    })
  })

  describe("scale and move", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-1.5, 2, -2])
      expect(object3d.aabb.max).toValueEqual([3.5, 12, 8])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([1, 7, 3])
      expect(object3d.oobb.halfSize).toValueEqual([2.5, 5, 5])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("rotate and move", () => {
    beforeEach(() => {
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([0, 2, -2])
      expect(object3d.aabb.max).toValueEqual([2, 7, 8])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([1, 4.5, 3])
      expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
      expect(object3d.oobb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  // is not the same as scale and move
  describe("move and scale", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2, 4, 10])
      expect(object3d.aabb.max).toValueEqual([3, 14, 20])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([0.5, 9, 15])
      expect(object3d.oobb.halfSize).toValueEqual([2.5, 5, 5])
      expect(object3d.oobb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("rotate and scale", () => {
    beforeEach(() => {
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it.todo("aabb")

    it.todo("oobb")
  })

  describe("move and rotate", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([0, 2, -2])
      expect(object3d.aabb.max).toValueEqual([2, 7, 8])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([1, 4.5, 3])
      expect(object3d.oobb.halfSize).toValueEqual([5, 2.5, 1])
      expect(object3d.oobb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  describe("scale and rotate", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-5, 0, -2.5])
      expect(object3d.aabb.max).toValueEqual([5, 10, 2.5])
    })

    it("oobb", () => {
      expect(object3d.oobb.center).toValueEqual([0, 5, 0])
      expect(object3d.oobb.halfSize).toValueEqual([2.5, 5, 5])
      expect(object3d.oobb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })
})

function createNode(): Mesh {
  return new Mesh({
    geometry: new Geometry({
      POSITION: new BufferAttribute({
        array: new Float32Array([
          -5, 0, 1,
          -5, 5, 1,
          5, 5, 1,
          5, 0, 1,
          -5, 0, -1,
          -5, 5, -1,
          5, 5, -1,
          5, 0, -1,
        ]),
        itemSize: 3,
      }),
    }),
    material: new Material(),
  })
}
