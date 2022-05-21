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

export const transform = <T extends object, V>(
  obj: T,
  fn: (key: keyof T, value: NonNullable<T[keyof T]>) => V,
): Record<keyof T, V> => {
  const res = {} as Record<keyof T, V>
  forEachKey(obj, (key, value) => res[key] = fn(key, value))
  return res
}
