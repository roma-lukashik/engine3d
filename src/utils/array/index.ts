// Creates a range including start and end.
export const range = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => from + i)

export const mapOption = <T, K>(array: T[] | undefined, fn: (x: T, i: number, arr: T[]) => K | undefined): K[] =>
  (array ?? []).reduce((acc, item, i, arr) => {
    const x = fn(item, i, arr)
    if (x !== undefined) acc.push(x)
    return acc
  }, [] as K[])
