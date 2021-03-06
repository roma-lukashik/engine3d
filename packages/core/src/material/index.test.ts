import { Material } from "@core/material"
import { AlphaMode } from "@core/loaders/types"
import { Vector3 } from "@math/vector3"
import { Vector4 } from "@math/vector4"

describe("Material", () => {
  it("uses default props", () => {
    const material = new Material()
    expect(material).toMatchObject<Partial<Material>>({
      color: new Vector3(1, 1, 1),
      opacity: 1,
      metalness: 1,
      roughness: 1,
      emissive: new Vector3(0, 0, 0),
      transparent: false,
    })
  })

  it("uses custom color", () => {
    const material = new Material({ color: new Vector4(0.1, 0.2, 0.3, 0.5) })
    expect(material).toMatchObject<Partial<Material>>({
      color: new Vector3(0.1, 0.2, 0.3),
      opacity: 0.5,
    })
  })

  it("handles Blend mode", () => {
    const material = new Material({ alphaMode: AlphaMode.Blend })
    expect(material).toMatchObject<Partial<Material>>({
      transparent: true,
      depthWrite: false,
    })
  })

  it("handles Mask mode", () => {
    const material = new Material({ alphaMode: AlphaMode.Mask, alphaCutoff: 0.3 })
    expect(material).toMatchObject<Partial<Material>>({
      transparent: false,
      alphaTest: 0.3,
    })
  })

  it("handles Mask mode with default alphaCutoff", () => {
    const material = new Material({ alphaMode: AlphaMode.Mask })
    expect(material.alphaTest).toBe(0.5)
  })
})
