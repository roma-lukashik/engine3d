import { Vector3 } from "@math/vector3"
import { PerspectiveCamera } from "@core/camera/perspective"

describe("PerspectiveCamera", () => {
  describe("with default options", () => {
    const camera = new PerspectiveCamera()

    it("has a correct position", () => {
      expect(camera.position).toValueEqual([0, 0, 0])
    })

    it("has a correct target position", () => {
      expect(camera.target).toValueEqual([0, 0, 0])
    })

    it("has a correct projection matrix", () => {
      expect(camera.projectionMatrix).toValueEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    })
  })

  describe("with custom options", () => {
    let camera: PerspectiveCamera
    beforeEach(() => {
      camera = new PerspectiveCamera()
      camera.setPosition(new Vector3(10, 5, 2))
    })

    it("calculates projection correctly #1", () => {
      expect(camera.projectionMatrix).toValueEqual([
        0.3397, -0.7477, -0.88, -0.88,
        0, 1.555, -0.44, -0.44,
        -1.698, -0.149, -0.176, -0.176,
        0, 0, 11.159, 11.358,
      ])
    })

    it("calculates projection correctly #2", () => {
      camera.lookAt(new Vector3(1, 1, 1))
      expect(camera.projectionMatrix).toValueEqual([
        0.191, -0.6956, -0.909, -0.909,
        0, 1.584, -0.404, -0.404,
        -1.721, -0.077, -0.101, -0.101,
        1.53, -0.811, 11.115, 11.314,
      ])
    })

    it("uses an identity matrix if position equals target", () => {
      camera.lookAt(new Vector3(10, 5, 2))

      expect(camera.projectionMatrix).toValueEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    })

    it("sets options correctly", () => {
      camera.setOptions({
        near: 1,
        far: 1000,
        aspect: 16 / 9,
        fovy: Math.PI / 2,
      })

      expect(camera.projectionMatrix).toValueEqual([
        0.11, -0.432, -0.882, -0.88,
        0, 0.898, -0.441, -0.44,
        -0.552, -0.086, -0.176, -0.176,
        0, 0, 9.378, 11.358,
      ])
    })
  })

  describe("setPosition", () => {
    let camera: PerspectiveCamera
    beforeEach(() => {
      camera = new PerspectiveCamera()
    })

    it("copies position by value", () => {
      const position = Vector3.one()
      camera.setPosition(position)
      position.set(1, 2, 3)
      expect(camera.position).toValueEqual([1, 1, 1])
    })
  })

  describe("lookAt", () => {
    let camera: PerspectiveCamera
    beforeEach(() => {
      camera = new PerspectiveCamera()
    })

    it("copies target by value", () => {
      const target = Vector3.one()
      camera.lookAt(target)
      target.set(1, 2, 3)
      expect(camera.target).toValueEqual([1, 1, 1])
    })
  })
})
