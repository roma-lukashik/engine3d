import { MeshPrimitiveAttributes } from '../../types'
import { BufferAttribute } from '../bufferAttribute'

export class Geometry {
  public position?: BufferAttribute
  public normal?: BufferAttribute
  public tangent?: BufferAttribute
  public uv?: BufferAttribute
  public uv2?: BufferAttribute
  public color?: BufferAttribute
  public skinWeight?: BufferAttribute
  public skinIndex?: BufferAttribute
  public index?: BufferAttribute

  public setAttribute(key: keyof MeshPrimitiveAttributes, value?: BufferAttribute): void {
    this[ATTRIBUTES[key]] = value
  }

  public setIndices(indices?: BufferAttribute): void {
    this.index = indices
  }
}

const ATTRIBUTES: Record<
  keyof MeshPrimitiveAttributes,
  keyof Pick<Geometry, 'position' | 'normal' | 'tangent' | 'uv' | 'uv2' | 'color' | 'skinWeight' | 'skinIndex'>
> = {
  POSITION: 'position',
  NORMAL: 'normal',
  TANGENT: 'tangent',
  TEXCOORD_0: 'uv',
  TEXCOORD_1: 'uv2',
  COLOR_0: 'color',
  WEIGHTS_0: 'skinWeight',
  JOINTS_0: 'skinIndex',
}
