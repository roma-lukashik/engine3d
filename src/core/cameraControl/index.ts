import { Camera } from '../camera'
import {
  cartesian2spherical,
  spherical2cartesian,
  SphericalCoordinate,
} from '../../math/coordinateSystems/spherical'
import * as v2 from '../../math/vector2'

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
  const onMouseDown = (event: MouseEvent) => {
    const initialCameraPosition = cartesian2spherical(camera.getPosition(), camera.getTarget())
    const dragStart = v2.vector2(event.clientX, event.clientY)

    const mouseMove = (event: MouseEvent) => {
      const offset = v2.subtract(v2.vector2(event.clientX, event.clientY), dragStart)
      handleRotation(initialCameraPosition, offset)
    }

    const mouseUp = () => {
      window.removeEventListener('mousemove', mouseMove, false)
      window.removeEventListener('mouseup', mouseUp, false)
    }

    window.addEventListener('mousemove', mouseMove, false)
    window.addEventListener('mouseup', mouseUp, false)
  }

  const handleRotation = (startPoint: SphericalCoordinate, offset: v2.Vector2) => {
    const v = v2.multiply(offset, rotationSpeed)
    const theta = startPoint.theta - 2 * Math.PI * v2.x(v) / element.clientWidth
    const phi = Math.min(Math.max(0.00001, startPoint.phi - 2 * Math.PI * v2.y(v) / element.clientHeight), Math.PI)
    const radius = startPoint.radius

    camera.setPosition(spherical2cartesian({ radius, theta, phi }))
  }

  element.addEventListener('mousedown', onMouseDown, false)
}
