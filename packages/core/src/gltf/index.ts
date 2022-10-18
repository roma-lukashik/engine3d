import { Object3d } from "@core/object3d"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

// TODO Rename
export class Gltf<AnimationKeys extends string = string> {
  public readonly node: Object3d
  public readonly skeletons: Skeleton[] = []
  public readonly meshes: Set<Mesh> = new Set()
  public readonly aabb: AABB = new AABB(Vector3.zero().set(Infinity), Vector3.zero().set(-Infinity))

  private readonly animations: Record<AnimationKeys, Animation>

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

  public animate(key: AnimationKeys, time: number): void {
    this.animations[key].update(time)
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
    this.updateWorldMatrix()
  }

  public updateWorldMatrix(matrix: Matrix4 = Matrix4.identity()): void {
    this.node.updateWorldMatrix(matrix)
    this.updateAABB()
  }

  private updateAABB(): void {
    this.resetAABB()

    if (this.skeletons.length) {
      this.node.traverse((object) => {
        this.aabb.expandByPoint(object.getWorldPosition())
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
