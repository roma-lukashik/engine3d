import { Node } from "@core/node"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"
import { TypedArray } from "@core/types"
import { Geometry } from "@core/geometry"
import { TypedArrayByComponentType } from "@core/bufferAttribute/utils"

export class Object3D<AnimationKeys extends string = string> {
  public readonly node: Node
  public readonly skeletons: Skeleton[] = []
  public readonly meshes: Set<Mesh> = new Set()
  public readonly aabb: AABB = new AABB(Vector3.zero().set(Infinity), Vector3.zero().set(-Infinity))
  public frustumCulled: boolean = true

  private readonly animations: Record<AnimationKeys, Animation>

  public constructor(
    node: Node,
    animations: Record<AnimationKeys, Animation> = {} as Record<AnimationKeys, Animation>,
  ) {
    this.node = node
    this.animations = animations
    this.node.updateWorldMatrix()
    this.node.traverse((node) => {
      if (node instanceof Mesh) {
        this.meshes.add(node)
        if (node.skeleton) {
          node.updateSkeleton()
          this.skeletons.push(node.skeleton)
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

  public updateWorldMatrix(): void {
    this.node.updateWorldMatrix()
    this.updateAABB()
  }

  private updateAABB(): void {
    this.resetAABB()

    if (this.skeletons.length) {
      this.node.traverse((node) => {
        this.aabb.expandByPoint(node.getWorldPosition())
      })
    } else {
      this.meshes.forEach((mesh) => {
        const points = this.getPositionPoints(mesh.geometry)
        const aabb = new AABB(points)
        aabb.min.transformMatrix4(mesh.worldMatrix)
        aabb.max.transformMatrix4(mesh.worldMatrix)
        this.aabb.expandByPoint(aabb.min)
        this.aabb.expandByPoint(aabb.max)
      })
    }
  }

  private getPositionPoints(geometry: Geometry): TypedArray {
    const { position, index } = geometry
    const TypedArrayConstructor = TypedArrayByComponentType[position.type]
    if (index) {
      const points = new TypedArrayConstructor(index.count * position.itemSize)
      index.forEach(([positionIndex], i) => {
        points.set(position.getBufferElement(positionIndex), i * position.itemSize)
      })
      return points
    } else {
      const points = new TypedArrayConstructor(position.count * position.itemSize)
      position.forEach((pointArray, i) => points.set(pointArray, i * position.itemSize))
      return points
    }
  }

  private resetAABB(): void {
    this.aabb.min.set(Infinity)
    this.aabb.max.set(-Infinity)
  }
}
