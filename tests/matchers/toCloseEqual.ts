import { diff } from 'jest-diff'
import { matcherHint } from 'jest-matcher-utils'
import { eq } from '../../src/math/operators'
import { EPS } from '../../src/math/constants'

export const toCloseEqual: jest.CustomMatcher = <T extends number | number[]>(received: T, expected: T) => {
  const pass = Array.isArray(received)
    ? received.every((x, i) => eq(x, (expected as number[])[i]))
    : eq(received, expected as number)

  return {
    pass,
    message: () => {
      const name = pass ? 'not.toCloseEqual' : 'toCloseEqual'
      const diffString = diff(print(received), print(expected), { includeChangeCounts: true })
      return matcherHint(`.${name}`) + '\n\n' + diffString
    }
  }
}

const print = (value: number | number[]) => Array.isArray(value) ? value.map(precise) : precise(value)

const precise = (value: number) => Number(value.toFixed(-Math.log10(EPS)))
