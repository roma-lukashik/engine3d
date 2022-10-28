import {
  AmbientLight,
  DirectionalLight,
  isAmbientLight,
  isDirectionalLight,
  isSpotLight,
  Light,
  LightWithShadow,
  SpotLight,
} from "@core/lights"
import { Object3D } from "@core/object3d"

export class Scene {
  public readonly objects: Set<Object3D> = new Set()
  public readonly lights: Light[] = []
  public readonly ambientLights: AmbientLight[] = []
  public readonly directionalLights: DirectionalLight[] = []
  public readonly directionalShadowLights: DirectionalLight[] = []
  public readonly spotLights: SpotLight[] = []
  public readonly spotShadowLights: SpotLight[] = []
  public readonly shadowLights: LightWithShadow[] = []

  public addObject(object: Object3D): void {
    this.objects.add(object)
  }

  public addLight(...lights: Light[]): void {
    lights.forEach((light) => {
      if (isDirectionalLight(light)) {
        if (light.castShadow) {
          this.directionalShadowLights.push(light)
          this.shadowLights.push(light)
        } else {
          this.directionalLights.push(light)
        }
      }

      if (isSpotLight(light)) {
        if (light.castShadow) {
          this.spotShadowLights.push(light)
          this.shadowLights.push(light)
        } else {
          this.spotLights.push(light)
        }
      }

      if (isAmbientLight(light)) {
        this.ambientLights.push(light)
      }

      this.lights.push(light)
    })
  }
}
