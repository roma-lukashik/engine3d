import { indexes, positions } from "@webgl/renderer/debugLight/data"
import { DebugLinesProgram } from "@webgl/program/debugLines"
import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { Camera } from "@core/camera"
import { RenderState } from "@webgl/utils/state"
import { Vector3 } from "@math/vector3"
import { Scene } from "@webgl/scene"

export class DebugLightRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly positionAttribute: BufferAttribute
  private readonly indexAttribute: BufferAttribute
  private readonly color: Vector3

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: Vector3 = new Vector3(0.9, 0.9, 0.1),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
    this.positionAttribute = new BufferAttribute({
      array: positions,
      itemSize: Vector3.size,
    })
    this.indexAttribute = new BufferAttribute({
      array: indexes,
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    })
  }

  public render(scene: Scene, camera: Camera): void {
    this.program.use()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.uniforms.setValues({
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })
    this.program.attributes.update({
      position: this.positionAttribute,
      index: this.indexAttribute,
    })

    scene.shadowLights.forEach((light) => {
      this.program.uniforms.setValues({
        worldMatrix: light.projectionMatrix.clone().invert().elements,
      })
      this.drawBuffer()
    })
  }

  private drawBuffer(): void {
    const index = this.indexAttribute
    this.gl.drawElements(this.gl.LINES, index.count, index.type, index.offset)
  }
}
