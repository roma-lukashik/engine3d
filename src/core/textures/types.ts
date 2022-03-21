export enum TextureType {
  Image,
  Pixel,
  Depth,
}

export type Texture = {
  type: TextureType;
}
