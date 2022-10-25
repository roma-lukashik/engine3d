import { ParsedGltf, parseGltf } from "@core/loaders/gltf"
import { receivedGltf } from "@core/loaders/gltf/__test__/received"
import { expectedAnimation, expectedGltf } from "@core/loaders/gltf/__test__/expected"
import { Gltf } from "@core/loaders/types"

type AnimationKeys = "animation_0"

describe("parseGltf", () => {
  describe("advanced GLTF", () => {
    let gltf: ParsedGltf<AnimationKeys>
    beforeAll(async () => {
      gltf = await parseGltf<"animation_0">(receivedGltf)
    })

    it("builds scene hierarchy correctly", () => {
      expect(gltf.node).toEqual(expectedGltf())
    })

    it("builds animations correctly", () => {
      expect(gltf.animations["animation_0"]).toEqual(expectedAnimation())
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
