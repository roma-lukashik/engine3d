import { Node } from "@core/node"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { TypedArray } from "@core/types"
import { Geometry } from "@core/geometry"
import { TypedArrayByComponentType } from "@core/bufferAttribute/utils"
import { Vector3 } from "@math/vector3"
import { zero } from "@math/operators"

export type RenderObject = {
  readonly node: Node
  readonly skeletons: Skeleton[]
  readonly meshes: Set<Mesh>
  readonly aabb: AABB
  frustumCulled: boolean
}

export type RigidBody = {
  readonly node: Node
  readonly velocity: Vector3
  readonly angularVelocity: Vector3
  readonly aabb: AABB
  readonly mass: number
  readonly invMass: number
  isMovable: boolean
  colliders: RigidBody[]
  restitution: number
  friction: number
  staticFriction: number
  airFriction: number
  setMass(mass: number): void
  updateWorldMatrix(): void
}

export class Object3D<AnimationKeys extends string = string> implements RenderObject, RigidBody {
  public readonly node: Node
  public readonly skeletons: Skeleton[] = []
  public readonly meshes: Set<Mesh> = new Set()
  public readonly aabb: AABB = new AABB()
  public frustumCulled: boolean = true

  public readonly velocity: Vector3 = Vector3.zero()
  public readonly angularVelocity: Vector3 = Vector3.zero()
  public isMovable: boolean = true
  public mass: number = Number.MAX_SAFE_INTEGER
  public invMass: number = 1 / this.mass
  public restitution: number = 0
  public friction: number = 0.1
  public staticFriction: number = 0.2
  public airFriction: number = 0.001
  public colliders: RigidBody[] = []

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

  public setMass(mass: number): void {
    this.mass = mass
    this.invMass = zero(mass) ? 0 : (1 / mass)
  }

  public animate(key: AnimationKeys, time: number): void {
    if (!this.animations[key]) {
      return
    }
    this.animations[key].update(time)
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
    this.updateWorldMatrix()
  }

  public updateWorldMatrix(): void {
    this.node.updateWorldMatrix()
    this.updateAABB()
  }

  private updateAABB(): void {
    this.aabb.reset()
    if (this.skeletons.length) {
      this.skeletons[0].bones.forEach((bone) => {
        this.aabb.expandByPoint(bone.getWorldPosition())
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
}
