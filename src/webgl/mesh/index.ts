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
    this.drawBuffer()
  }

  private setAttributes(attributes: Model): void {
    forEachKey(attributes, (key, value) => {
      const attribute = createExtendedAttribute(this.gl, value)
      this.gl.bindBuffer(attribute.target, attribute.buffer)
      this.gl.bufferData(attribute.target, attribute.data, this.gl.STATIC_DRAW)
      this.attributes[key] = attribute
    })
  }

  private drawBuffer(): void {
    const { index } = this.attributes
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position.count)
    }
  }
}
