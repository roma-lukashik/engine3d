import { Texture } from "@core/texture"

describe("Texture", () => {
  const source: Readonly<ImageData> = {
    width: 100,
    height: 100,
    data: new Uint8ClampedArray(),
    colorSpace: "srgb",
  }

  it("to be defined", () => {
    expect(new Texture({ source })).toBeDefined()
  })

  it("has a image source", () => {
    const texture = new Texture({ source })
    expect(texture.source).toBe(source)
  })
})
