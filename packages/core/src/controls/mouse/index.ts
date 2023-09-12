import { Vector2 } from "@math/vector2"

type Props = {
  element: Element
  speed?: number
}

export class MouseControl {
  private readonly element: Element
  private readonly speed: number

  public constructor({
    element,
    speed = 1,
  }: Props) {
    this.element = element
    this.speed = speed
    this.element.requestPointerLock()
  }

  public subscribeOnMouseMove(fn: (delta: Vector2) => void): () => void {
    const eventHandler = (event: MouseEvent) => fn(this.getMovementVector(event))
    this.element.addEventListener("mousemove", eventHandler)
    return () => this.element.removeEventListener("mousemove", eventHandler)
  }

  public subscribeOnMouseWheel(fn: (delta: number) => void): () => void {
    const eventHandler = (event: WheelEvent) => fn(this.getWheelDelta(event))
    this.element.addEventListener("wheel", eventHandler, { passive: false })
    return () => this.element.removeEventListener("wheel", eventHandler)
  }

  private getMovementVector (event: MouseEvent): Vector2 {
    const movement = new Vector2(event.movementX, event.movementY).multiplyScalar(this.speed)
    const { width, height } = this.getElementSize()
    return new Vector2(movement.x / width, movement.y / height)
  }

  private getWheelDelta(event: WheelEvent): number {
    event.preventDefault()
    return event.deltaY
  }

  private getElementSize(): { width: number; height: number; } {
    return { width: this.element.clientWidth, height: this.element.clientHeight }
  }
}
