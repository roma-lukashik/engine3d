import { AnimationInterpolationType } from "@core/loaders/types"
import { Object3d } from "@core/object3d"
import { TypedArray } from "@core/types"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Quaternion } from "@math/quaternion"
import { EPS } from "@math/constants"

type AnimationData = {
  node: Object3d
  times: TypedArray
  values: TypedArray
  interpolation: AnimationInterpolationType
  transform: "position" | "rotation" | "scale"
}

export class Animation {
  public readonly name: string

  private readonly data: AnimationData[]
  private readonly startTime: number
  private readonly endTime: number
  private readonly duration: number

  constructor(name: string, data: AnimationData[]) {
    this.name = name
    this.data = data
    this.startTime = Math.min(...data.map(({ times }) => times[0]))
    this.endTime = Math.max(...data.map(({ times }) => times[times.length - 1]))
    this.duration = this.endTime - this.startTime
  }

  public update(elapsed: number): void {
    elapsed = elapsed % this.duration
    elapsed = Math.min(elapsed, this.duration - EPS) + this.startTime

    this.data.forEach(({ node, transform, times, values }) => {
      const prevIndex = Math.max(1, times.findIndex((t) => t > elapsed)) - 1
      const nextIndex = prevIndex + 1
      const alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex])

      switch (transform) {
        case "position":
        case "scale":
          node[transform] = transformVector(values, prevIndex, nextIndex, alpha)
          break
        case "rotation":
          node[transform] = transformQuaternion(values, prevIndex, nextIndex, alpha)
          break
      }

      node.localMatrix = Matrix4.compose(node.rotation, node.position, node.scale)
    })
  }
}

function transformQuaternion(values: TypedArray, prevIndex: number, nextIndex: number, t: number): Quaternion {
  const prev = Quaternion.fromArray(values, prevIndex * 4)
  const next = Quaternion.fromArray(values, nextIndex * 4)
  return prev.slerp(next, t)
}

function transformVector(values: TypedArray, prevIndex: number, nextIndex: number, t: number): Vector3 {
  const prev = Vector3.fromArray(values, prevIndex * 3)
  const next = Vector3.fromArray(values, nextIndex * 3)
  return prev.lerp(next, t)
}
