import { Camera } from '../camera'
import {
  cartesian2spherical,
  spherical2cartesian,
  zeroSphericalCoordinate,
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
  let startPoint = zeroSphericalCoordinate()
  let dragStart = v2.vector2(0, 0)

  const onMouseDown = (event: MouseEvent) => {
    startPoint = cartesian2spherical(camera.getPosition(), camera.getTarget())
    dragStart = v2.vector2(event.clientX, event.clientY)

    window.addEventListener('mousemove', onMouseMove, false)
    window.addEventListener('mouseup', onMouseUp, false)
  }

  const onMouseMove = (event: MouseEvent) => {
    handleRotation(v2.vector2(event.clientX, event.clientY))
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove, false)
    window.removeEventListener('mouseup', onMouseUp, false)
  }

  const handleRotation = (drag: v2.Vector2) => {
    const v = v2.multiply(v2.subtract(drag, dragStart), rotationSpeed)
    const theta = startPoint.theta - 2 * Math.PI * v[0] / element.clientWidth
    const phi = Math.min(Math.max(0.00001, startPoint.phi - 2 * Math.PI * v[1] / element.clientHeight), Math.PI)
    const radius = startPoint.radius

    camera.setPosition(spherical2cartesian({ radius, theta, phi }))
  }

  element.addEventListener('mousedown', onMouseDown, false)
}
