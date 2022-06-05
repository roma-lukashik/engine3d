import { AnimationInterpolationType } from "@core/loaders/types"
import { Object3d } from "@core/object3d"
import { TypedArray } from "@core/types"
import * as v3 from "@math/vector3"
import * as q from "@math/quaternion"
import { Quaternion, Vector3 } from "@math/types"

type AnimationData = {
  node: Object3d
  times: TypedArray
  values: TypedArray
  interpolation: AnimationInterpolationType
  transform: keyof Pick<Object3d, "position" | "rotation" | "scale">
}

export class Animation {
  public name: string
  public data: AnimationData[]
  public startTime: number
  public endTime: number
  public duration: number

  constructor(name: string, data: AnimationData[]) {
    this.name = name
    this.data = data
    this.startTime = Math.min(...data.map(({ times }) => times[0]))
    this.endTime = Math.max(...data.map(({ times }) => times[times.length - 1]))
    this.duration = this.endTime - this.startTime
  }

  public update(elapsed: number): void {
    elapsed = Math.min(elapsed, this.duration - 0.001) + this.startTime

    this.data.forEach(({ node, transform, times, values }) => {
      const prevIndex = Math.max(1, times.findIndex((t) => t > elapsed)) - 1
      const nextIndex = prevIndex + 1
      const alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex])
      const size = values.length / times.length
      const prevVal = fromArray(values, prevIndex * size, size)
      const nextVal = fromArray(values, nextIndex * size, size)

      if (transform === "rotation") {
        node.rotation = q.slerp(prevVal as Quaternion, nextVal as Quaternion, alpha)
      } else {
        node[transform] = v3.lerp(prevVal as Vector3, nextVal as Vector3, alpha)
      }
    })
  }
}

const fromArray = (array: ArrayLike<number>, startIndex: number, count: number): Vector3 | Quaternion =>
  Array.from({ length: count }, (_: number, i: number) => array[startIndex + i]) as Vector3 | Quaternion
