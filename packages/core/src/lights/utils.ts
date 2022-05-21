import { Light, LightType, LightWithShadow } from "@core/lights/types"
import { PointLight } from "@core/lights/point"
import { AmbientLight } from "@core/lights/ambient"
import { DirectionalLight } from "@core/lights/directional"
import { SpotLight } from "@core/lights/spot"

export const isShadowLight = (light: Light): light is LightWithShadow => light.castShadow

export const isPointLight = (light: Light): light is PointLight => light.type === LightType.Point

export const isSpotLight = (light: Light): light is SpotLight => light.type === LightType.SpotLight

export const isAmbientLight = (light: Light): light is AmbientLight => light.type === LightType.Ambient

export const isDirectionalLight = (light: Light): light is DirectionalLight => light.type === LightType.Directional
