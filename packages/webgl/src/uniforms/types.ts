export type Uniform<T> = {
  readonly name: string
  setValue(value: T): void
}

export type UniformSetter = (value: any) => void
