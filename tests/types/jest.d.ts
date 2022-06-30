declare global {
  namespace jest {
    interface Matchers<R> {
      toValueEqual<T extends { toArray: () => ArrayLike<number>; }>(expected: T | ArrayLike<number>): R
    }
  }
}

export {}
