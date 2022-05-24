export const createTexture2D = (gl: WebGLRenderingContext): WebGLTexture => {
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error("Cannot create a texture")
  }
  bindTexture(gl, texture, 0)
  return texture
}

export const bindTexture = (gl: WebGLRenderingContext, texture: WebGLTexture, register: number): void => {
  gl.activeTexture(gl.TEXTURE0 + register)
  gl.bindTexture(gl.TEXTURE_2D, texture)
}

type ImageLike = {
  width: number
  height: number
}

export const supportMipmap = <T extends ImageLike>(image: T): boolean => {
  return isPowerOf2(image.width) && isPowerOf2(image.height)
}

const isPowerOf2 = (value: number): boolean => (value & (value - 1)) === 0
