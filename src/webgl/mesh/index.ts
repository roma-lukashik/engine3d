import { Program } from '../program'
import { Mesh } from '../../core/loaders/gltf/mesh'
import { WebglVertexAttribute } from '../utils/attribute'
import { forEachKey } from '../../utils/object'
import { Geometry } from '../../core/loaders/gltf/geometry'

type Props = {
  gl: WebGLRenderingContext
  mesh: Mesh
}

export class WebGLMesh {
  private readonly gl: WebGLRenderingContext
  private readonly attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>> = {}
  private readonly mesh: Mesh

  constructor({
    gl,
    mesh,
  }: Props) {
    this.gl = gl
    this.mesh = mesh
    this.setAttributes(mesh.geometry)
  }

  public render(program: Program): void {
    program.use()
    program.uniforms.setValues({
      modelMatrix: this.mesh.matrix,
      material: {
        metalness: this.mesh.material.metalness,
        roughness: this.mesh.material.roughness,
        color: this.mesh.material.color,
      },
    })
    program.uniforms.update()
    program.attributes.update(this.attributes)
    this.drawBuffer()
  }

  private setAttributes(attributes: Geometry): void {
    forEachKey(attributes, (key, value) => {
      this.attributes[key] = new WebglVertexAttribute(this.gl, value)
    })
  }

  private drawBuffer(): void {
    const { index } = this.attributes
    if (index) {
      this.gl.drawElements(this.gl.TRIANGLES, index.count, index.type, index.offset)
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.attributes.position?.count ?? 0)
    }
  }
}
