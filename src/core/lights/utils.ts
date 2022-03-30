import { Light, LightType, LightWithShadow } from './types'
import { PointLight } from './point'
import { AmbientLight } from './ambient'
import { DirectionalLight } from './directional'

export const isShadowLight = (light: Light): light is Light & LightWithShadow => light.castShadow

export const isPointLight = (light: Light): light is PointLight => light.type === LightType.Point

export const isAmbientLight = (light: Light): light is AmbientLight => light.type === LightType.Ambient

export const isDirectionalLight = (light: Light): light is DirectionalLight => light.type === LightType.Directional
