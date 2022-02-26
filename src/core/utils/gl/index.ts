export const compileShader = (gl: WebGLRenderingContext, source: string, type: number): WebGLShader => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Cannot create a shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}
