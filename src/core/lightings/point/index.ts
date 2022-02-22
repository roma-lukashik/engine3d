import { Vector3, zero } from '../../../math/vector3'

export type Lighting = {
  position: Vector3;
  target: Vector3;
  lookAt: (target: Vector3) => void;
}

type LightingOptions = {
  position?: Vector3;
  target?: Vector3;
}

export const createLighting = ({
  position = zero(),
  target = zero(),
}: LightingOptions): Lighting => {
  return new PointLighting({ position, target })
}

class PointLighting implements Lighting {
  public position: Vector3
  public target: Vector3

  constructor(options: LightingOptions) {
    Object.assign(this, options)
  }

  lookAt(target: Vector3): void {
    this.target = target
  }
}
