import { PixelTexture } from '.'
import {
  mockWebGLRenderingContext,
  WebGLRenderingContextState,
  WebGLRenderingContextStub,
} from '../../../../tests/stubs/renderingContext'

describe('PixelTexture', () => {
  let state: WebGLRenderingContextState
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    ({ gl, state } = mockWebGLRenderingContext())
  })

  it('creates a texture', () => {
    const texture = new PixelTexture({ gl, register: 1 })
    expect(texture).toBeDefined()
  })

  it('has a proper register', () => {
    const texture = new PixelTexture({ gl, register: 1 })
    expect(texture.register).toBe(1)
  })

  it('creates a WebGL texture', () => {
    const texture = new PixelTexture({ gl, register: 1 })
    expect(texture.texture).toBeDefined()
  })

  it('assigns texture to the correct register', () => {
    const texture = new PixelTexture({ gl, register: 1 })
    expect(state.textureUnits[1].TEXTURE_2D).toBe(texture.texture)
  })

  describe('specifies a proper texture image', () => {
    it('has image size 1x1', () => {
      new PixelTexture({ gl, register: 1 })
      const args = gl.texImage2D.mock.calls[0]
      expect(args[3]).toBe(1)
      expect(args[4]).toBe(1)
    })

    it('uses default pixel color', () => {
      new PixelTexture({ gl, register: 1 })
      const args = gl.texImage2D.mock.calls[0] as any[]
      expect(args[8]).toEqual(new Uint8Array([100, 100, 100, 255]))
    })

    it('uses a custom pixel color', () => {
      new PixelTexture({ gl, register: 1, color: [0, 0, 0, 1] })
      const args = gl.texImage2D.mock.calls[0] as any[]
      expect(args[8]).toEqual(new Uint8Array([0, 0, 0, 1]))
    })
  })
})
