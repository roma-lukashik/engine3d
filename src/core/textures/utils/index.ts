export const createTexture2D = (gl: WebGLRenderingContext, register: number): WebGLTexture => {
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error('Cannot create a texture')
  }
  gl.activeTexture(gl.TEXTURE0 + register)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  return texture
}

let ID = 0
export const getID = () => ID++

export const isPowerOf2 = (value: number): boolean => (value & (value - 1)) === 0
