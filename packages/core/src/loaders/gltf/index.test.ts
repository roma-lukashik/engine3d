import { parseGltf } from "@core/loaders/gltf"
import { receivedGltf } from "@core/loaders/gltf/__test__/received"
import { expectedAnimation, expectedGltf } from "@core/loaders/gltf/__test__/expected"
import { Gltf } from "@core/loaders/types"
import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"

describe("parseGltf", () => {
  describe("advanced GLTF", () => {
    let scene: Object3d
    let animations: Animation[]
    beforeAll(async () => {
      const gltf = await parseGltf(receivedGltf)
      scene = gltf.scene
      animations = gltf.animations
    })

    it("builds scene hierarchy correctly", () => {
      expect(scene).toEqual(expectedGltf())
    })

    it("build animations correctly", () => {
      expect(animations).toEqual([expectedAnimation()])
    })
  })

  describe("errors handling", () => {
    it("throws an error if version is lower than 2", () => {
      const gltf: Gltf = {
        ...receivedGltf,
        asset: {
          version: "1",
        },
      }
      expect(() => parseGltf(gltf)).rejects.toThrowError("Unsupported *.gltf file. Version should be >= 2.0.")
    })
  })
})
