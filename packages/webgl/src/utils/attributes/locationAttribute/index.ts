export class LocationAttribute<Name extends string> {
  public buffer: WebGLBuffer | null
  public location: number
  public type: number
  public name: Name

  public constructor(
    gl: WebGLRenderingContext,
    location: number,
    type: number,
    name: Name,
  ) {
    this.buffer = gl.createBuffer()
    this.location = location
    this.type = type
    this.name = name
  }
}
