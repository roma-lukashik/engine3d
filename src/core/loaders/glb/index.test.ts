import { TextEncoder } from 'util'
import { parseGlb } from '.'

const json = {
  asset: {
    version: 2.0,
  },
  scene: 0,
  scenes: [
    { name: 'Scene' },
  ],
}

const jsonUint8Array = new TextEncoder().encode(JSON.stringify(json))
const magic = 0x46546C67
const version = 0x2
const jsonLength = jsonUint8Array.byteLength
const headerLength = 12
const length = jsonLength + headerLength
const jsonFormat = 0x4E4F534A
const header = new Uint32Array([magic, version, length, jsonLength, jsonFormat])

const glb = new Uint8Array(header.length * 4 + jsonUint8Array.length)
glb.set(new Uint8Array(header.buffer))
glb.set(jsonUint8Array, header.length * 4)

describe('parseGLB', () => {
  it('returns correct gltf object', () => {
    expect(parseGlb(glb.buffer).json).toEqual(json)
  })
})
