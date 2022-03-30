import { WebGLMesh } from '../mesh'
import { Mesh } from '../../core/mesh'
import {
  AmbientLight,
  DirectionalLight,
  isAmbientLight,
  isDirectionalLight,
  isPointLight,
  isShadowLight,
  Light,
  LightWithShadow,
  PointLight,
} from '../../core/lights'
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

  public get pointLights(): PointLight[] {
    return this.lights.filter(isPointLight)
  }

  public get directionalLights(): DirectionalLight[] {
    return this.lights.filter(isDirectionalLight)
  }

  public get ambientLights(): AmbientLight[] {
    return this.lights.filter(isAmbientLight)
  }

  public get shadowLights(): Array<Light & LightWithShadow> {
    return this.lights.filter(isShadowLight)
  }

  constructor({ gl }: Props) {
    this.gl = gl
    this.shadow = new Shadow({ gl: this.gl })
  }

  public addMesh(...meshes: Mesh[]): void {
    meshes.forEach((mesh) => {
      this.meshes.set(mesh, new WebGLMesh({ gl: this.gl, mesh }))
    })
  }

  public addLight(...lights: Light[]): void {
    this.lights.push(...lights)
    this.dirty = true
  }
}
