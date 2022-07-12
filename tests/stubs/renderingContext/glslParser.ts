import { WebGLConstant } from "./constants"

export const parse = (shader: string) => {
  const uniforms: WebGLActiveInfo[] = []
  const attributes: WebGLActiveInfo[] = []
  const uniformLocations = new WeakMap<WebGLActiveInfo, WebGLUniformLocation>()
  const lines = shader.split(";")
  lines.forEach((line) => {
    const uniformLocation = line.match(/uniform\s+(\w+)\s+(\w+)(\[\d+\])?/)
    if (uniformLocation) {
      const [, type, name, arr] = uniformLocation
      const uniform = { type: getType(type), name: name + (arr ? "[0]" : ""), size: 1 }
      uniforms.push(uniform)
      uniformLocations.set(uniform, {})
    }
    const attributeLocation = line.match(/attribute\s+(\w+)\s+(\w+)/)
    if (attributeLocation) {
      const [, type, name] = attributeLocation
      attributes.push({ type: getType(type), name, size: 1 })
    }
  })
  return { uniforms, attributes, uniformLocations }
}

const getType = (type: string): number => {
  switch (type) {
    case "float": return WebGLConstant.FLOAT
    case "vec2": return WebGLConstant.FLOAT_VEC2
    case "vec3": return WebGLConstant.FLOAT_VEC3
    case "vec4": return WebGLConstant.FLOAT_VEC4
    case "bool": return WebGLConstant.BOOL
    case "int": return WebGLConstant.INT
    case "sampler2D": return WebGLConstant.SAMPLER_2D
    case "samplerCube": return WebGLConstant.SAMPLER_2D
    case "mat2": return WebGLConstant.FLOAT_MAT2
    case "mat3": return WebGLConstant.FLOAT_MAT3
    case "mat4": return WebGLConstant.FLOAT_MAT3
    default: throw new Error(`Unsupported type ${type}`)
  }
}
