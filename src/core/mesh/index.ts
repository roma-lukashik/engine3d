import { Program } from '../program'
import { Attribute, createAttribute } from '../utils/attribute'
import { Model } from '../types'
import { Camera } from '../camera'
import { Lighting } from '../lightings/point'

type MeshProps = {
  gl: WebGL2RenderingContext;
  program: Program;
  shape: Model;
}

export type Mesh = {
  render: (camera: Camera, lighting: Lighting) => void;
}

export const createMesh = ({
  gl,
  program,
  shape,
}: MeshProps): Mesh => {
  const attributes = Object.fromEntries(Object.entries(shape).map(([key, value]) => {
    return [key, createAttribute(gl, value)]
  }))

  Object.values(attributes).forEach((attr) => updateAttribute(gl, attr))

  return {
    render: (camera, lighting) => render(gl, attributes, program, camera, lighting),
  }
}

const updateAttribute = (gl: WebGL2RenderingContext, attr: Attribute) => {
  gl.bindBuffer(attr.target, attr.buffer)
  gl.bufferData(attr.target, attr.data, gl.STATIC_DRAW)
}

const render = (gl: WebGL2RenderingContext, attr: Record<string, Attribute>, program: Program, camera: Camera, lighting: Lighting) => {
  program.use()

  program.getUniformLocations().forEach((uniform) => {
    if (uniform.info.name === 'projectionMatrix') {
      uniform.value = camera.projectionMatrix
    }
    if (uniform.info.name === 'lightPosition') {
      uniform.value = lighting.position
    }
    if (uniform.info.name === 'lightViewPosition') {
      uniform.value = lighting.target
    }
    program.setUniform(gl, uniform.info.type, uniform.location, uniform.value)
  })

  program.getAttributeLocations().forEach((location, { name }) => {
    const attribute = attr[name]
    gl.bindBuffer(attribute.target, attribute.buffer)
    bindBufferToVertexAttribute(gl, attribute, location)
  })

  gl.drawArrays(gl.TRIANGLES, 0, attr.position.count)
}

const bindBufferToVertexAttribute = (gl: WebGL2RenderingContext, attribute: Attribute, location: number) => {
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

const bufferSize = (gl: WebGL2RenderingContext, type: number) => {
  switch (type) {
    case gl.FLOAT_MAT2: return 2
    case gl.FLOAT_MAT3: return 3
    case gl.FLOAT_MAT4: return 4
    default: return 1
  }
}
