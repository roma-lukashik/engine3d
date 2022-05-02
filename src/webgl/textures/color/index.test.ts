import { WebGLColorTexture } from '.'
import {
  mockWebGLRenderingContext,
  WebGLRenderingContextState,
  WebGLRenderingContextStub,
} from '../../../../tests/stubs/renderingContext'

describe('PixelTexture', () => {
  let state: WebGLRenderingContextState
  let gl: WebGLRenderingContextStub
  let texture: WebGLColorTexture
  beforeEach(() => {
    ({ gl, state } = mockWebGLRenderingContext())
    texture = new WebGLColorTexture({ gl, color: 0xFFFFFF })
  })

  it('creates a texture', () => {
    expect(texture).toBeDefined()
  })

  it('creates a WebGL texture', () => {
    expect(texture.texture).toBeDefined()
  })

  it('assigns texture to the correct register', () => {
    expect(state.textureUnits[1].TEXTURE_2D).toBe(texture.texture)
  })

  describe('specifies a proper texture image', () => {
    it('has image size 1x1', () => {
      const args = gl.texImage2D.mock.calls[0]
      expect(args[3]).toBe(1)
      expect(args[4]).toBe(1)
    })

    it('uses correct pixel color', () => {
      const args = gl.texImage2D.mock.calls[0] as any[]
      expect(args[8]).toEqual(new Uint8Array([255, 255, 255, 255]))
    })
  })
})
