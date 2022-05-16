import { AnimationInterpolationType, GltfNode } from '../../types'
import { BufferAttribute } from '../bufferAttribute'
import * as v3 from '../../../../math/vector3'
import * as q from '../../../../math/quaternion'

type AnimationData = {
  node: GltfNode
  times: BufferAttribute['array'] // TODO
  values: BufferAttribute['array'] // TODO
  interpolation: AnimationInterpolationType
  transform: string
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
      const size = transform === 'rotation' ? 4 : 3
      const prevVal = fromArray(values, prevIndex * size, size)
      const nextVal = fromArray(values, nextIndex * size, size)
      const lerp = transform === 'rotation' ?
        q.slerp(prevVal as q.Quaternion, nextVal as q.Quaternion, alpha) :
        v3.lerp(prevVal as v3.Vector3, nextVal as v3.Vector3, alpha)

      // @ts-ignore
      node[transform] = lerp
    })
  }
}

const fromArray = (array: ArrayLike<number>, startIndex: number, count: number): v3.Vector3 | q.Quaternion =>
  Array.from({ length: count }, (_: number, k: number) => array[startIndex + k]) as v3.Vector3 | q.Quaternion
