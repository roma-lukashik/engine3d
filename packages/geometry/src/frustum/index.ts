import { Plane } from "@geometry/plane"
import { Matrix4 } from "@math/matrix4"
import { Sphere } from "@geometry/bbox/sphere"
import { gte } from "@math/operators"

export class Frustum {
  private readonly planes: [
    left: Plane,
    right: Plane,
    bottom: Plane,
    top: Plane,
    near: Plane,
    far: Plane,
  ]

  public get left(): Plane {
    return this.planes[0]
  }

  public get right(): Plane {
    return this.planes[1]
  }

  public get bottom(): Plane {
    return this.planes[2]
  }

  public get top(): Plane {
    return this.planes[3]
  }

  public get near(): Plane {
    return this.planes[4]
  }

  public get far(): Plane {
    return this.planes[5]
  }

  public constructor(left: Plane, right: Plane, bottom: Plane, top: Plane, near: Plane, far: Plane) {
    this.planes = [left, right, bottom, top, near, far]
  }

  public static fromProjectionMatrix(matrix: Matrix4): Frustum {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = matrix.toArray()
    return new Frustum(
      Plane.fromComponents(a03 + a00, a13 + a10, a23 + a20, a33 + a30).normalize(),
      Plane.fromComponents(a03 - a00, a13 - a10, a23 - a20, a33 - a30).normalize(),
      Plane.fromComponents(a03 + a01, a13 + a11, a23 + a21, a33 + a31).normalize(),
      Plane.fromComponents(a03 - a01, a13 - a11, a23 - a21, a33 - a31).normalize(),
      Plane.fromComponents(a03 + a02, a13 + a12, a23 + a22, a33 + a32).normalize(),
      Plane.fromComponents(a03 - a02, a13 - a12, a23 - a22, a33 - a32).normalize(),
    )
  }

  public setFromProjectionMatrix(matrix: Matrix4): this {
    const [
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33,
    ] = matrix.toArray()
    this.left.setComponents(a03 + a00, a13 + a10, a23 + a20, a33 + a30).normalize()
    this.right.setComponents(a03 - a00, a13 - a10, a23 - a20, a33 - a30).normalize()
    this.bottom.setComponents(a03 + a01, a13 + a11, a23 + a21, a33 + a31).normalize()
    this.top.setComponents(a03 - a01, a13 - a11, a23 - a21, a33 - a31).normalize()
    this.near.setComponents(a03 + a02, a13 + a12, a23 + a22, a33 + a32).normalize()
    this.far.setComponents(a03 - a02, a13 - a12, a23 - a22, a33 - a32).normalize()
    return this
  }

  public intersectSphere(sphere: Sphere): boolean {
    return this.planes.every((plane) => gte(plane.distanceToPoint(sphere.center), -sphere.radius))
  }
}
