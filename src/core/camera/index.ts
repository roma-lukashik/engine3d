import * as matrix4 from '../../math/matrix4'

type CameraProps = {
  gl: WebGL2RenderingContext;
  zoom?: number;
}

type Matrix4 = matrix4.Matrix4

export type Camera = {
  projectionMatrix: () => Matrix4;
  projectionViewMatrix: () => Matrix4;
  rotateY: (deg: number) => void;
}

export const createCamera = ({
  // gl,
  // zoom = 1,
}: CameraProps): Camera => {
  let projectionMatrix = matrix4.identity() // perspective(45 * (Math.PI / 180), 1, 0.1, 5)
  let projectionViewMatrix = matrix4.identity()

  return {
    projectionMatrix: () => projectionMatrix,
    projectionViewMatrix: () => projectionViewMatrix,
    rotateY: (deg) => {
      projectionViewMatrix = matrix4.rotateY(matrix4.identity(), deg * Math.PI / 180)
    },
  }
}
//
// const perspective = (fovy: number, aspect: number, near: number, far: number): Matrix4 => {
//   const yScale = 1 / Math.tan(fovy / 2)
//   const xScale =  yScale / aspect
//   const nearmfar = near - far
//   return [
//     xScale, 0, 0, 0,
//     0, yScale,  0, 0,
//     0, 0, (far + near) / nearmfar, -1,
//     0, 0, 2 * far * near / nearmfar, 0,
//   ]
// }
