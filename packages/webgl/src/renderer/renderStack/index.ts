import { Scene } from "@webgl/scene"
import { Matrix4 } from "@math/matrix4"
import { Frustum } from "@geometry/frustum"
import { Object3D } from "@core/object3d"

type CameraLike = {
  projectionMatrix: Matrix4
}

export const getRenderStack = (scene: Scene, camera: CameraLike): Object3D[] => {
  const frustum = Frustum.fromProjectionMatrix(camera.projectionMatrix)
  const renderStack: Object3D[] = []
  scene.objects.forEach((object) => {
    if (!object.frustumCulled || frustum.intersectAABB(object.aabb)) {
      renderStack.push(object)
    }
  })
  return renderStack
}
