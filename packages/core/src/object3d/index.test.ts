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
      expect(object3d.aabb.min).toValueEqual([-7, 0, -3])
      expect(object3d.aabb.max).toValueEqual([5, 5, 1])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([-1, 2.5, -1])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("move", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-6, 2, 0])
      expect(object3d.aabb.max).toValueEqual([6, 7, 4])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0, 4.5, 2])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setPosition", () => {
    beforeEach(() => {
      object3d.setPosition(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-6, 2, 0])
      expect(object3d.aabb.max).toValueEqual([6, 7, 4])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0, 4.5, 2])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setScale", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-3.5, 0, -15])
      expect(object3d.aabb.max).toValueEqual([2.5, 10, 5])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([-0.5, 5, -5])
      expect(object3d.obb.halfSize).toValueEqual([3, 5, 10])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("setRotation", () => {
    describe("by 90 deg", () => {
      beforeEach(() => {
        object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      })

      it("aabb", () => {
        expect(object3d.aabb.min).toValueEqual([-3, 0, -5])
        expect(object3d.aabb.max).toValueEqual([1, 5, 7])
      })

      it("obb", () => {
        expect(object3d.obb.center).toValueEqual([-1, 2.5, 1])
        expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
        expect(object3d.obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
      })
    })

    describe("by 45 deg", () => {
      beforeEach(() => {
        object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4))
      })

      it("aabb", () => {
        expect(object3d.aabb.min).toValueEqual([-7.071, 0, -5.657])
        expect(object3d.aabb.max).toValueEqual([4.243, 5, 5.657])
      })

      it("obb", () => {
        expect(object3d.obb.center).toValueEqual([-1.414, 2.5, 0])
        expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
        expect(object3d.obb.rotation).toValueEqual([0, 0.383, 0, 0.924])
      })
    })
  })

  describe("scale and move", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2.5, 2, -12])
      expect(object3d.aabb.max).toValueEqual([3.5, 12, 8])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0.5, 7, -2])
      expect(object3d.obb.halfSize).toValueEqual([3, 5, 10])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("move and scale", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2.5, 2, -12])
      expect(object3d.aabb.max).toValueEqual([3.5, 12, 8])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0.5, 7, -2])
      expect(object3d.obb.halfSize).toValueEqual([3, 5, 10])
      expect(object3d.obb.rotation).toValueEqual([0, 0, 0, 1])
    })
  })

  describe("rotate and move", () => {
    beforeEach(() => {
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      object3d.move(new Vector3(1, 2, 3))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2, 2, -2])
      expect(object3d.aabb.max).toValueEqual([2, 7, 10])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0, 4.5, 4])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  describe("move and rotate", () => {
    beforeEach(() => {
      object3d.move(new Vector3(1, 2, 3))
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-2, 2, -2])
      expect(object3d.aabb.max).toValueEqual([2, 7, 10])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([0, 4.5, 4])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  describe("rotate and scale", () => {
    beforeEach(() => {
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
      object3d.setScale(new Vector3(0.5, 2, 5))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-15, 0, -2.5])
      expect(object3d.aabb.max).toValueEqual([5, 10, 3.5])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([-5, 5, 0.5])
      expect(object3d.obb.halfSize).toValueEqual([3, 5, 10])
      expect(object3d.obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  describe("scale and rotate", () => {
    beforeEach(() => {
      object3d.setScale(new Vector3(0.5, 2, 5))
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-15, 0, -2.5])
      expect(object3d.aabb.max).toValueEqual([5, 10, 3.5])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([-5, 5, 0.5])
      expect(object3d.obb.halfSize).toValueEqual([3, 5, 10])
      expect(object3d.obb.rotation).toValueEqual([0, 0.707, 0, 0.707])
    })
  })

  describe("rotate and rotate", () => {
    beforeEach(() => {
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, -1, 0), Math.PI / 8))
      object3d.setRotation(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4))
    })

    it("aabb", () => {
      expect(object3d.aabb.min).toValueEqual([-7.071, 0, -5.657])
      expect(object3d.aabb.max).toValueEqual([4.243, 5, 5.657])
    })

    it("obb", () => {
      expect(object3d.obb.center).toValueEqual([-1.414, 2.5, 0])
      expect(object3d.obb.halfSize).toValueEqual([6, 2.5, 2])
      expect(object3d.obb.rotation).toValueEqual([0, 0.383, 0, 0.924])
    })
  })
})

function createNode(): Mesh {
  return new Mesh({
    geometry: new Geometry({
      POSITION: new BufferAttribute({
        array: new Float32Array([
          -7, 0, 1,
          -7, 5, 1,
          5, 5, 1,
          5, 0, 1,
          -7, 0, -3,
          -7, 5, -3,
          5, 5, -3,
          5, 0, -3,
        ]),
        itemSize: 3,
      }),
    }),
    material: new Material(),
  })
}
