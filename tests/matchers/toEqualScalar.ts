import { eq } from '../../src/math/operators'

export const toEqualScalar: jest.CustomMatcher = (received: number, expected: number) =>
  eq(received, expected) ? positive(received, expected) : negative(received, expected)

const positive = (received: number, expected: number): jest.CustomMatcherResult => ({
  pass: true,
  message: () => `Expected (${received}) to be equal to (${expected})`,
})

const negative = (received: number, expected: number): jest.CustomMatcherResult => ({
  pass: false,
  message: () => `Expected (${received}) to be equal to (${expected})`,
})
