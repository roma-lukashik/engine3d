import { Program } from '../program'
import { createWebGLTexture } from '../textures'
import { MainUniformValues } from '../program/main'
import { Mesh } from '../../core/mesh'
import { WebGLBaseTexture } from '../textures/types'
import { createExtendedAttribute, ExtendedAttribute } from '../utils/gl'

type Props = {
  gl: WebGLRenderingContext;
  mesh: Mesh;
}

export class WebGLMesh {
  private readonly gl: WebGLRenderingContext
  private readonly mesh: Mesh
  private readonly attributes: Record<string, ExtendedAttribute> = {}
  private readonly texture: WebGLBaseTexture

  constructor({
    gl,
    mesh,
  }: Props) {
    this.gl = gl
    this.mesh = mesh
    this.texture = createWebGLTexture(gl, mesh.texture)
    this.setAttributes()
  }

  public render(program: Program<MainUniformValues>, uniforms: MainUniformValues = {}): void {
    program.use()
    program.uniforms.setValues({
      modelMatrix: this.mesh.modelMatrix,
      modelTexture: this.texture,
      ...uniforms,
    })
    program.uniforms.update()
    program.attributes.update(this.attributes)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position.count)
  }

  private setAttributes() {
    Object.entries(this.mesh.data).forEach(([key, value]) => {
      this.attributes[key] = createExtendedAttribute(this.gl, value)
      this.updateAttribute(this.attributes[key])
    })
  }

  private updateAttribute(attribute: ExtendedAttribute): void {
    this.gl.bindBuffer(attribute.target, attribute.buffer)
    this.gl.bufferData(attribute.target, attribute.data, this.gl.STATIC_DRAW)
  }
}
