import { equal, Vector2 } from '../../src/math/vector2'

export const toEqualVector: jest.CustomMatcher = (received: Vector2, expected: Vector2) =>
  equal(received, expected) ? positive(received, expected) : negative(received, expected)

const positive = (received: Vector2, expected: Vector2): jest.CustomMatcherResult => ({
  pass: true,
  message: () => `Expected (${received}) to be equal to (${expected})`,
})

const negative = (received: Vector2, expected: Vector2): jest.CustomMatcherResult => ({
  pass: false,
  message: () => `Expected (${received}) to be equal to (${expected})`,
})
