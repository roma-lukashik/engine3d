import { LightDebugInfoProgram } from "@webgl/program/lightDebugInfo"
import { Geometry } from "@core/geometry"
import { WebglVertexAttribute } from "@webgl/utils/attribute"
import { BufferAttribute } from "@core/bufferAttribute"
import { BufferViewTarget } from "@core/loaders/types"
import { LightWithShadow } from "@core/lights"
import { Camera } from "@core/camera"
import { indexes, positions } from "@webgl/renderer/lightDebugInfo/data"

type Props = {
  gl: WebGLRenderingContext
}

export class LightDebugInfoRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: LightDebugInfoProgram
  private readonly attributes: Partial<Record<keyof Geometry, WebglVertexAttribute>>

  public constructor({ gl }: Props) {
    this.gl = gl
    this.program = new LightDebugInfoProgram({ gl })
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
      this.program.uniforms.update()
      this.drawBuffer()
    })
  }

  private drawBuffer(): void {
    const index = this.attributes.index!
    this.gl.drawElements(this.gl.LINES, index.count, index.type, index.offset)
  }
}
