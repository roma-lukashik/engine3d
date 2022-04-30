import { Program } from '../program'
import { createWebGLTexture } from '../textures'
import { Mesh } from '../../core/mesh'
import { WebGLBaseTexture } from '../textures/types'
import { createExtendedAttribute, ExtendedAttribute } from '../utils/gl'
import { Model } from '../../core/types'
import { Matrix4 } from '../../math/matrix4'
import { forEachKey } from '../../utils/object'

type Props = {
  gl: WebGLRenderingContext
  mesh: Mesh
}

export class WebGLMesh {
  private readonly gl: WebGLRenderingContext
  private readonly attributes: Record<keyof Model, ExtendedAttribute> = {} as Record<keyof Model, ExtendedAttribute>
  private readonly modelMatrix: Matrix4
  private readonly modelTexture: WebGLBaseTexture

  constructor({
    gl,
    mesh,
  }: Props) {
    this.gl = gl
    this.modelMatrix = mesh.modelMatrix
    this.modelTexture = createWebGLTexture(gl, mesh.texture)
    this.setAttributes(mesh.data)
  }

  public render(program: Program): void {
    program.use()
    program.uniforms.setValues({
      modelMatrix: this.modelMatrix,
      modelTexture: this.modelTexture,
    })
    program.uniforms.update()
    program.attributes.update(this.attributes)
    if (!this.attributes.index) {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position.count)
    } else {
      this.gl.drawElements(this.gl.TRIANGLES, this.attributes.index.count, this.attributes.index.type, this.attributes.index.offset)
    }
  }

  private setAttributes({ position, normal, uv, index }: Model) {
    forEachKey({ position, normal, uv }, (key, value) => {
      const attribute = createExtendedAttribute(this.gl, value)
      this.gl.bindBuffer(attribute.target, attribute.buffer)
      this.gl.bufferData(attribute.target, attribute.data, this.gl.STATIC_DRAW)
      this.attributes[key] = attribute
    })
    if (index) {
      const attribute = createExtendedAttribute(this.gl, index)
      attribute.target = this.gl.ELEMENT_ARRAY_BUFFER
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, attribute.buffer)
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, attribute.data, this.gl.STATIC_DRAW)
      this.attributes.index = attribute
    }
  }
}
