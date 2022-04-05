// Creates a range including start and end.
export const range = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, i) => from + i)
