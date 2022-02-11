import { Vector2 } from './src/vector2'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualVector(expected: Vector2): R
      toEqualScalar(expected: number): R
    }
  }
}

export {}
