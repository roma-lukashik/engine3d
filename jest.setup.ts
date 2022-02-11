import 'jest-canvas-mock'
import { toEqualVector, toEqualScalar } from './tests/matchers'

expect.extend({
  toEqualVector,
  toEqualScalar,
})
