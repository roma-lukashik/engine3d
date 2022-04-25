import { Material } from '../material'
import { Geometry } from '../geometry'

export class Mesh {
  constructor(public geometry: Geometry, public material: Material) {
  }
}
