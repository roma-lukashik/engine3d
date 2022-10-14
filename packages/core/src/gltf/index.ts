import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"

export class Gltf<AnimationKeys extends string> {
  public readonly node: Object3d
  public readonly skeletons: Skeleton[] = []

  private readonly animations: Record<AnimationKeys, Animation>
  private readonly meshes: Set<Mesh> = new Set()

  public constructor(
    node: Object3d,
    animations: Record<AnimationKeys, Animation> = {} as Record<AnimationKeys, Animation>,
  ) {
    this.node = node
    this.animations = animations
    this.node.updateWorldMatrix()
    this.node.traverse((object) => {
      if (object instanceof Mesh) {
        this.meshes.add(object)
        if (object.skeleton) {
          object.skeleton.update(object)
          this.skeletons.push(object.skeleton)
        }
      }
    })
  }

  public run(key: AnimationKeys, time: number): void {
    this.animations[key].update(time)
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
    this.node.updateWorldMatrix()
  }
}
