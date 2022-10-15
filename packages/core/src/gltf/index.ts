import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"

export class Gltf<AnimationKeys extends string> {
  public readonly node: Object3d
  public readonly skeletons: Skeleton[] = []
  public readonly aabb: AABB = new AABB(Vector3.zero().set(Infinity), Vector3.zero().set(-Infinity))

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
          object.updateSkeleton()
          this.skeletons.push(object.skeleton)
        }
      }
    })
    this.updateAABB()
  }

  public run(key: AnimationKeys, time: number): void {
    this.animations[key].update(time)
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
    this.node.updateWorldMatrix()
    this.updateAABB()
  }

  public updateAABB(): void {
    this.resetAABB()

    if (this.skeletons.length) {
      this.skeletons.forEach((skeleton) => {
        const points = new Float32Array(skeleton.bones.length * 2 * Vector3.size)
        skeleton.bones.forEach((bone, i) => {
          const i2 = i * 2
          const start = bone.worldMatrix.translationVector()
          const end = bone.parent!.worldMatrix.translationVector()
          points.set(start.elements, i2 * Vector3.size)
          points.set(end.elements, (i2 + 1) * Vector3.size)
        })
        this.aabb.expandByAABB(new AABB(points))
      })
    } else {
      this.meshes.forEach((mesh) => {
        const aabb = new AABB(mesh.geometry.position.array)
        aabb.min.transformMatrix4(mesh.worldMatrix)
        aabb.max.transformMatrix4(mesh.worldMatrix)
        this.aabb.expandByAABB(aabb)
      })
    }
  }

  private resetAABB(): void {
    this.aabb.min.set(Infinity)
    this.aabb.max.set(-Infinity)
  }
}
