import { fromSpherical, toSpherical } from "@math/coordinates/spherical"
import { clamp } from "@math/operators"
import { EPS, PI, PI2 } from "@math/constants"
import { Vector2 } from "@math/vector2"
import { Camera } from "@core/camera/types"

type Props = {
  camera: Camera
  element: Element
  rotationSpeed?: number
}

export class CameraControl {
  private readonly camera: Camera
  private readonly element: Element
  private readonly rotationSpeed: number

  public constructor({
    camera,
    element,
    rotationSpeed = 1,
  }: Props) {
    this.camera = camera
    this.element = element
    this.rotationSpeed = rotationSpeed
    this.element.requestPointerLock()
    this.element.addEventListener("mousemove", this.onMouseMove)
    this.element.addEventListener("wheel", this.onScroll, { passive: false })
  }

  private onMouseMove = (event: MouseEvent) => {
    const movement = new Vector2(event.movementX, event.movementY).multiplyScalar(this.rotationSpeed)
    const { theta, phi, radius } = toSpherical(this.camera.position, this.camera.target)
    const { width, height } = this.getElementSize()
    const position = fromSpherical({
      theta: theta - PI2 * movement.x / width,
      phi: clamp(phi - PI2 * movement.y / height, EPS, PI / 2),
      radius,
    }).add(
      this.camera.target,
    )
    this.camera.setPosition(position)
  }

  private onScroll = (event: WheelEvent) => {
    const position = this.camera.target
      .clone()
      .subtract(this.camera.position)
      .normalize()
      .multiplyScalar(event.deltaY)
      .add(this.camera.position)
    this.camera.setPosition(position)
    event.preventDefault()
  }

  private getElementSize(): { width: number; height: number; } {
    return { width: this.element.clientWidth, height: this.element.clientHeight }
  }
}
