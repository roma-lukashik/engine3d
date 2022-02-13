import { createRenderer } from '.'

describe('renderer', () => {
  let gl: ReturnType<typeof createRenderer>
  beforeEach(() => {
    gl = createRenderer({
      canvas: document.createElement('canvas'),
      width: 640,
      height: 480,
    })
  })

  it('should return renderer', () => {
    expect(gl).toBeDefined()
  })
})
