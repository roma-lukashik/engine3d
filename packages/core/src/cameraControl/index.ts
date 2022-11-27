import { fromSpherical, toSpherical } from "@math/coordinates/spherical"
import { clamp } from "@math/operators"
import { EPS, PI, PI2 } from "@math/constants"
import { Vector2 } from "@math/vector2"
import { Camera } from "@core/camera/types"
import { MouseControl } from "@core/controls/mouse"

type Props = {
  camera: Camera
  element: Element
  speed?: number
}

export class CameraControl {
  private readonly camera: Camera

  public constructor({
    camera,
    element,
    speed = 1,
  }: Props) {
    this.camera = camera
    const control = new MouseControl({ element, speed })
    control.subscribeOnMouseMove(this.onMouseMove)
    control.subscribeOnMouseWheel(this.onScroll)
  }

  private onMouseMove = (movement: Vector2) => {
    const { theta, phi, radius } = toSpherical(this.camera.position, this.camera.target)
    const position = fromSpherical({
      theta: theta - PI2 * movement.x,
      phi: clamp(phi - PI2 * movement.y, EPS, PI / 2),
      radius,
    }).add(
      this.camera.target,
    )
    this.camera.setPosition(position)
  }

  private onScroll = (deltaY: number) => {
    const position = this.camera.target
      .clone()
      .subtract(this.camera.position)
      .normalize()
      .multiplyScalar(deltaY)
      .add(this.camera.position)
    this.camera.setPosition(position)
  }
}
