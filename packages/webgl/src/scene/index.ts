import { WebGLMesh } from "@webgl/mesh"
import { Mesh } from "@core/mesh"
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
    this.lights.push(...lights)
  }
}
