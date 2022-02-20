import { Camera } from '../camera'
import * as v2 from '../../math/vector2'
import * as v3 from '../../math/vector3'

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
  let dragStart = v2.vector2(0, 0)
  let startTheta = 0
  let startPhi = 0
  let radius = 0

  const onMouseDown = (event: MouseEvent) => {
    const v = v3.subtract(camera.getPosition(), camera.getTarget())

    radius = v3.length(v)
    startTheta = Math.atan2(v3.x(v), v3.z(v))
    startPhi = Math.acos(Math.min(Math.max(v3.y(v) / radius, -1), 1))
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
    const theta = startTheta - 2 * Math.PI * v[0] / element.clientWidth
    const phi = Math.min(Math.max(0.00001, startPhi - 2 * Math.PI * v[1] / element.clientHeight), Math.PI)
    const sinPhiRadius = radius * Math.sin(phi)

    camera.setPosition(
      v3.vector3(
        sinPhiRadius * Math.sin(theta),
        radius * Math.cos(phi),
        sinPhiRadius * Math.cos(theta),
      ),
    )
  }

  element.addEventListener('mousedown', onMouseDown, false)
}
