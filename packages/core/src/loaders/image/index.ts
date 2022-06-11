export const loadImage = async (buffer: ArrayBuffer, mimeType?: string): Promise<HTMLImageElement> => {
  const blob = new Blob([buffer], { type: mimeType })
  const src = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.addEventListener("load", () => {
      URL.revokeObjectURL(src)
      resolve(img)
    })

    img.addEventListener("error", () => {
      reject(new Error("Cannot load a texture."))
    })

    img.src = src
  })
}
