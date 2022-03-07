import { createTexture2D, isPowerOf2 } from '.'
import {
  createWebGLRenderingContextState,
  createWebGLRenderingContextStub,
  WebGLRenderingContextState,
  WebGLRenderingContextStub,
} from '../../../../tests/stubs/renderingContext'

describe('Texture Utils', () => {
  let state: WebGLRenderingContextState
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    state = createWebGLRenderingContextState()
    gl = createWebGLRenderingContextStub(state)
  })

  describe('#createTexture2D', () => {
    it('creates a texture', () => {
      const textureRegister = 1
      const texture = createTexture2D(gl, textureRegister)
      expect(texture).toBeDefined()
    })

    it.each([0, 1, 2, 3])('binds active texture for %s register', (register) => {
      const texture = createTexture2D(gl, register)
      expect(state.textureUnits[register]).toEqual({ TEXTURE_2D: texture, TEXTURE_CUBE_MAP: null })
    })
  })

  describe('#isPowerOf2', () => {
    it.each([0, 1, 2, 32, 128, 1024])('returns true for %s', (value) => {
      expect(isPowerOf2(value)).toBe(true)
    })

    it.each([3, 31, 127, 1025])('returns false for %s', (value) => {
      expect(isPowerOf2(value)).toBe(false)
    })
  })
})
