import { bindTexture, createTexture2D, supportMipmap } from "@webgl/textures/utils"
import { WebGLRenderingContextStub } from "../../../../../tests/stubs/renderingContext"

describe("Texture Utils", () => {
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    gl = new WebGLRenderingContextStub()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("createTexture2D", () => {
    it("creates a texture", () => {
      const texture = createTexture2D(gl)
      expect(texture).toBeDefined()
    })

    it("binds texture to the 0 register", () => {
      const texture = createTexture2D(gl)
      expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toEqual(texture)
    })

    it("throws an error if texture cannot be created", () => {
      jest.spyOn(gl, "createTexture").mockReturnValue(null)
      expect(() => createTexture2D(gl)).toThrowError("Cannot create a texture")
    })
  })

  describe("bindTexture", () => {
    it("binds texture", () => {
      const texture = {} as WebGLTexture
      bindTexture(gl, texture, 2)
      expect(gl.getParameter(gl.TEXTURE_BINDING_2D)).toBe(texture)
    })
  })

  describe("supportMipmap", () => {
    it.each([0, 1, 2, 32, 128, 1024])("returns true for %s", (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(true)
    })

    it.each([3, 31, 127, 1025])("returns false for %s", (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(false)
    })
  })
})
