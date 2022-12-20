import { Node } from "@core/node"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { zero } from "@math/operators"
import { OOBB } from "@geometry/bbox/oobb"

export type RenderObject = {
  readonly node: Node
  readonly skeletons: Skeleton[]
  readonly meshes: Set<Mesh>
  readonly aabb: AABB
  readonly oobb: OOBB
  frustumCulled: boolean
}

export type RigidBody = {
  readonly node: Node
  readonly velocity: Vector3
  readonly angularVelocity: Vector3
  readonly aabb: AABB
  readonly oobb: OOBB
  readonly mass: number
  readonly invMass: number
  isMovable: boolean
  colliders: RigidBody[]
  restitution: number
  friction: number
  staticFriction: number
  airFriction: number
  setMass(mass: number): RigidBody
  setPosition(position: Vector3): RigidBody
  move(delta: Vector3): RigidBody
  setScale(scale: Vector3): RigidBody
  setRotation(rotation: Quaternion): RigidBody
}

export class Object3D<AnimationKeys extends string = string> implements RenderObject, RigidBody {
  public readonly node: Node
  public readonly skeletons: Skeleton[] = []
  public readonly meshes: Set<Mesh> = new Set()
  public readonly aabb: AABB = new AABB()
  public readonly oobb: OOBB = new OOBB()
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
    this.updateOOBB()
    this.updateAABB()
  }

  public setPosition(position: Vector3): this {
    return this.move(position.clone().subtract(this.node.position))
  }

  public move(delta: Vector3): this {
    this.node.position.add(delta)

    // Update AABB
    this.aabb.min.add(delta)
    this.aabb.max.add(delta)

    // Update OOBB
    this.oobb.center.add(delta)

    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    return this
  }

  public setScale(scale: Vector3): this {
    const delta = scale.clone().subtract(this.node.scale)
    this.node.scale.copy(scale)

    // Update AABB
    const deltaHalfSize = this.aabb.getSize().multiply(delta).divideScalar(2)
    this.aabb.min.subtract(deltaHalfSize)
    this.aabb.max.add(deltaHalfSize)

    // Update OOBB
    this.oobb.halfSize.multiply(delta)

    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    return this
  }

  public setRotation(rotation: Quaternion): this {
    this.node.rotation.copy(rotation)

    // Update OOBB
    this.oobb.rotation.copy(rotation)

    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    // Update AABB
    // Should update after updating matrices
    this.updateAABB()

    return this
  }

  public setMass(mass: number): this {
    this.mass = mass
    this.invMass = zero(mass) ? 0 : (1 / mass)
    return this
  }

  public animate(key: AnimationKeys, time: number): void {
    if (!this.animations[key]) {
      return
    }
    this.animations[key].update(time)
    this.updateOOBB()
    this.updateAABB()
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
  }

  private updateAABB(): void {
    const aabb = this.calculateAABB()
    this.aabb.min.copy(aabb.min)
    this.aabb.max.copy(aabb.max)
  }

  private updateOOBB(): void {
    // Reset object matrices
    this.node.localMatrix.identity()
    this.node.updateWorldMatrix()

    // Calculate OOBB from non transformed AABB
    const aabb = this.calculateAABB()
    this.oobb.fromAABB(aabb)

    // Restore object matrices
    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    // Apply object transformations
    this.oobb.center.copy(this.node.position)
    this.oobb.halfSize.multiply(this.node.scale)
    this.oobb.rotation.copy(this.node.rotation)
  }

  private calculateAABB(): AABB {
    const aabb = new AABB()
    if (this.skeletons.length) {
      this.skeletons.forEach((skeleton) => {
        skeleton.bones.forEach((bone) => {
          aabb.expandByPoint(bone.getWorldPosition())
        })
      })
    } else {
      this.meshes.forEach((mesh) => {
        const box = new AABB(mesh.geometry.positionPoints)
        box.min.transformMatrix4(mesh.worldMatrix)
        box.max.transformMatrix4(mesh.worldMatrix)
        aabb.expandByPoint(box.min)
        aabb.expandByPoint(box.max)
      })
    }
    return aabb
  }
}
