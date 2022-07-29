import { AmbientLight, DirectionalLight, SpotLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { Mesh } from "@core/mesh"
import { CameraControl } from "@core/cameraControl"
import { parseGltf } from "@core/loaders/gltf"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

const camera = new PerspectiveCamera({
  aspect: window.innerWidth / window.innerHeight,
  fovy: toRadian(90),
  far: 8000,
})
camera.setPosition(new Vector3(150, 1800, 1300))
// camera.lookAt(v3.vector3(50, 500, 800))

new CameraControl({ camera })

const spotLight = new SpotLight({
  intensity: 0.3,
  penumbra: 0.5,
  distance: 2000,
  angle: Math.PI / 6,
  castShadow: true,
})
spotLight.setPosition(new Vector3(1000, 1000, 500))

const directionalLight = new DirectionalLight({
  intensity: 0.4,
  castShadow: true,
  bias: 0.002,
})
directionalLight.setPosition(new Vector3(500, 500, 500))

const directionalLight2 = new DirectionalLight({
  intensity: 0.7,
  castShadow: true,
  bias: 0.002,
})
directionalLight2.setPosition(new Vector3(-500, 500, 500))

const ambientLight = new AmbientLight({
  intensity: 0.2,
})

const renderer = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
})
const gl = renderer.gl
const scene = new Scene({ gl })
scene.addLight(
  directionalLight,
  directionalLight2,
  // spotLight,
  ambientLight,
)

const loadModel = async (url: string) => parseGltf(await (await fetch(url)).arrayBuffer())

const { scene: astronaut, animations } = await loadModel("models/astronaut.glb")
const { scene: surface } = await loadModel("models/surface.glb")

scene.addMesh(surface)
scene.addMesh(astronaut)

surface.updateWorldMatrix(Matrix4.translation(0, -3907.5, 0))
astronaut.localMatrix = Matrix4.scaling(100, 100, 100)

let i = 0

const update = (_t: DOMHighResTimeStamp) => {
  requestAnimationFrame(update)
  animations[22].update(i += 0.02)
  astronaut.updateWorldMatrix()
  astronaut.traverse((node) => {
    if (node instanceof Mesh) {
      node.updateSkeleton()
    }
  })
  renderer.render(scene, camera)
}

requestAnimationFrame(update)

document.body.appendChild(gl.canvas)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})
