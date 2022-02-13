import 'jest-canvas-mock'
import { toPrettyEqual } from './tests/matchers'

expect.extend({
  toPrettyEqual,
})
