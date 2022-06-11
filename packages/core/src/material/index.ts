import { AlphaMode } from "@core/loaders/types"
import { Texture } from "@core/texture"
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
  colorTexture?: Texture
  metallicRoughnessTexture?: Texture
  normalTexture?: Texture
  occlusionTexture?: Texture
  emissiveTexture?: Texture
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
  public colorTexture?: Texture
  public metallicRoughnessTexture?: Texture
  public normalTexture?: Texture
  public occlusionTexture?: Texture
  public emissiveTexture?: Texture

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

    this.colorTexture = colorTexture
    this.metallicRoughnessTexture = metallicRoughnessTexture
    this.normalTexture = normalTexture
    this.occlusionTexture = occlusionTexture
    this.emissiveTexture = emissiveTexture

    if (alphaMode === AlphaMode.Blend) {
      this.transparent = true
      this.depthWrite = false
    } else {
      this.transparent = false
      if (alphaMode === AlphaMode.Mask) {
        this.alphaTest = alphaCutoff
      }
    }
  }
}
