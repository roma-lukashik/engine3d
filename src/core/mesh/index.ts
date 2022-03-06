import { Program } from '../program'
import { ExtendedAttribute, createExtendedAttribute } from '../utils/attribute'
import { Model } from '../types'
import { Camera } from '../camera'
import { Lighting } from '../lightings/point'
import { setUniform } from '../utils/uniform'
import * as m4 from '../../math/matrix4'
import { createMeshProgram } from './program'
import { Texture, textureCreator } from '../textures'

type MeshOptions = {
  gl: WebGLRenderingContext;
  shape: Model;
  modelMatrix?: m4.Matrix4;
  texture?: Texture;
  program?: Program;
}

export type Mesh = {
  readonly program: Program;
  modelMatrix: m4.Matrix4;
  setTexture: (texture: Texture) => void;
  render: (camera: Camera, lighting: Lighting, textureMatrix: m4.Matrix4, program?: Program) => void;
}

export const createMesh = ({
  gl,
  shape,
  modelMatrix = m4.identity(),
  texture = textureCreator.createPixelTexture({ gl }),
  program = createMeshProgram({ gl }),
}: MeshOptions): Mesh => {
  return new MeshImpl({ gl, shape, modelMatrix, texture, program })
}

class MeshImpl implements Mesh {
  private readonly gl: WebGLRenderingContext
  private attributes: Record<string, ExtendedAttribute> = {}

  public readonly program: Program
  public modelMatrix: m4.Matrix4

  constructor({ gl, shape, program, texture, modelMatrix }: Required<MeshOptions>) {
    this.gl = gl
    this.program = program
    this.modelMatrix = modelMatrix
    this.setTexture(texture)
    this.setAttributes(shape)
  }

  public setTexture(texture: Texture): void {
    this.program.updateUniforms({ modelTexture: texture.register })
  }

  public render(camera: Camera, lighting: Lighting, textureMatrix: m4.Matrix4, program?: Program): void {
    this.drawScene(camera.projectionMatrix, textureMatrix, lighting, program)
  }

  private drawScene(
    projectionMatrix: m4.Matrix4,
    textureMatrix: m4.Matrix4,
    lighting: Lighting,
    program: Program = this.program
  ): void {
    program.use()

    program.updateUniforms({
      projectionMatrix,
      textureMatrix,
      lightPosition: lighting.position,
      lightViewPosition: lighting.target,
      modelMatrix: this.modelMatrix,
    })

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

  private setAttributes(shape: Model) {
    Object.entries(shape).forEach(([key, value]) => {
      this.attributes[key] = createExtendedAttribute(this.gl, value)
      updateAttribute(this.gl, this.attributes[key])
    })
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
