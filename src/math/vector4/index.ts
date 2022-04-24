export type Vector4 = [number, number, number, number]

export const vector4 = (x: number, y: number, z: number, w: number): Vector4 => [x, y, z, w]

export const zero = () => vector4(0, 0, 0, 0)

export const one = () => vector4(1, 1, 1, 1)
