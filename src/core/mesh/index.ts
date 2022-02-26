import { Program } from '../program'
import { ExtendedAttribute, createExtendedAttribute } from '../utils/attribute'
import { Model } from '../types'
import { Camera } from '../camera'
import { Lighting } from '../lightings/point'
import { setUniform } from '../utils/uniform'
import * as m4 from '../../math/matrix4'

type MeshOptions = {
  gl: WebGLRenderingContext;
  shape: Model;
}

export type Mesh = {
  worldMatrix: m4.Matrix4;
  render: (program: Program, camera: Camera, lighting: Lighting, textureMatrix: m4.Matrix4) => void;
}

export const createMesh = (options: MeshOptions): Mesh => {
  return new MeshImpl(options)
}

class MeshImpl implements Mesh {
  private readonly gl: WebGLRenderingContext
  private readonly attributes: Record<string, ExtendedAttribute>

  public worldMatrix: m4.Matrix4

  constructor({ gl, shape }: MeshOptions) {
    this.attributes = Object.fromEntries(Object.entries(shape).map(([key, value]) => {
      return [key, createExtendedAttribute(gl, value)]
    }))

    Object.values(this.attributes).forEach((attribute) => updateAttribute(gl, attribute))

    this.gl = gl
    this.worldMatrix = m4.identity()
  }

  public render(program: Program, camera: Camera, lighting: Lighting, textureMatrix: m4.Matrix4): void {
    this.drawScene(lighting, camera.projectionMatrix, textureMatrix, program)
  }

  private drawScene(
    lighting: Lighting,
    projectionMatrix: m4.Matrix4,
    textureMatrix: m4.Matrix4,
    program: Program,
  ): void {
    program.use()

    if (program.uniforms.projectionMatrix) {
      program.uniforms.projectionMatrix.value = projectionMatrix
    }

    if (program.uniforms.lightPosition) {
      program.uniforms.lightPosition.value = lighting.position
    }

    if (program.uniforms.lightViewPosition) {
      program.uniforms.lightViewPosition.value = lighting.target
    }

    if (program.uniforms.worldMatrix) {
      program.uniforms.worldMatrix.value = this.worldMatrix
    }

    if (program.uniforms.textureMatrix) {
      program.uniforms.textureMatrix.value = textureMatrix
    }

    Object.values(program.uniforms).forEach((uniform) => {
      setUniform(this.gl, uniform.info.type, uniform.location, uniform.value)
    })

    Object.values(program.attributes).forEach(({ location, info }) => {
      const attribute = this.attributes[info.name]
      this.gl.bindBuffer(attribute.target, attribute.buffer)
      bindBufferToVertexAttribute(this.gl, attribute, location)
    })

    // Fix?
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position.count)
  }
}

const updateAttribute = (gl: WebGLRenderingContext, attr: ExtendedAttribute) => {
  gl.bindBuffer(attr.target, attr.buffer)
  gl.bufferData(attr.target, attr.data, gl.STATIC_DRAW)
}

const bindBufferToVertexAttribute = (gl: WebGLRenderingContext, attribute: ExtendedAttribute, location: number) => {
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
