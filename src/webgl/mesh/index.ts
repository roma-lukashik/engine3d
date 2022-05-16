import { Program } from '../program'
import { Mesh } from '../../core/loaders/gltf/mesh'
import { WebglVertexAttribute } from '../utils/attribute'
import { Matrix4 } from '../../math/matrix4'
import { forEachKey } from '../../utils/object'
import { Material } from '../../core/loaders/gltf/material'
import { Geometry } from '../../core/loaders/gltf/geometry'

type Props = {
  gl: WebGLRenderingContext
  mesh: Mesh
}

export class WebGLMesh {
  private readonly gl: WebGLRenderingContext
  private readonly attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>> = {}
  private readonly modelMatrix: Matrix4
  private readonly material: Material

  constructor({
    gl,
    mesh,
  }: Props) {
    this.gl = gl
    this.modelMatrix = mesh.matrix
    this.material = mesh.material
    this.setAttributes(mesh.geometry)
  }

  public render(program: Program): void {
    program.use()
    program.uniforms.setValues({
      modelMatrix: this.modelMatrix,
      material: {
        metalness: this.material.metalness,
        roughness: this.material.roughness,
        color: this.material.color,
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
