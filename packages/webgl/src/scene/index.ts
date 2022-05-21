import { WebGLMesh } from "@webgl/mesh"
import { Shadow } from "@webgl/shadow"
import { Mesh } from "@core/loaders/gltf/mesh"
import {
  AmbientLight,
  DirectionalLight,
  isAmbientLight,
  isDirectionalLight,
  isPointLight,
  isShadowLight,
  isSpotLight,
  Light,
  LightWithShadow,
  PointLight,
  SpotLight,
} from "@core/lights"

type Props = {
  gl: WebGLRenderingContext
}

export class Scene {
  private readonly gl: WebGLRenderingContext

  public meshes: Map<Mesh, WebGLMesh> = new Map()
  public lights: Light[] = []
  public shadows: Shadow[] = []
  public dirty: boolean = false

  public get pointLights(): PointLight[] {
    return this.lights.filter(isPointLight)
  }

  public get spotLights(): SpotLight[] {
    return this.lights.filter(isSpotLight)
  }

  public get directionalLights(): DirectionalLight[] {
    return this.lights.filter(isDirectionalLight)
  }

  public get ambientLights(): AmbientLight[] {
    return this.lights.filter(isAmbientLight)
  }

  public get shadowLights(): Array<LightWithShadow> {
    return this.lights.filter(isShadowLight)
  }

  constructor({ gl }: Props) {
    this.gl = gl
  }

  public addMesh(...meshes: Mesh[]): void {
    meshes.forEach((mesh) => {
      this.meshes.set(mesh, new WebGLMesh({ gl: this.gl, mesh }))
    })
  }

  public addLight(...lights: Light[]): void {
    this.dirty = true
    this.lights.push(...lights)
    this.shadows.push(...lights.filter(isShadowLight).map((light) => new Shadow({ gl: this.gl, light })))
  }
}
