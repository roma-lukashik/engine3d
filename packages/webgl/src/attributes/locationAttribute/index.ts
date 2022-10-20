export class LocationAttribute<Name extends string> {
  public location: number
  public type: number
  public name: Name

  public constructor(
    location: number,
    type: number,
    name: Name,
  ) {
    this.location = location
    this.type = type
    this.name = name
  }
}
