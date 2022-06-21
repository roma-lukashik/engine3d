import { OrthographicCamera } from "@core/camera/orthographic"
import { Vector3 } from "@math/vector3"

describe("OrthographicCamera", () => {
  describe("with default options", () => {
    const camera = new OrthographicCamera({
      left: -5,
      right: 5,
      top: -5,
      bottom: 5
    })

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
    let camera: OrthographicCamera
    beforeEach(() => {
      camera = new OrthographicCamera({
        left: -5,
        right: 5,
        top: -5,
        bottom: 5,
        zoom: 1,
        near: 0.1,
        far: 100,
      })
      camera.setPosition(new Vector3(1, 1, 1))
    })

    it("calculates a projection matrix #1", () => {
      expect(camera.projectionMatrix).toValueEqual([
        0.141, 0.082, -0.012, 0,
        0, -0.163, -0.012, 0,
        -0.141, 0.082, -0.012, 0,
        0, 0, -0.967, 1,
      ])
    })

    it("calculates a projection matrix #2", () => {
      camera.lookAt(new Vector3(10, 0, -5))
      expect(camera.projectionMatrix).toValueEqual([
        0.111, -0.015, 0.017, 0,
        0, -0.199, -0.002, 0,
        0.166, 0.01, -0.011, 0,
        -0.277, 0.204, -1.006, 1,
      ])
    })

    it("uses an identity matrix if position equals target", () => {
      camera.lookAt(new Vector3(1, 1, 1))
      expect(camera.projectionMatrix).toValueEqual([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ])
    })

    it("sets options", () => {
      camera.setOptions({
        left: -10,
        right: 10,
        top: -10,
        bottom: 10,
      })
      expect(camera.projectionMatrix).toValueEqual([
        0.071, 0.041, -0.012, 0,
        0, -0.082, -0.012, 0,
        -0.071, 0.041, -0.012, 0,
        0, 0, -0.967, 1,
      ])
    })
  })
})
