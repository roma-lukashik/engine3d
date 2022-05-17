import { parseGltf } from '.'
import { simpleBuffer, simpleGltf } from './__test__/simple'
import { Mesh } from './mesh'
import { BufferViewTarget } from '../types'

describe('parseGltf', () => {
  describe('simple GLTF', () => {
    const { nodes } = parseGltf(simpleGltf, simpleBuffer)
    const root = nodes[0]

    describe('root node', () => {
      it('should be defined', () => {
        expect(root).toBeDefined()
      })

      it('has correct matrix', () => {
        expect(root.matrix).toEqual([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ])
      })

      it('has 2 child nodes', () => {
        expect(root.children).toHaveLength(2)
      })
    })

    describe('root node child #1', () => {
      const child = root.children[0]

      it('has a correct matrix', () => {
        expect(child.matrix).toEqual([
          2, 0, 0, 0,
          0, 0.865838, 0.500388, 0,
          0, -0.250194, 0.432919, 0,
          10, 20, 30, 1,
        ])
      })

      it('has a child', () => {
        expect(child.children).toHaveLength(1)
      })

      it('its child should be instance of Mesh class', () => {
        expect(child.children[0]).toBeInstanceOf(Mesh)
      })

      it('its child should have correct index geometry', () => {
        const mesh = child.children[0] as Mesh
        const index = mesh.geometry.index
        expect(index?.count).toBe(3)
        expect(index?.target).toBe(BufferViewTarget.ElementArrayBuffer)
        expect(index?.array).toEqual(new Uint16Array([0, 1, 2]))
      })

      it('its child should have correct position geometry', () => {
        const mesh = child.children[0] as Mesh
        const position = mesh.geometry.position
        expect(position?.count).toBe(3)
        expect(position?.target).toBe(BufferViewTarget.ArrayBuffer)
        expect(position?.array).toEqual(new Float32Array([
          0, 0, 0,
          1, 0, 0,
          0, 1, 0,
        ]))
      })
    })

    describe('root node child #2', () => {
      const child = root.children[1]

      it('has a correct matrix', () => {
        expect(child.matrix).toEqual([
          2, 0, 0, 0,
          0, 0.866, 0.5, 0,
          0, -0.25, 0.433, 0,
          10, 20, 30, 1,
        ])
      })
    })
  })
})
