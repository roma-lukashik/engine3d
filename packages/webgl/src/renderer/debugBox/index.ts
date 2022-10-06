import { DebugBoxProgram } from "@webgl/program/debugBox"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { Camera } from "@core/camera"
import { WebglRenderState } from "@webgl/utils/renderState"
import { Matrix4 } from "@math/matrix4"

type ObjectWithProjection = {
  projectionMatrix: Matrix4
}

export class DebugBoxRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugBoxProgram
  private readonly attributes: Record<"position" | "index", WebglVertexAttribute>

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
    positions: Float32Array,
    indexes: Uint16Array,
  ) {
    this.gl = gl
    this.program = new DebugBoxProgram(gl, state)
    this.attributes = {
      position: new WebglVertexAttribute(gl, new BufferAttribute({
        array: positions,
        itemSize: 3,
      })),
      index: new WebglVertexAttribute(gl, new BufferAttribute({
        array: indexes,
        itemSize: 1,
        target: BufferViewTarget.ElementArrayBuffer,
      })),
    }
  }

  public render(objects: ObjectWithProjection[], camera: Camera): void {
    this.program.use()
    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.toArray(),
    })
    this.program.attributes.update(this.attributes)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    objects.forEach((object) => {
      this.program.uniforms.setValues({
        worldMatrix: object.projectionMatrix.clone().invert().toArray(),
      })
      this.drawBuffer()
    })
  }

  private drawBuffer(): void {
    const index = this.attributes.index
    this.gl.drawElements(this.gl.LINES, index.count, index.type, index.offset)
  }
}
