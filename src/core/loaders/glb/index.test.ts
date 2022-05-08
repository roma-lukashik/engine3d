import { TextEncoder } from 'util'
import { parseGlb } from '.'

const defaultJson = {
  asset: {
    version: 2.0,
  },
  scene: 0,
  scenes: [
    { name: 'Scene' },
  ],
}

const defaultBinary = new Uint8Array([0xAA, 0xBB, 0xCC])

const createGlb = ({
  magic = 0x46546C67,
  version = 0x2,
  json = defaultJson,
  jsonFormat = 0x4E4F534A,
  binary,
  binaryFormat = 0x004E4942,
}: {
  magic?: number,
  version?: number,
  json?: object,
  jsonFormat?: number,
  binary?: Uint8Array,
  binaryFormat?: number,
} = {}): ArrayBuffer => {
  const jsonUint8Array = new TextEncoder().encode(JSON.stringify(json))
  const jsonLength = jsonUint8Array.length
  const headerLength = 12 + 8
  const length = headerLength + jsonLength + (binary ? 8 + binary.length : 0)
  const header = new Uint32Array([magic, version, length, jsonLength, jsonFormat])
  const glb = new Uint8Array(length)
  glb.set(new Uint8Array(header.buffer))
  glb.set(jsonUint8Array, headerLength)
  if (binary) {
    const binaryHeader = new Uint32Array([binary.length, binaryFormat])
    glb.set(new Uint8Array(binaryHeader.buffer), headerLength + jsonLength)
    glb.set(binary, headerLength + jsonLength + 8)
  }
  return glb.buffer
}

describe('parseGLB', () => {
  it('returns correct gltf object', () => {
    const glb = createGlb({ binary: defaultBinary })
    expect(parseGlb(glb)).toEqual({
      json: defaultJson,
      data: [],
    })
  })

  it('returns correct gltf object with no binary data', () => {
    const glb = createGlb()
    expect(parseGlb(glb)).toEqual({ json: defaultJson })
  })

  it('throws an error if magic is not supported', () => {
    const wrongMagicGlb = createGlb({ magic: 0x000 })
    expect(() => parseGlb(wrongMagicGlb)).toThrowError('Unsupported glTF-Binary header.')
  })

  it('throws an error if version is lower than 2', () => {
    const wrongVersionGlb = createGlb({ version: 1 })
    expect(() => parseGlb(wrongVersionGlb))
      .toThrowError('Unsupported legacy binary file. Provided version is 1, but supported is 2.0.')
  })

  it('throws an error if wrong json format', () => {
    const wrongJsonFormatGlb = createGlb({ jsonFormat: 0x000 })
    expect(() => parseGlb(wrongJsonFormatGlb)).toThrowError('Unexpected GLB layout.')
  })

  it('throws an error if wrong binary format', () => {
    const wrongBinaryFormatGlb = createGlb({ binaryFormat: 0x000 , binary: defaultBinary })
    expect(() => parseGlb(wrongBinaryFormatGlb)).toThrowError('Unexpected GLB layout.')
  })
})
