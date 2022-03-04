export const createTexture = (gl: WebGLRenderingContext, image: TexImageSource, register: number): WebGLTexture => {
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error('Cannot create a texture')
  }
  gl.activeTexture(gl.TEXTURE0 + register)
  updateTexture(gl, texture, image)
  return texture
}

const updateTexture = (gl: WebGLRenderingContext, texture: WebGLTexture, image: TexImageSource): void => {
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D)
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  }
}

let ID = 0
export const getID = () => ID++

const isPowerOf2 = (value: number): boolean => (value & (value - 1)) === 0
