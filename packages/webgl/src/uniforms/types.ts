export type Uniform<T> = {
  readonly name: string
  setValue(value: T): void
}

export type UniformSetter = (location: WebGLUniformLocation, value: any) => void
