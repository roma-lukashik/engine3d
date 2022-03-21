import { Renderer } from '.'
import {
  mockCanvas,
  mockWebGLRenderingContext,
  WebGLRenderingContextStub,
} from '../../../tests/stubs/renderingContext'

describe('renderer', () => {
  let renderer: Renderer
  let gl: WebGLRenderingContextStub
  beforeEach(() => {
    ({ gl } = mockWebGLRenderingContext())
    renderer = new Renderer({
      canvas: mockCanvas(gl),
      width: 640,
      height: 480,
    })
  })

  it('should return renderer', () => {
    expect(renderer).toBeDefined()
  })
})