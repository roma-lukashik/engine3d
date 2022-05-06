import { WebGLColorTexture } from '.'
import { createWebGLRenderingContextStub, WebGLConstant } from '../../../../tests/stubs/renderingContext'

describe('ColorTexture', () => {
  let state: Parameters<typeof createWebGLRenderingContextStub>[0]
  let gl: ReturnType<typeof createWebGLRenderingContextStub>
  let texture: WebGLColorTexture
  beforeEach(() => {
    state = {
      activeTextureUnit: WebGLConstant.TEXTURE0,
      textureUnits: [],
      textureParams: [],
    }
    gl = createWebGLRenderingContextStub(state)
    texture = new WebGLColorTexture({ gl, color: [1, 1, 1] })
  })

  it('creates a texture', () => {
    expect(texture).toBeDefined()
  })

  it('creates a WebGL texture', () => {
    expect(texture.texture).toBeDefined()
  })

  it('assigns texture to the correct register', () => {
    expect(state.textureUnits[0].TEXTURE_2D).toBe(texture.texture)
  })

  describe('specifies a proper texture image', () => {
    it('has image size 1x1', () => {
      expect(state.textureParams[0].width).toBe(1)
      expect(state.textureParams[0].height).toBe(1)
    })

    it('uses correct pixel color', () => {
      expect(state.textureParams[0].buffer).toEqual(new Uint8Array([255, 255, 255, 255]))
    })
  })
})
