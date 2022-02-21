import { createCamera } from '.'
import { vector3 } from '../../math/vector3'

describe('camera', () => {
  describe('with default options', () => {
    const camera = createCamera({})

    it('has a correct position', () => {
      expect(camera.getPosition()).toEqual([0, 0, 0])
    })

    it('has a correct target position', () => {
      expect(camera.getTarget()).toEqual([0, 0, 0])
    })
  })

  describe('with custom options', () => {
    const position = vector3(10, 5, 2)

    it('calculates projection correctly #1', () => {
      const camera = createCamera({ position })
      expect(camera.projectionMatrix).toPrettyEqual([
        0.3397, -0.7477, -0.88, -0.88,
        0, 1.555, -0.44, -0.44,
        -1.698, -0.149, -0.176, -0.176,
        0, 0, 11.159, 11.358,
      ])
    })

    it('calculates projection correctly #2', () => {
      const camera = createCamera({ position })
      camera.lookAt(vector3(1, 1, 1))
      expect(camera.projectionMatrix).toPrettyEqual([
        0.191, -0.6956, -0.909, -0.909,
        0 ,1.584, -0.404, -0.404,
        -1.721, -0.077, -0.101, -0.101,
        1.53, -0.811, 11.115, 11.314,
      ])
    })

    it('calculates projection correctly #3', () => {
      const camera = createCamera({
        position,
        near: 1,
        far: 1000,
        aspect: 16 / 9,
        fovy: Math.PI / 2,
      })

      expect(camera.projectionMatrix).toPrettyEqual([
        0.11, -0.432, -0.882, -0.88,
        0, 0.898, -0.441, -0.44,
        -0.552, -0.086, -0.176, -0.176,
        0, 0, 9.378, 11.358,
      ])
    })

    it('sets options correctly', () => {
      const camera = createCamera({})
      camera.setPosition(position)
      camera.setOptions({
        near: 1,
        far: 1000,
        aspect: 16 / 9,
        fovy: Math.PI / 2,
      })

      expect(camera.projectionMatrix).toPrettyEqual([
        0.11, -0.432, -0.882, -0.88,
        0, 0.898, -0.441, -0.44,
        -0.552, -0.086, -0.176, -0.176,
        0, 0, 9.378, 11.358,
      ])
    })
  })
})
