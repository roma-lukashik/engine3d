import { BufferAttribute } from '../../../core/loaders/gltf/bufferAttribute'

export const compileShader = (gl: WebGLRenderingContext, source: string, type: number): WebGLShader => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Cannot create a shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

export const bindBufferToVertexAttribute = (
  gl: WebGLRenderingContext,
  attribute: ExtendedAttribute,
  location: number,
): void => {
  const numLoc = bufferSize(gl, attribute.type)
  const size = attribute.size / numLoc
  const stride = numLoc === 1 ? 0 : numLoc ** 3
  const offset = numLoc === 1 ? 0 : numLoc ** 2

  for (let i = 0; i < numLoc; i++) {
    gl.vertexAttribPointer(
      location + i,
      size,
      attribute.type,
      attribute.normalized,
      attribute.stride + stride,
      attribute.offset + i * offset,
    )
    gl.enableVertexAttribArray(location + i)
  }
}

const bufferSize = (gl: WebGLRenderingContext, type: number) => {
  switch (type) {
    case gl.FLOAT_MAT2: return 2
    case gl.FLOAT_MAT3: return 3
    case gl.FLOAT_MAT4: return 4
    default: return 1
  }
}

export type ExtendedAttribute = {
  size: number;
  data: BufferAttribute['array'];
  type: number;
  normalized: boolean;
  stride: number;
  offset: number;
  divisor: number;
  target: number;
  count: number;
  buffer: WebGLBuffer | null;
}

export const createExtendedAttribute = (
  gl: WebGLRenderingContext,
  value: BufferAttribute,
): ExtendedAttribute => ({
  size: value.itemSize,
  data: value.array,
  type: value.array.constructor === Float32Array ?
    gl.FLOAT :
    value.array.constructor === Uint16Array ?
      gl.UNSIGNED_SHORT :
      gl.UNSIGNED_INT,
  normalized: value.normalized,
  stride: value.stride,
  offset: value.offset,
  divisor: 0,
  target: gl.ARRAY_BUFFER,
  count: value.count,
  buffer: gl.createBuffer(),
})
