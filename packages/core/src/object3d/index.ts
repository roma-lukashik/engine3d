import { Node } from "@core/node"
import { Animation } from "@core/animation"
import { Mesh } from "@core/mesh"
import { Skeleton } from "@core/skeleton"
import { AABB } from "@geometry/bbox/aabb"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"
import { zero } from "@math/operators"
import { OBB } from "@geometry/bbox/obb"

export type RenderObject = {
  readonly node: Node
  readonly skeletons: Skeleton[]
  readonly meshes: Set<Mesh>
  readonly aabb: AABB
  readonly obb: OBB
  frustumCulled: boolean
}

export type RigidBody = {
  readonly node: Node
  readonly velocity: Vector3
  readonly angularVelocity: Vector3
  readonly aabb: AABB
  readonly obb: OBB
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
  public readonly obb: OBB = new OBB()
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
    this.updateOBB()
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

    // Update OBB
    this.obb.center.add(delta)

    this.node.localMatrix.setTranslation(this.node.position)
    this.node.updateWorldMatrix()

    return this
  }

  public setScale(scale: Vector3): this {
    const delta = scale.clone().divide(this.node.scale)
    const invertedRotation = this.node.rotation.clone().invert()

    this.node.scale.copy(scale)

    // Update OBB
    this.obb.halfSize.multiply(delta)
    this.obb.center
      .subtract(this.node.position)
      .rotateByQuaternion(invertedRotation)
      .multiply(delta)
      .rotateByQuaternion(this.node.rotation)
      .add(this.node.position)

    // Update AABB
    this.aabb.min
      .subtract(this.node.position)
      .rotateByQuaternion(invertedRotation)
      .multiply(delta)
      .rotateByQuaternion(this.node.rotation)
      .add(this.node.position)

    this.aabb.max
      .subtract(this.node.position)
      .rotateByQuaternion(invertedRotation)
      .multiply(delta)
      .rotateByQuaternion(this.node.rotation)
      .add(this.node.position)

    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    return this
  }

  public setRotation(rotation: Quaternion): this {
    const deltaRotation = rotation.clone().multiply(this.node.rotation.invert())
    // Update OBB
    this.obb.rotation.copy(rotation)
    this.obb.center
      .subtract(this.node.position)
      .rotateByQuaternion(deltaRotation)
      .add(this.node.position)

    this.node.rotation.copy(rotation)
    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()

    // Recalculate whole AABB
    // Should do after updating matrices
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
    this.updateOBB()
    this.updateAABB()
    this.meshes.forEach((mesh) => mesh.updateSkeleton())
  }

  private updateAABB(): void {
    this.aabb.reset()
    this.obb.getPoints().forEach((point) => this.aabb.expandByPoint(point))
  }

  private updateOBB(): void {
    const scale = this.node.scale
    const position = this.node.position

    // Reset object rotation
    this.node.localMatrix.scaling(scale.x, scale.y, scale.z).setTranslation(position)
    this.node.updateWorldMatrix()

    // Calculate OBB from non rotated AABB
    const aabb = this.calculateAABB()
    this.obb.fromAABB(aabb)
    this.obb.rotation.copy(this.node.rotation)

    // Restore object rotation
    this.node.updateLocalMatrix()
    this.node.updateWorldMatrix()
  }

  private calculateAABB(): AABB {
    const aabb = new AABB()
    if (this.skeletons.length) {
      this.skeletons.forEach((skeleton) => {
        skeleton.bones.forEach((bone) => {
          if (bone.parent) {
            aabb.expandByPoint(bone.parent.getWorldPosition())
          }
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
