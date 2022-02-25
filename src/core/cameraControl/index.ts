import { Camera } from '../camera'
import {
  fromSpherical,
  toSpherical,
  SphericalCoordinate,
} from '../../math/coordinates/spherical'
import * as v2 from '../../math/vector2'
import { clamp } from '../../math/operators'
import { PI, PI2 } from '../../math/constants'

type CameraControlOptions = {
  camera: Camera;
  element?: HTMLElement;
  rotationSpeed?: number;
}

export const createCameraControl = ({
  camera,
  element = document.body,
  rotationSpeed = 1,
}: CameraControlOptions) => {
  return new CameraControl({ camera, element, rotationSpeed })
}

class CameraControl {
  private camera: Camera
  private element: HTMLElement
  private rotationSpeed: number

  constructor(options: Required<CameraControlOptions>) {
    Object.assign(this, options)
    this.element.addEventListener('mousedown', this.onMouseDown, false)
  }

  private onMouseDown = (event: MouseEvent) => {
    const initialCameraPosition = toSpherical(this.camera.getPosition(), this.camera.getTarget())
    const dragStart = v2.vector2(event.clientX, event.clientY)
    const width = this.element.clientWidth
    const height = this.element.clientHeight

    const mouseMove = (event: MouseEvent) => {
      const offset = v2.subtract(v2.vector2(event.clientX, event.clientY), dragStart)
      this.rotate(initialCameraPosition, offset, width, height)
    }

    const mouseUp = () => {
      window.removeEventListener('mousemove', mouseMove, false)
      window.removeEventListener('mouseup', mouseUp, false)
    }

    window.addEventListener('mousemove', mouseMove, false)
    window.addEventListener('mouseup', mouseUp, false)
  }

  private rotate({ theta, phi, radius }: SphericalCoordinate, offset: v2.Vector2, width: number, height: number) {
    const v = v2.multiply(offset, this.rotationSpeed)
    this.camera.setPosition(
      fromSpherical({
        theta: theta - PI2 * v2.x(v) / width,
        phi: clamp(phi - PI2 * v2.y(v) / height, 0.00001, PI),
        radius,
      }),
    )
  }
}
