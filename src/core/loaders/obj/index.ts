import { Model } from '../../types'
import { BufferAttribute } from '../gltf/bufferAttribute'

type SeparatedVertices = [
  position: number[][],
  uv: number[][],
  normal: number[][],
]

type WebglVertexData = [
  position: number[],
  uv: number[],
  normal: number[],
]

type Parser = (
  parts: string[],
  data: SeparatedVertices,
  webglVertexData: WebglVertexData,
) => void

const keywordRegExp = /(\w*)\s*(.*)/

export const parseObject = (text: string): Model => {
  const data: SeparatedVertices = [
    [[0, 0, 0]],
    [[0, 0]],
    [[0, 0, 0]],
  ]
  const webglVertexData: WebglVertexData = [[], [], []]

  const lines = text.split('\n')
  lines.forEach((item) => {
    const line = item.trim()
    if (!line || line.startsWith('#')) {
      return
    }
    const [, keyword, rest] = keywordRegExp.exec(line) ?? []
    const handler = parsers?.[keyword]
    handler?.(rest.split(/\s+/), data, webglVertexData)
  })

  return createModel(webglVertexData)
}

const VertexParser: Parser = (parts, data) => data[0].push(parts.map(parseFloat))

const TextureParser: Parser = (parts, data) => data[1].push(parts.map(parseFloat))

const NormalParser: Parser = (parts, data) => data[2].push(parts.map(parseFloat))

const FaceParser: Parser = (parts, data, webglVertexData) => {
  for (let i = 0; i < parts.length - 2; i++) {
    addVertex(parts[0], data, webglVertexData)
    addVertex(parts[i + 1], data, webglVertexData)
    addVertex(parts[i + 2], data, webglVertexData)
  }
}

const parsers: Record<string, Parser> = {
  v: VertexParser,
  vt: TextureParser,
  vn: NormalParser,
  f: FaceParser,
}

const addVertex = (vertex: string, data: SeparatedVertices, webglVertexData: WebglVertexData) => {
  vertex.split('/').forEach((objIndexStr, i) => {
    if (!objIndexStr) {
      return
    }
    const objIndex = parseInt(objIndexStr)
    const index = objIndex + (objIndex >= 0 ? 0 : data[i].length)
    webglVertexData[i].push(...data[i][index])
  })
}

const createModel = ([position, uv, normal]: WebglVertexData): Model => {
  return {
    position: new BufferAttribute(new Float32Array(position), 3, false),
    normal: new BufferAttribute(new Float32Array(normal), 3, false),
    uv: new BufferAttribute(new Float32Array(uv), 2, false),
  }
}
