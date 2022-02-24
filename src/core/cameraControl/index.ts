import { Camera } from '../camera'
import {
  cartesian2spherical,
  spherical2cartesian,
  SphericalCoordinate,
} from '../../math/coordinates/spherical'
import * as v2 from '../../math/vector2'
import { clamp } from '../../math/operators'

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
    const initialCameraPosition = cartesian2spherical(this.camera.getPosition(), this.camera.getTarget())
    const dragStart = v2.vector2(event.clientX, event.clientY)

    const mouseMove = (event: MouseEvent) => {
      const offset = v2.subtract(v2.vector2(event.clientX, event.clientY), dragStart)
      this.handleRotation(initialCameraPosition, offset)
    }

    const mouseUp = () => {
      window.removeEventListener('mousemove', mouseMove, false)
      window.removeEventListener('mouseup', mouseUp, false)
    }

    window.addEventListener('mousemove', mouseMove, false)
    window.addEventListener('mouseup', mouseUp, false)
  }

  private handleRotation(startPoint: SphericalCoordinate, offset: v2.Vector2) {
    const v = v2.multiply(offset, this.rotationSpeed)
    const theta = startPoint.theta - 2 * Math.PI * v2.x(v) / this.element.clientWidth
    const phi = clamp(startPoint.phi - 2 * Math.PI * v2.y(v) / this.element.clientHeight, 0.00001, Math.PI)
    const radius = startPoint.radius
    this.camera.setPosition(spherical2cartesian({ radius, theta, phi }))
  }
}
