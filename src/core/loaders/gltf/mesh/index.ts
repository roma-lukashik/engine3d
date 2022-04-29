import { Material } from '../material'
import { Geometry } from '../geometry'
import { Object3d } from '../object3d'

type MeshProps = ConstructorParameters<typeof Object3d>[0] & {
  geometry: Geometry
  material: Material
}

export class Mesh extends Object3d {
  public geometry: Geometry
  public material: Material

  constructor({
    geometry,
    material,
    ...props
  }: MeshProps) {
    super(props)

    this.geometry = geometry
    this.material = material
  }
}
