import { indexes, positions } from "@webgl/renderer/debugLight/data"
import { DebugLinesProgram } from "@webgl/program/debugLines"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { Camera } from "@core/camera"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Matrix4 } from "@math/matrix4"
import { Vector3 } from "@math/vector3"

type ObjectWithProjection = {
  projectionMatrix: Matrix4
}

export class DebugLightRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly positionAttribute: WebglVertexAttribute
  private readonly indexAttribute: WebglVertexAttribute
  private readonly color: Vector3

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    color: Vector3 = new Vector3(0.9, 0.9, 0.1),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
    this.positionAttribute = new WebglVertexAttribute(gl, new BufferAttribute({
      array: positions,
      itemSize: 3,
    }))
    this.indexAttribute = new WebglVertexAttribute(gl, new BufferAttribute({
      array: indexes,
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    }))
  }

  public render(objects: ObjectWithProjection[], camera: Camera): void {
    this.program.use()
    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })
    this.program.attributes.update({
      position: this.positionAttribute,
      index: this.indexAttribute,
    })
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    objects.forEach((object) => {
      this.program.uniforms.setValues({
        worldMatrix: object.projectionMatrix.clone().invert().elements,
      })
      this.drawBuffer()
    })
  }

  private drawBuffer(): void {
    const index = this.indexAttribute
    this.gl.drawElements(this.gl.LINES, index.count, index.type, index.offset)
  }
}
