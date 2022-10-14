import { diff } from "jest-diff"
import { matcherHint } from "jest-matcher-utils"

type Value = {
  elements: ArrayLike<number>
}

export const toValueEqual: jest.CustomMatcher = <T extends Value>(
  received: T | ArrayLike<number>,
  expected: T | ArrayLike<number>,
  precision = 3,
) => {
  const eps = Math.pow(10, -precision)
  const receivedArray = "elements" in received ? received.elements : received
  const expectedArray = "elements" in expected ? expected.elements : expected
  const pass = expectedArray.length === receivedArray.length
    && every(expectedArray, (x, i) => eq(x, receivedArray[i], eps))

  return {
    pass,
    message: () => {
      const name = pass ? "not.toValueEqual" : "toValueEqual"
      const diffString = diff(
        print(receivedArray, precision),
        print(expectedArray, precision),
        {
          includeChangeCounts: true,
        },
      )
      return matcherHint(`.${name}`) + "\n\n" + diffString
    },
  }
}

const eq = (a: number, b: number, eps: number): boolean => Math.abs(a - b) < eps

const print = (value: number | ArrayLike<number>, precision: number) => {
  if (typeof value === "number") {
    return precise(value, precision)
  }
  return map(value, (x) => precise(x, precision))
}

const map = <T>(arr: ArrayLike<number>, fn: (x: number, i: number) => T): T[] => {
  const mapResult: T[] = []
  for (let i = 0; i < arr.length; i++) {
    mapResult.push(fn(arr[i], i))
  }
  return mapResult
}

const every = (arr: ArrayLike<number>, fn: (x: number, i: number) => boolean): boolean => {
  for (let i = 0; i < arr.length; i++) {
    if (!fn(arr[i], i)) return false
  }
  return true
}

const precise = (value: number, precision: number) => Number(value.toFixed(precision))
