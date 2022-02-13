declare global {
  namespace jest {
    interface Matchers<R> {
      toPrettyEqual<T extends number | number[]>(expected: T): R
    }
  }
}

export {}
