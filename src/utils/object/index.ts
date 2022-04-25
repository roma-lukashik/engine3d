export const forEachKey = <T extends Record<string, any>>(
  obj: T,
  fn: (key: keyof T, value: NonNullable<T[keyof T]>) => void,
): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      fn(key, value)
    }
  })
}
