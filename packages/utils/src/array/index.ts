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

export const forEachPair = <T>(arr: T[], fn: (current: T, next: T) => void): void => {
  if (arr.length > 1) {
    times(arr.length - 1, (i) => fn(arr[i], arr[i + 1]))
    fn(arr[arr.length - 1], arr[0])
  }
}
