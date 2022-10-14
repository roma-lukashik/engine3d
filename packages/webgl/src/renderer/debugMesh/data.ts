import { Vector3 } from "@math/vector3"

export const positions = [
  new Vector3(1, 1, 1),
  new Vector3(-1, 1, 1),
  new Vector3(-1, -1, 1),
  new Vector3(1, -1, 1),
  new Vector3(1, 1, -1),
  new Vector3(-1, 1, -1),
  new Vector3(-1, -1, -1),
  new Vector3(1, -1, -1),
]

export const indexes = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7,
])