import {
  fromSpherical,
  toSpherical,
  SphericalCoordinate,
} from "@math/coordinates/spherical"
import { clamp } from "@math/operators"
import { EPS, PI, PI2 } from "@math/constants"
import { Vector2 } from "@math/vector2"
import { Camera } from "@core/camera/types"

type Props = {
  camera: Camera
  element?: HTMLElement | Document
  rotationSpeed?: number
}

export class CameraControl {
  private camera: Camera
  private element: HTMLElement | Document
  private rotationSpeed: number

  constructor({
    camera,
    element = document,
    rotationSpeed = 1,
  }: Props) {
    Object.assign(this, { camera, element, rotationSpeed })
    this.element.addEventListener("mousedown", this.onMouseDown, false)
  }

  private onMouseDown = (event: MouseEvent) => {
    const initialCameraPosition = toSpherical(this.camera.position, this.camera.target)
    const dragStart = new Vector2(event.clientX, event.clientY)
    const { width, height } = this.getElementSize()

    const mouseMove = (event: MouseEvent) => {
      const offset = new Vector2(event.clientX, event.clientY).subtract(dragStart).multiply(this.rotationSpeed)
      this.rotate(initialCameraPosition, offset, width, height)
    }

    const mouseUp = () => {
      window.removeEventListener("mousemove", mouseMove, false)
      window.removeEventListener("mouseup", mouseUp, false)
    }

    window.addEventListener("mousemove", mouseMove, false)
    window.addEventListener("mouseup", mouseUp, false)
  }

  private rotate({ theta, phi, radius }: SphericalCoordinate, v: Vector2, width: number, height: number) {
    this.camera.setPosition(
      fromSpherical({
        theta: theta - PI2 * v.x / width,
        phi: clamp(phi - PI2 * v.y / height, EPS, PI / 2),
        radius,
      }),
    )
  }

  private getElementSize(): { width: number; height: number; } {
    if (this.isDocument(this.element)) {
      return { width: window.innerWidth, height: window.innerHeight }
    } else {
      return { width: this.element.clientWidth, height: this.element.clientHeight }
    }
  }

  private isDocument(element: HTMLElement | Document): element is Document {
    return element === document
  }
}
