import { Vector3, Vector4 } from "@math/types"
import { hexToRgb } from "@utils/color"

export class Color {
  public rgb: Vector3
  public rgba: Vector4

  constructor(hex: number, opacity = 1) {
    this.rgb = hexToRgb(hex)
    this.rgba = [...this.rgb, opacity]
  }
}
