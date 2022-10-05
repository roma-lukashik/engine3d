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
  fovy: toRadian(45),
  far: 8000,
})
camera.setPosition(new Vector3(150, 1800, 1300))
// camera.lookAt(v3.vector3(50, 500, 800))

new CameraControl({ camera })

const spotLight = new SpotLight({
  intensity: 0.6,
  penumbra: 0.5,
  distance: 2000,
  angle: Math.PI / 6,
  castShadow: true,
})
spotLight.setPosition(new Vector3(1000, 1000, 500))

const directionalLight = new DirectionalLight({
  intensity: 0.8,
  castShadow: true,
  bias: 0.002,
})
directionalLight.setPosition(new Vector3(500, 500, 500))

const directionalLight2 = new DirectionalLight({
  intensity: 0.7,
  castShadow: true,
  bias: 0.001,
})
directionalLight2.setPosition(new Vector3(-500, 1500, 500))

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
  ambientLight,
)

type AstronautAnimations =
  | "CharacterArmature|Death"
  | "CharacterArmature|Gun_Shoot"
  | "CharacterArmature|HitRecieve"
  | "CharacterArmature|HitRecieve_2"
  | "CharacterArmature|Idle"
  | "CharacterArmature|Idle_Gun"
  | "CharacterArmature|Idle_Gun_Pointing"
  | "CharacterArmature|Idle_Neutral"
  | "CharacterArmature|Idle_Sword"
  | "CharacterArmature|Interact"
  | "CharacterArmature|Kick_Left"
  | "CharacterArmature|Kick_Right"
  | "CharacterArmature|Punch_Left"
  | "CharacterArmature|Punch_Right"
  | "CharacterArmature|Roll"
  | "CharacterArmature|Run"
  | "CharacterArmature|Run_Back"
  | "CharacterArmature|Run_Left"
  | "CharacterArmature|Run_Right"
  | "CharacterArmature|Run_Shoot"
  | "CharacterArmature|Sword_Slash"
  | "CharacterArmature|Walk"
  | "CharacterArmature|Wave"

const loadModel = async (url: string) => parseGltf<AstronautAnimations>(await (await fetch(url)).arrayBuffer())

const astronaut = await loadModel("models/astronaut.glb")
const surface = await loadModel("models/surface.glb")
const box = await loadModel("models/box.glb")
const hh = await loadModel("models/hh.glb")

console.log(hh)

scene.addMesh(surface.node)
scene.addMesh(box.node)
scene.addMesh(astronaut.node)

surface.node.updateWorldMatrix(Matrix4.scaling(100, 100, 100).translate(0, -0.1, 0))
box.node.updateWorldMatrix(Matrix4.scaling(100, 100, 100).translate(3, 1, -3))
astronaut.node.localMatrix = Matrix4.scaling(100, 100, 100)

let keyPressed = false

const update = (t: DOMHighResTimeStamp) => {
  requestAnimationFrame(update)
  if (keyPressed) {
    astronaut.node.localMatrix.translate(0, 0, 0.02)
    astronaut.getAnimation("CharacterArmature|Run")?.update(t / 1000)
  }
  astronaut.node.updateWorldMatrix()
  astronaut.node.traverse((node) => {
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

window.addEventListener("keypress", (e) => {
  const step = 0.02
  if (e.key.toLowerCase() === "w") {
    keyPressed = true
    // astronaut.localMatrix.translate(0, 0, step)
  }
  if (e.key.toLowerCase() === "s") {
    keyPressed = true
    astronaut.node.localMatrix.translate(0, 0, -step)
  }
  if (e.key.toLowerCase() === "a") {
    astronaut.node.localMatrix.rotateY(-0.3)
  }
  if (e.key.toLowerCase() === "d") {
    astronaut.node.localMatrix.rotateY(0.3)
  }
})

window.addEventListener("keyup", () => keyPressed = false)
