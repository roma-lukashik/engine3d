import { DebugLinesProgram } from "@webgl/program/debugLines"
import { RenderState } from "@webgl/utils/state"
import { Camera } from "@core/camera"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { Vector3 } from "@math/vector3"
import { indexes, positions } from "@webgl/renderer/debugMesh/data"
import { Gltf } from "@core/gltf"

export class DebugMeshRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly color: Vector3
  private readonly positionAttribute: WebglVertexAttribute
  private readonly indexAttribute: WebglVertexAttribute

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: Vector3 = new Vector3(0.8, 0, 0.1),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
    this.positionAttribute = new WebglVertexAttribute(this.gl, new BufferAttribute({
      array: positions,
      itemSize: Vector3.size,
    }))
    this.indexAttribute = new WebglVertexAttribute(this.gl, new BufferAttribute({
      array: indexes,
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    }))
  }

  public render(object: Gltf<any>, camera: Camera): void {
    const min = object.aabb.min
    const max = object.aabb.max

    const center = max.clone().add(min).divide(2)
    const scale = max.clone().subtract(min).divide(2)
    const transformMatrix = Matrix4.translation(center.x, center.y, center.z)
      .scale(scale.x, scale.y, scale.z)

    this.program.use()
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.uniforms.setValues({
      worldMatrix: transformMatrix.elements,
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })

    this.program.attributes.update({
      position: this.positionAttribute,
      index: this.indexAttribute,
    })

    this.gl.drawElements(
      this.gl.LINES,
      this.indexAttribute.count,
      this.indexAttribute.type,
      this.indexAttribute.offset,
    )
  }
}
