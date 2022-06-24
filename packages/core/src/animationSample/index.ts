import { Object3d } from "@core/object3d"
import { TypedArray } from "@core/types"
import { AnimationInterpolationType } from "@core/loaders/types"

type Props = {
  node: Object3d
  times: TypedArray
  values: TypedArray
  interpolation?: AnimationInterpolationType
  transform: Transform
}

type Transform = "position" | "rotation" | "scale"

export class AnimationSample {
  public node: Object3d
  public times: TypedArray
  public values: TypedArray
  public interpolation: AnimationInterpolationType
  public transform: Transform

  public constructor({
    node,
    times,
    values,
    interpolation = AnimationInterpolationType.Linear,
    transform,
  }: Props) {
    this.node = node
    this.times = times
    this.values = values
    this.interpolation = interpolation
    this.transform = transform
  }
}
