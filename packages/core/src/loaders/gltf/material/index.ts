import { GltfMaterial } from "@core/loaders/types"
import * as v4 from "@math/vector4"
import * as v3 from "@math/vector3"
import { Vector3 } from "@math/types"

export class Material {
  public color: Vector3
  public opacity: number
  public metalness: number
  public roughness: number
  public transparent: boolean
  public depthWrite: boolean
  public alphaTest: number
  public emissive: Vector3

  constructor({
    alphaMode = "OPAQUE",
    alphaCutoff = 0.5,
    pbrMetallicRoughness: {
      baseColorFactor = v4.one(),
      metallicFactor = 1.0,
      roughnessFactor = 1.0,
      baseColorTexture,
      metallicRoughnessTexture,
    } = {},
    normalTexture,
    occlusionTexture,
    emissiveTexture,
    emissiveFactor = v3.zero(),
  }: GltfMaterial = {}) {
    const [r, g, b, a] = baseColorFactor
    this.color = [r, g, b]
    this.opacity = a
    this.metalness = metallicFactor
    this.roughness = roughnessFactor
    // check material type
    this.emissive = emissiveFactor

    if (alphaMode === "BLEND") {
      this.transparent = true
      this.depthWrite = false
    } else {
      this.transparent = false
      if (alphaMode === "MASK") {
        this.alphaTest = alphaCutoff
      }
    }

    if (baseColorTexture) {
      // attach texture
    }

    if (metallicRoughnessTexture) {
      // attach texture
    }

    if (normalTexture) {
      // attach texture
    }

    if (occlusionTexture) {
      // attach texture
    }

    if (emissiveTexture) {
      // attach texture
    }
  }
}
