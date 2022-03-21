export const hex2rgb = (hex: number): [number, number, number] => {
  const r = hex >> 16 & 255
  const g = hex >> 8 & 255
  const b = hex & 255
  return [r, g, b]
}
