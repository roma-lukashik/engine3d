import { AnimationSample } from "@core/animationSample"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Quaternion } from "@math/quaternion"
import { EPS } from "@math/constants"

export class Animation {
  public readonly name: string

  private readonly samples: AnimationSample[]
  private readonly startTime: number
  private readonly endTime: number
  private readonly duration: number

  public constructor(name: string, samples: AnimationSample[]) {
    this.name = name
    this.samples = samples
    this.startTime = Math.min(...samples.map(({ times }) => times[0]))
    this.endTime = Math.max(...samples.map(({ times }) => times[times.length - 1]))
    this.duration = this.endTime - this.startTime
  }

  public update(elapsed: number): void {
    elapsed = Math.min(elapsed % this.duration, this.duration - EPS) + this.startTime

    this.samples.forEach(({ node, transform, times, values }) => {
      const prevIndex = Math.max(1, times.findIndex((t) => t > elapsed)) - 1
      const nextIndex = prevIndex + 1
      const t = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex])

      switch (transform) {
        case "position":
        case "scale":
          const prevVector = Vector3.fromArray(values, prevIndex * Vector3.size)
          const nextVector = Vector3.fromArray(values, nextIndex * Vector3.size)
          node[transform] = prevVector.lerp(nextVector, t)
          break
        case "rotation":
          const prevQuaternion = Quaternion.fromArray(values, prevIndex * Quaternion.size)
          const nextQuaternion = Quaternion.fromArray(values, nextIndex * Quaternion.size)
          node[transform] = prevQuaternion.slerp(nextQuaternion, t)
          break
      }

      node.localMatrix = Matrix4.compose(node.rotation, node.position, node.scale)
    })
  }
}
