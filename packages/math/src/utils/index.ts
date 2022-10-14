import type { Vector2Tuple } from "@math/vector2"
import type { Vector3Tuple } from "@math/vector3"
import type { Vector4Tuple } from "@math/vector4"
import type { Matrix4Tuple } from "@math/matrix4"

export const minmax = <
  T extends number,
  R extends
    T extends 1 ? [number] : // scalar
    T extends 2 ? Vector2Tuple :
    T extends 3 ? Vector3Tuple :
    T extends 4 ? Vector4Tuple :
    T extends 16 ? Matrix4Tuple :
    number[]
>(array: ArrayLike<number>, size: T): [min: R, max: R] => {
  const min = Array.from({ length: size }, () => Infinity) as R
  const max = Array.from({ length: size }, () => -Infinity) as R

  for (let i = 0; i < array.length; i += size) {
    for(let j = 0; j < size; j++) {
      min[j] = Math.min(min[j], array[i + j])
      max[j] = Math.max(max[j], array[i + j])
    }
  }

  return [min, max]
}
