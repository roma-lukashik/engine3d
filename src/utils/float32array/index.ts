export const array32flatten = (array: Float32Array[] | Float32Array): Float32Array | number => {
  if (typeof array[0] === 'number') {
    return array as Float32Array
  }
  const valueLength = array[0].length
  const length = array.length * valueLength
  const value = new Float32Array(length)
  for (let i = 0; i < array.length; i++) {
    value.set(array[i] as Float32Array, i * valueLength)
  }
  return value
}
