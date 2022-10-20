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
import { Object3D } from "@core/object3d"

export class Scene {
  public objects: Set<Object3D> = new Set()
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

  public get shadowLights(): LightWithShadow[] {
    return this.lights.filter(isShadowLight)
  }

  public addObject(object: Object3D): void {
    this.objects.add(object)
  }

  public addLight(...lights: Light[]): void {
    this.lights.push(...lights)
  }
}
