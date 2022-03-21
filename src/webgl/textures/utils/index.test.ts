import { createTexture2D, supportMipmap } from '.'
import {
  mockWebGLRenderingContext,
  WebGLRenderingContextState,
  WebGLRenderingContextStub,
} from '../../../../tests/stubs/renderingContext'

describe('Texture Utils', () => {
  let state: WebGLRenderingContextState
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    ({ gl, state } = mockWebGLRenderingContext())
  })

  describe('#createTexture2D', () => {
    it('creates a texture', () => {
      const texture = createTexture2D(gl)
      expect(texture).toBeDefined()
    })

    it.each([0, 1, 2, 3])('binds active texture for %s register', (register) => {
      const texture = createTexture2D(gl)
      expect(state.textureUnits[register]).toEqual({ TEXTURE_2D: texture, TEXTURE_CUBE_MAP: null })
    })
  })

  describe('#isPowerOf2', () => {
    it.each([0, 1, 2, 32, 128, 1024])('returns true for %s', (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(true)
    })

    it.each([3, 31, 127, 1025])('returns false for %s', (value) => {
      expect(supportMipmap({ width: value, height: value })).toBe(false)
    })
  })
})
