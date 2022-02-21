export type Model = {
  position: CoordinatesData;
  normal: CoordinatesData;
  uv: CoordinatesData;
}

type CoordinatesData = {
  size: number;
  data: Float32Array;
}
