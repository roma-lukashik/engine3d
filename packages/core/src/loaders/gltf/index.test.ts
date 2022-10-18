import { parseGltf } from "@core/loaders/gltf"
import { receivedGltf } from "@core/loaders/gltf/__test__/received"
import { expectedGltf } from "@core/loaders/gltf/__test__/expected"
import { GltfRaw } from "@core/loaders/types"
import { Gltf } from "@core/gltf"

type AnimationKeys = "animation_0"

describe("parseGltf", () => {
  describe("advanced GLTF", () => {
    let gltf: Gltf<AnimationKeys>
    beforeAll(async () => {
      gltf = await parseGltf<"animation_0">(receivedGltf)
    })

    it("builds scene hierarchy correctly", () => {
      expect(gltf.node).toEqual(expectedGltf())
    })

    it.todo("animation")
  })

  describe("errors handling", () => {
    it("throws an error if version is lower than 2", () => {
      const gltf: GltfRaw = {
        ...receivedGltf,
        asset: {
          version: "1",
        },
      }
      expect(() => parseGltf(gltf)).rejects.toThrowError("Unsupported *.gltf file. Version should be >= 2.0.")
    })
  })
})
