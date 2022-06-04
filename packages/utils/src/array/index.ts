export const times = (n: number, fn: (x: number) => void): void => {
  for (let i = 0; i < n; i++) {
    fn(i)
  }
}

export const timesMap = <T>(n: number, fn: (x: number) => T): T[] => {
  const array = new Array(n)
  times(n, (i) => array[i] = fn(i))
  return array
}

export const range = (from: number, to: number): number[] => timesMap(to - from, (i) => from + i)
