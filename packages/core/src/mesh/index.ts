import { Material } from "@core/material"
import { Geometry } from "@core/geometry"
import { Node } from "@core/node"
import { Skeleton } from "@core/skeleton"

type MeshProps = ConstructorParameters<typeof Node>[0] & {
  geometry: Geometry
  material: Material
}

export class Mesh extends Node {
  public geometry: Geometry
  public material: Material
  public skeleton?: Skeleton

  public constructor({
    geometry,
    material,
    ...props
  }: MeshProps) {
    super(props)

    this.geometry = geometry
    this.material = material
  }

  public bindSkeleton(skeleton: Skeleton): void {
    this.skeleton = skeleton
  }

  public updateSkeleton(): void {
    this.skeleton?.update(this)
  }
}
