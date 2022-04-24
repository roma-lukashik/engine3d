import { Gltf } from '../types'

const BINARY_HEADER_MAGIC = 'glTF'
const BINARY_HEADER_LENGTH = 12
const BINARY_CHUNK_JSON_TYPES = 0x4E4F534A
const BINARY_CHUNK_BIN_TYPES = 0x004E4942
const UINT_SIZE = 4

type Glb = {
  json: Gltf
  data?: Uint8Array
}

// GLB contains 12 byte header:
// - magic (unsigned char[4])
// - version (uint32)
// - length (uint32)
// Next it contains contents in the following format:
// - contentLength (uint32)
// - contentFormat (uint32)
// - json or binary data
export const parseGlb = (buffer: ArrayBufferLike): Glb => {
  const headerView = new DataView(buffer, 0, BINARY_HEADER_LENGTH)
  const magic = decodeText(new Uint8Array(buffer, 0, UINT_SIZE))
  const version = headerView.getUint32(UINT_SIZE, true)

  if (magic !== BINARY_HEADER_MAGIC) {
    throw new Error('Unsupported glTF-Binary header.')
  }

  if (version < 2.0) {
    throw new Error('Unsupported legacy binary file.')
  }

  const bodyView = new DataView(buffer, BINARY_HEADER_LENGTH)
  const chunks = getChunks(bodyView)
  const json = parseGltfJson(buffer, chunks)
  const data = parseBinaryData(buffer, chunks)

  return { json, data }
}

const decodeText = (array: Uint8Array): string => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(array)
  }
  const string = array.reduce((text, c) => text + String.fromCharCode(c), '')
  return decodeURIComponent(string)
}

type Chunk = {
  length: number
  type: number
  index: number
}

const getChunks = (data: DataView): Chunk[] => {
  let chunkIndex = 0
  const chunks: Chunk[] = []
  while (chunkIndex < data.byteLength) {
    const length = data.getUint32(chunkIndex, true)
    const type = data.getUint32(chunkIndex + UINT_SIZE, true)
    const index = chunkIndex + 2 * UINT_SIZE
    chunkIndex = index + length
    chunks.push({ length, type, index })
  }
  return chunks
}

const parseGltfJson = (data: ArrayBufferLike, chunks: Chunk[]): Gltf => {
  const chunk = findChunk(chunks, BINARY_CHUNK_JSON_TYPES)
  if (!chunk) {
    throw new Error('GLB JSON content not found.')
  }
  const contentArray = new Uint8Array(data, BINARY_HEADER_LENGTH + chunk.index, chunk.length)
  return JSON.parse(decodeText(contentArray))
}

const parseBinaryData = (data: ArrayBufferLike, chunks: Chunk[]) => {
  const chunk = findChunk(chunks, BINARY_CHUNK_BIN_TYPES)
  if (!chunk) {
    return undefined
  }
  return new Uint8Array(data, BINARY_HEADER_LENGTH + chunk.index, chunk.length)
}

const findChunk = (chunks: Chunk[], type: number) => chunks.find((chunk) => chunk.type === type)
