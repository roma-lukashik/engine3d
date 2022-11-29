export class KeyboardManager {
  private readonly pressedKeys: Set<string> = new Set()
  private readonly keyPressListeners: Map<string, () => void> = new Map()

  public constructor() {
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
  }

  public registerKeyPres(keyCode: string, listener: () => void): void {
    this.keyPressListeners.set(keyCode, listener)
  }

  public removeKeyPressListener(keyCode: string): void {
    this.keyPressListeners.delete(keyCode)
  }

  public isPressed(key: string): boolean {
    return this.pressedKeys.has(key)
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    this.pressedKeys.add(event.code)
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.code)
    this.keyPressListeners.get(event.code)?.()
  }
}
