import { eq } from '../../src/math/operators'

export const toPrettyEqual: jest.CustomMatcher = <T extends number | number[]>(received: T, expected: T) => {
  const equal = Array.isArray(received)
    ? received.every((x, i) => eq(x, (expected as number[])[i]))
    : eq(received, expected as number)
  return equal ? positive(received, expected) : negative(received, expected)
}

const positive = <T extends number | number[]>(received: T, expected: T): jest.CustomMatcherResult => ({
  pass: true,
  message: () => `Expected (${received}) to be equal to (${expected})`,
})

const negative = <T extends number | number[]>(received: T, expected: T): jest.CustomMatcherResult => ({
  pass: false,
  message: () => `Expected (${received}) to not be equal to (${expected})`,
})
