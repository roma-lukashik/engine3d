import { Vector3Array, Vector3Tuple } from "@math/vector3"

export class RGB {
  public get elements(): Readonly<Vector3Array> {
    return this.array
  }

  public get r(): number {
    return this.array[0]
  }

  public get g(): number {
    return this.array[1]
  }

  public get b(): number {
    return this.array[2]
  }

  private readonly array: Vector3Array = new Vector3Array()

  public constructor(hex: number)
  public constructor(r: number, g: number, b: number)
  public constructor(...args: [number] | Vector3Tuple) {
    if (args.length === 1) {
      this.array.set(hexToRgb(args[0]))
    } else {
      this.array.set(args)
    }
  }

  public multiply(intensity: number): this {
    this.array[0] *= intensity
    this.array[1] *= intensity
    this.array[2] *= intensity
    return this
  }

  public clone(): RGB {
    return new RGB(this.r, this.g, this.b)
  }

  public set(r: number, g: number, b: number): this {
    this.array[0] = r
    this.array[1] = g
    this.array[2] = b
    return this
  }
}

const MAX_BYTE = 255

const hexToRgb = (hex: number): Vector3Tuple => {
  const r = (hex >> 16 & MAX_BYTE) / MAX_BYTE
  const g = (hex >> 8 & MAX_BYTE) / MAX_BYTE
  const b = (hex & MAX_BYTE) / MAX_BYTE
  return [r, g, b]
}
