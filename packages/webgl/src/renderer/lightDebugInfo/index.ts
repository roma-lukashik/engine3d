import { LightDebugInfoProgram } from "@webgl/program/lightDebugInfo"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { LightWithShadow } from "@core/lights"
import { Camera } from "@core/camera"
import { indexes, positions } from "@webgl/renderer/lightDebugInfo/data"
import { WebglRenderState } from "@webgl/utils/renderState"

export class LightDebugInfoRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: LightDebugInfoProgram
  private readonly attributes: Record<"position" | "index", WebglVertexAttribute>

  public constructor(
    gl: WebGLRenderingContext,
    state: WebglRenderState,
  ) {
    this.gl = gl
    this.program = new LightDebugInfoProgram(gl, state)
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

  public render(lights: LightWithShadow[], camera: Camera): void {
    this.program.use()
    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.toArray(),
    })
    this.program.attributes.update(this.attributes)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    lights.forEach((light) => {
      this.program.uniforms.setValues({
        worldMatrix: light.projectionMatrix.clone().invert().toArray(),
      })
      this.drawBuffer()
    })
  }

  private drawBuffer(): void {
    const index = this.attributes.index
    this.gl.drawElements(this.gl.LINES, index.count, index.type, index.offset)
  }
}
