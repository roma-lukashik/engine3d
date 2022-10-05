import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"

export class Gltf<AnimationKeys extends string> {
  public readonly node: Object3d

  private readonly animations?: Record<AnimationKeys, Animation>

  public constructor(
    node: Object3d,
    animations?: Record<AnimationKeys, Animation>,
  ) {
    this.node = node
    this.animations = animations
  }

  public getAnimation(key: AnimationKeys): Animation | undefined {
    return this.animations?.[key]
  }
}
