import { diff } from "jest-diff"
import { matcherHint } from "jest-matcher-utils"

export const toCloseEqual: jest.CustomMatcher = <T extends number | number[]>(
  received: T,
  expected: T,
  precision = 3,
) => {
  const eps = Math.pow(1, -precision)
  const pass = Array.isArray(received)
    ? received.every((x, i) => eq(x, (expected as number[])[i], eps))
    : eq(received, expected as number, eps)

  return {
    pass,
    message: () => {
      const name = pass ? "not.toCloseEqual" : "toCloseEqual"
      const diffString = diff(print(received, precision), print(expected, precision), { includeChangeCounts: true })
      return matcherHint(`.${name}`) + "\n\n" + diffString
    }
  }
}

const eq = (a: number, b: number, eps: number): boolean => Math.abs(a - b) < eps

const print = (value: number | number[], precision: number) =>
  Array.isArray(value) ? value.map((x) => precise(x, precision)) : precise(value, precision)

const precise = (value: number, precision: number) => Number(value.toFixed(precision))
