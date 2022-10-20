import { LocationAttribute } from "@webgl/attributes/locationAttribute"

describe("LocationAttribute", () => {
  const locationAttribute = new LocationAttribute(0, 1, "test")

  it("to be defined", () => {
    expect(locationAttribute).toBeDefined()
  })

  it("has proper fields", () => {
    expect(locationAttribute.name).toBe("test")
    expect(locationAttribute.location).toBe(0)
    expect(locationAttribute.type).toBe(1)
  })
})
