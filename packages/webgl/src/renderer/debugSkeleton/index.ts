import { DebugLinesProgram } from "@webgl/program/debugLines"
import { RenderState } from "@webgl/utils/state"
import { Camera } from "@core/camera"
import { BufferAttribute } from "@core/bufferAttribute"
import { Matrix4 } from "@math/matrix4"
import { BufferViewTarget } from "@core/loaders/types"
import { range } from "@utils/array"
import { Vector3 } from "@math/vector3"
import { Object3D } from "@core/object3d"
import { RGB } from "@core/color/rgb"

const identity = Matrix4.identity()

export class DebugSkeletonRenderer {
  private readonly gl: WebGLRenderingContext
  private readonly program: DebugLinesProgram
  private readonly color: RGB

  public constructor(
    gl: WebGLRenderingContext,
    state: RenderState,
    color: RGB = new RGB(0x30CF65),
  ) {
    this.gl = gl
    this.color = color
    this.program = new DebugLinesProgram(gl, state)
  }

  public render(object: Object3D, camera: Camera): void {
    if (!object.skeletons.length) {
      return
    }
    const positions = this.getSkeletonPoints(object)
    const positionAttribute = new BufferAttribute({
      array: positions,
      itemSize: Vector3.size,
    })
    const indexAttribute = new BufferAttribute({
      array: new Uint16Array(range(0, positions.length / Vector3.size)),
      itemSize: 1,
      target: BufferViewTarget.ElementArrayBuffer,
    })

    this.program.use()
    this.gl.disable(this.gl.DEPTH_TEST)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)

    this.program.attributes.update({
      position: positionAttribute,
      index: indexAttribute,
    })

    this.program.uniforms.setValues({
      worldMatrix: identity.elements,
      projectionMatrix: camera.projectionMatrix.elements,
      color: this.color.elements,
    })

    this.gl.drawElements(this.gl.LINES, indexAttribute.count, indexAttribute.type, indexAttribute.offset)
  }

  // TODO move to somewhere
  private getSkeletonPoints(object: Object3D): Float32Array {
    const doubledVectorSize = Vector3.size * 2
    const pointsAmount = object.skeletons.reduce((amount, skeleton) => {
      return amount + (skeleton.bones.length - 1) * doubledVectorSize
    }, 0)
    const points = new Float32Array(pointsAmount)

    let offset = 0
    object.skeletons.forEach((skeleton) => {
      // Skip first (root) bone
      for (let i = 1; i < skeleton.bones.length; i++) {
        const bone = skeleton.bones[i]
        const start = bone.getWorldPosition()
        const end = bone.parent!.getWorldPosition()
        points.set(start.elements, offset)
        points.set(end.elements, offset + Vector3.size)
        offset += doubledVectorSize
      }
    })
    return points
  }
}
