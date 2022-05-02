export enum TextureType {
  Image,
  Color,
  Depth,
}

export type Texture = {
  type: TextureType;
}
