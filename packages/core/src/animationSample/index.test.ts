import { AnimationSample } from "@core/animationSample"
import { Object3d } from "@core/object3d"
import { AnimationInterpolationType } from "@core/loaders/types"

describe("AnimationSample", () => {
  const node = new Object3d()
  const times = new Float32Array([0, 0.5, 1])
  const values = new Float32Array([
    0, 0, 0,
    1, 1, 1,
    2, 2, 2,
  ])
  const transform = "position"
  const interpolation = AnimationInterpolationType.Linear

  it("to be created", () => {
    const sample = new AnimationSample({ node, times, values, transform, interpolation })
    expect(sample).toMatchObject<AnimationSample>({ node, times, values, transform, interpolation })
  })

  it("uses Linear interpolation by default", () => {
    const sample = new AnimationSample({ node, times, values, transform })
    expect(sample.interpolation).toBe(AnimationInterpolationType.Linear)
  })
})
