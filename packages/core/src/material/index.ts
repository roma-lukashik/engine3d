import { AlphaMode } from "@core/loaders/types"
import * as v4 from "@math/vector4"
import * as v3 from "@math/vector3"
import { Vector3, Vector4 } from "@math/types"

type Props = {
  alphaMode?: AlphaMode
  alphaCutoff?: number
  color?: Vector4
  metallic?: number
  roughness?: number
  emissive?: Vector3
  // TODO: specify types
  colorTexture?: any
  metallicRoughnessTexture?: any
  normalTexture?: any
  occlusionTexture?: any
  emissiveTexture?: any
}

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
    alphaMode = AlphaMode.Opaque,
    alphaCutoff = 0.5,
    color = v4.one(),
    metallic = 1.0,
    roughness = 1.0,
    emissive = v3.zero(),
    colorTexture,
    metallicRoughnessTexture,
    normalTexture,
    occlusionTexture,
    emissiveTexture,
  }: Props = {}) {
    const [r, g, b, a] = color
    this.color = [r, g, b]
    this.opacity = a
    this.metalness = metallic
    this.roughness = roughness
    // check material type
    this.emissive = emissive

    if (alphaMode === AlphaMode.Blend) {
      this.transparent = true
      this.depthWrite = false
    } else {
      this.transparent = false
      if (alphaMode === AlphaMode.Mask) {
        this.alphaTest = alphaCutoff
      }
    }

    if (colorTexture) {
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
