import { renderer } from '.'

describe("renderer", () => {
  let gl: WebGL2RenderingContext
  beforeEach(() => {
    gl = renderer({
      canvas: document.createElement('canvas'),
      width: 640,
      height: 480,
    })
  })

  it("should return GL context", () => {
    expect(gl).toBeDefined()
  })
})
