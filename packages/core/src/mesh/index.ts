import { Material } from "@core/material"
import { Geometry } from "@core/geometry"
import { Object3d } from "@core/object3d"
import { Skeleton } from "@core/skeleton"

type MeshProps = ConstructorParameters<typeof Object3d>[0] & {
  geometry: Geometry
  material: Material
}

export class Mesh extends Object3d {
  public geometry: Geometry
  public material: Material
  public skeleton?: Skeleton

  constructor({
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
}
