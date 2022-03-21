import { WebGLMesh } from '../mesh'
import { Mesh } from '../../core/mesh'
import { Light } from '../../core/lights'
import { Shadow } from '../shadow'

type Props = {
  gl: WebGLRenderingContext;
}

export class Scene {
  private readonly gl: WebGLRenderingContext

  public meshes: Map<Mesh, WebGLMesh> = new Map()
  public lights: Light[] = []
  public shadow: Shadow
  public dirty: boolean = false

  constructor({ gl }: Props) {
    this.gl = gl
  }

  public addMesh(...meshes: Mesh[]): void {
    meshes.forEach((mesh) => {
      this.meshes.set(mesh, new WebGLMesh({ gl: this.gl, mesh }))
    })
  }

  public addLight(...lights: Light[]): void {
    this.lights.push(...lights)
    if (lights.some((light) => light.castShadow)) {
      this.shadow = new Shadow({ gl: this.gl, lights: this.lights.filter((light) => light.castShadow) })
    }
    this.dirty = true
  }
}
