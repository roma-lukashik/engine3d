declare global {
  namespace jest {
    interface Matchers<R> {
      toCloseEqual<T extends number | number[]>(expected: T): R
    }
  }
}

export {}
