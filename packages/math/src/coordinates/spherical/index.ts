import { clamp } from "@math/operators"
import { Vector3 } from "@math/vector3"

export type SphericalCoordinate = {
  radius: number
  theta: number
  phi: number
}

export const toSpherical = (point: Vector3, origin: Vector3): SphericalCoordinate => {
  const direction = point.clone().subtract(origin)
  const radius = direction.length()
  return {
    radius,
    theta: Math.atan2(direction.x, direction.z),
    phi: Math.acos(clamp(direction.y / radius, -1, 1)),
  }
}

export const fromSpherical = ({ radius, theta, phi }: SphericalCoordinate): Vector3 => {
  const sinPhiRadius = radius * Math.sin(phi)
  return new Vector3(
    sinPhiRadius * Math.sin(theta),
    radius * Math.cos(phi),
    sinPhiRadius * Math.cos(theta),
  )
}
