import { Animation } from "@core/animation"
import { Node } from "@core/node"
import { AnimationSample } from "@core/animationSample"

describe("Animation", () => {
  let animation: Animation
  let node1: Node
  let node2: Node

  beforeEach(() => {
    node1 = new Node()
    node2 = new Node()

    const sample1 = new AnimationSample({
      node: node1,
      times: new Float32Array([0.0, 0.25, 0.5, 0.75, 1.0]),
      values: new Float32Array([
        0.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 0.707, 0.707,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.707, -0.707,
        0.0, 0.0, 0.0, 1.0,
      ]),
      transform: "rotation",
    })

    const sample2 = new AnimationSample({
      node: node2,
      times: new Float32Array([0.2, 0.4, 0.6, 0.8, 1.0, 1.2]),
      values: new Float32Array([
        0.0, 0.0, 0.0,
        0.2, 0.5, 1.0,
        0.4, 1.0, 2.0,
        0.6, 1.5, 3.0,
        0.8, 2.0, 4.0,
        1.0, 2.5, 5.0,
      ]),
      transform: "position",
    })

    const sample3 = new AnimationSample({
      node: node1,
      times: new Float32Array([0.5, 1.0]),
      values: new Float32Array([
        2.0, 1.0, 1.0,
        2.0, 2.0, 1.0,
      ]),
      transform: "scale",
    })

    animation = new Animation("Test", [sample1, sample2, sample3])
  })

  it("to be created", () => {
    expect(animation).toBeDefined()
  })

  it("updates nodes for t=0", () => {
    animation.update(0)
    expect(node1.localMatrix).toValueEqual([
      2, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(node2.localMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -0.2, -0.5, -1, 1,
    ])
  })

  it("updates nodes for t=0.2", () => {
    animation.update(0.2)
    expect(node1.localMatrix).toValueEqual([
      0.618, 1.902, 0, 0,
      -0.380, 0.123, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(node2.localMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  })

  it("updates nodes for t=0.5", () => {
    animation.update(0.5)
    expect(node1.localMatrix).toValueEqual([
      -2, 0, 0, 0,
      0, -1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(node2.localMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0.3, 0.75, 1.5, 1,
    ])
  })

  it("updates nodes for t=0.8", () => {
    animation.update(0.8)
    expect(node1.localMatrix).toValueEqual([
      0.618, -1.902, 0, 0,
      1.521, 0.495, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(node2.localMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0.6, 1.5, 3, 1,
    ])
  })

  it("updates nodes for t=1", () => {
    animation.update(1)
    expect(node1.localMatrix).toValueEqual([
      2, 0.002, 0, 0,
      -0.002, 2, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
    expect(node2.localMatrix).toValueEqual([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0.8, 2, 4, 1,
    ])
  })
})
