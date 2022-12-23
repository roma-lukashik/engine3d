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
import { Object3D, RenderObject } from "@core/object3d"
import { Camera } from "@core/camera"
import { Frustum } from "@geometry/frustum"

export class Scene {
  public readonly objects: Set<Object3D> = new Set()
  public readonly ambientLights: AmbientLight[] = []
  public readonly directionalLights: DirectionalLight[] = []
  public readonly directionalShadowLights: DirectionalLight[] = []
  public readonly spotLights: SpotLight[] = []
  public readonly spotShadowLights: SpotLight[] = []
  public readonly shadowLights: LightWithShadow[] = []
  public camera: Camera

  public addObject(object: Object3D): void {
    this.objects.add(object)
  }

  public addCamera(camera: Camera): void {
    this.camera = camera
  }

  public getRenderStack(): RenderObject[] {
    const frustum = Frustum.fromProjectionMatrix(this.camera.projectionMatrix)
    const renderStack: RenderObject[] = []
    this.objects.forEach((object) => {
      if (!object.frustumCulled || frustum.intersectAABB(object.aabb)) {
        renderStack.push(object)
      }
    })
    return renderStack
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
    })
  }
}
