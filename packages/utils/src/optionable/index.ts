export type Option<T> = T | undefined

export const mapOption = <T, K>(array: Option<T[]>, fn: (x: T, i: number, arr: T[]) => Option<K>): K[] =>
  array?.reduce((acc, item, i, arr) => {
    const x = fn(item, i, arr)
    if (x !== undefined) acc.push(x)
    return acc
  }, [] as K[]) ?? []

export const mapOptionAsync = async <T, K>(
  array: Option<T[]>,
  fn: (x: T, i: number, arr: T[]) => Promise<Option<K>>,
): Promise<K[]> => {
  const promises = await Promise.all(array?.map((item, i, arr) => fn(item, i, arr)) ?? [])
  return promises.filter((item): item is Awaited<K> => !!item)
}

export const nthOption = <T>(array: Option<T[]>, index: Option<number>): Option<T> =>
  index !== undefined ? array?.[index] : undefined
