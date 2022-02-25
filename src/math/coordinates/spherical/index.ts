import * as v3 from '../../vector3'
import { clamp } from '../../operators'

type Vector3 = v3.Vector3

export type SphericalCoordinate = {
  radius: number;
  theta: number;
  phi: number;
}

export const toSpherical = (point: Vector3, origin: Vector3): SphericalCoordinate => {
  const redialDirection = v3.subtract(point, origin)
  const radius = v3.length(redialDirection)
  return {
    radius,
    theta: Math.atan2(v3.x(redialDirection), v3.z(redialDirection)),
    phi: Math.acos(clamp(v3.y(redialDirection) / radius, -1, 1)),
  }
}

export const fromSpherical = ({ radius, theta, phi }: SphericalCoordinate): Vector3 => {
  const sinPhiRadius = radius * Math.sin(phi)
  return v3.vector3(
    sinPhiRadius * Math.sin(theta),
    radius * Math.cos(phi),
    sinPhiRadius * Math.cos(theta),
  )
}
