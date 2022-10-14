import { WebGLConstant } from "./constants"

export const parse = (shader: string) => {
  const uniforms: WebGLActiveInfo[] = []
  const uniformValues: any[] = []
  const attributes: WebGLActiveInfo[] = []
  const lines = shader.split(";")
  lines.forEach((line) => {
    const uniformLocation = line.match(/uniform\s+(\w+)\s+(\w+)(\[(\d+)\])?/)
    if (uniformLocation) {
      const [, glType, uName, , arrIndex] = uniformLocation
      const type = getType(glType)
      const name = uName + (arrIndex ? "[0]" : "")
      const size = arrIndex ? Number(arrIndex) : 1
      const value = getDefaultValue(glType)
      uniforms.push({ type, name, size })
      uniformValues.push(value)
    }
    const attributeLocation = line.match(/attribute\s+(\w+)\s+(\w+)/)
    if (attributeLocation) {
      const [, type, name] = attributeLocation
      attributes.push({ type: getType(type), name, size: 1 })
    }
  })
  return { uniforms, uniformValues, attributes }
}

const getType = (type: string): number => {
  switch (type) {
    case "float": return WebGLConstant.FLOAT
    case "int": return WebGLConstant.INT
    case "vec2": return WebGLConstant.FLOAT_VEC2
    case "ivec2": return WebGLConstant.INT_VEC2
    case "vec3": return WebGLConstant.FLOAT_VEC3
    case "ivec3": return WebGLConstant.INT_VEC3
    case "vec4": return WebGLConstant.FLOAT_VEC4
    case "ivec4": return WebGLConstant.INT_VEC4
    case "bool": return WebGLConstant.BOOL
    case "sampler2D": return WebGLConstant.SAMPLER_2D
    case "samplerCube": return WebGLConstant.SAMPLER_2D
    case "mat2": return WebGLConstant.FLOAT_MAT2
    case "mat3": return WebGLConstant.FLOAT_MAT3
    case "mat4": return WebGLConstant.FLOAT_MAT3
    default: throw new Error(`Unsupported type ${type}`)
  }
}

const getDefaultValue = (type: string): any => {
  switch (type) {
    case "float": return 0.0
    case "int": return 0
    case "vec2": return new Float32Array([0, 0])
    case "ivec2": return new Int32Array([0, 0])
    case "vec3": return new Float32Array([0, 0, 0])
    case "ivec3": return new Int32Array([0, 0, 0])
    case "vec4": return new Float32Array([0, 0, 0, 0])
    case "ivec4": return new Int32Array([0, 0, 0, 0])
    case "bool": return false
    case "sampler2D": return 0
    case "samplerCube": return 0
    case "mat2": return new Float32Array([0, 0, 0, 0])
    case "mat3": return new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0])
    case "mat4": return new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    default: throw new Error(`Unsupported type ${type}`)
  }
}
