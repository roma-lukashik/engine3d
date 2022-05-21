import { createTexture2D, supportMipmap } from "@webgl/textures/utils"
import {
  createWebGLRenderingContextStub,
  WebGLConstant,
} from "../../../../../tests/stubs/renderingContext"

describe("Texture Utils", () => {
  let state: Parameters<typeof createWebGLRenderingContextStub>[0]
  let gl: ReturnType<typeof createWebGLRenderingContextStub>
  beforeEach(() => {
    state = {
      activeTextureUnit: WebGLConstant.TEXTURE0,
      textureUnits: [],
      textureParams: [],
    }
    gl = createWebGLRenderingContextStub(state)
  })

  describe("#createTexture2D", () => {
    it("creates a texture", () => {
      const texture = createTexture2D(gl)
      expect(texture).toBeDefined()
    })

    it("binds texture to the 0 register", () => {
      const texture = createTexture2D(gl)
      expect(state.textureUnits[0]).toEqual({ TEXTURE_2D: texture, TEXTURE_CUBE_MAP: null })
    })
  })

  describe("#isPowerOf2", () => {
    it.each([0, 1, 2, 32, 128, 1024])("returns true for %s", (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(true)
    })

    it.each([3, 31, 127, 1025])("returns false for %s", (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(false)
    })
  })
})
