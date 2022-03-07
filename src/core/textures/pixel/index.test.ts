import { PixelTexture } from '.'
import {
  createWebGLRenderingContextState,
  createWebGLRenderingContextStub,
  WebGLRenderingContextState,
  WebGLRenderingContextStub,
} from '../../../../tests/stubs/renderingContext'

describe('PixelTexture', () => {
  let state: WebGLRenderingContextState
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    state = createWebGLRenderingContextState()
    gl = createWebGLRenderingContextStub(state)
  })

  it('creates a texture', () => {
    const texture = new PixelTexture({ gl, register: 0 })
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

  it.todo('specifies correct texture image')
})
