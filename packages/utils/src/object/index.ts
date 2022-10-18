export const forEachKey = <T extends Record<string, any>>(
  obj: T,
  fn: (key: keyof T, value: NonNullable<T[keyof T]>, obj: T) => void,
): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      fn(key, value, obj)
    }
  })
}

export const mapObject = <T extends object, V>(
  obj: T,
  fn: (value: NonNullable<T[keyof T]>, key: keyof T, obj: T) => V,
): Record<keyof T, V> => {
  const res = {} as Record<keyof T, V>
  forEachKey(obj, (key, value, obj) => res[key] = fn(value, key, obj))
  return res
}
