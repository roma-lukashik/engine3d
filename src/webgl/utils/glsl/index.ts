export const USE_AMBIENT_LIGHT = 'USE_AMBIENT_LIGHT'
export const USE_POINT_LIGHT = 'USE_POINT_LIGHT'
export const USE_SPOT_LIGHT = 'USE_SPOT_LIGHT'
export const USE_DIRECTIONAL_LIGHT = 'USE_DIRECTIONAL_LIGHT'
export const USE_SHADOW = 'USE_SHADOW'

export const AMBIENT_LIGHTS_AMOUNT = 'AMBIENT_LIGHTS_AMOUNT'
export const POINT_LIGHTS_AMOUNT = 'POINT_LIGHTS_AMOUNT'
export const SPOT_LIGHTS_AMOUNT = 'SPOT_LIGHTS_AMOUNT'
export const DIRECTIONAL_LIGHTS_AMOUNT = 'DIRECTIONAL_LIGHTS_AMOUNT'
export const SHADOWS_AMOUNT = 'SHADOWS_AMOUNT'

export const define = (expression: string): string => `#define ${expression}`

export const ifdef = (expression: string, body: string): string => `
  #ifdef ${expression}
    ${body}
  #endif
`

export const replaceValue = (shader: string, searchValue: string, replaceValue: number): string =>
  shader.replace(new RegExp(searchValue, 'g'), replaceValue.toString())
