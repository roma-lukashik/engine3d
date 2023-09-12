import { DebugLinesProgram } from "@webgl/debug/programs/lines"
import { RenderState } from "@webgl/utils/state"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { Vector3 } from "@math/vector3"
import { indexes, positions } from "@webgl/debug/renderers/constants"
import { RGB } from "@core/color/rgb"
import { DebugRenderer } from "@webgl/debug/renderers/types"
import { Scene } from "@webgl/scene"
import { RenderObject } from "@core/object3d"

export abstract class DebugBoxRenderer implements DebugRenderer {
  protected readonly transformMatrix: Matrix4 = Matrix4.identity()

  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly color: RGB
  private readonly positionAttribute: BufferAttribute
  private readonly indexAttribute: BufferAttribute

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: RGB,
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

  protected abstract calculateTransformMatrix(object: RenderObject): void

  public render(scene: Scene): void {
    this.program.use()
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.attributes.update({
      position: this.positionAttribute,
      index: this.indexAttribute,
    })

    this.program.uniforms.setValues({
      projectionMatrix: scene.camera.projectionMatrix.elements,
      color: this.color.elements,
    })

    scene.getRenderStack().forEach((object) => {
      this.calculateTransformMatrix(object)
      this.program.uniforms.setValues({ worldMatrix: this.transformMatrix.elements })
      this.gl.drawElements(
        this.gl.LINES,
        this.indexAttribute.count,
        this.indexAttribute.type,
        this.indexAttribute.offset,
      )
    })
  }
}
