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
import { Gltf } from "@core/gltf"

type Props = {
  gl: WebGLRenderingContext
}

export class Scene {
  private readonly gl: WebGLRenderingContext

  public meshes: Map<Mesh, WebGLMesh> = new Map()
  public objects: Set<Gltf<any>> = new Set()
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

  public constructor({ gl }: Props) {
    this.gl = gl
  }

  public addMesh(object: Gltf<any>): void {
    this.objects.add(object)
    object.node.traverse((node) => {
      if (node instanceof Mesh) {
        this.meshes.set(node, new WebGLMesh({ gl: this.gl, mesh: node }))
      }
    })
  }

  public addLight(...lights: Light[]): void {
    this.lights.push(...lights)
  }
}
