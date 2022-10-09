import { AmbientLight, DirectionalLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { Mesh } from "@core/mesh"
import { CameraControl } from "@core/cameraControl"
import { parseGltf } from "@core/loaders/gltf"
import { Object3d } from "@core/object3d"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"

const camera = new PerspectiveCamera({
  aspect: window.innerWidth / window.innerHeight,
  fovy: toRadian(60),
  far: 8000,
})

new CameraControl({ camera })

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

const followObject = (object: Object3d): void => {
  camera.setPosition(object.worldMatrix.translationVector().add(new Vector3(0, 300, 400)))
  camera.lookAt(object.worldMatrix.translationVector().add(new Vector3(0, 150, 0)))
}

type HeroAnimations =
  | "Idle"
  | "Run"
  | "TPose"
  | "Walk"

const loadModel = async <T extends string>(url: string) => parseGltf<T>(await (await fetch(url)).arrayBuffer())

const hero = await loadModel<HeroAnimations>("models/soldier.glb")
const surface = await loadModel("models/surface.glb")
const box = await loadModel("models/box.glb")
const box2 = await loadModel("models/box.glb")
const box3 = await loadModel("models/box.glb")

scene.addMesh(surface.node)
scene.addMesh(box.node)
scene.addMesh(box2.node)
scene.addMesh(box3.node)
scene.addMesh(hero.node)

surface.node.updateWorldMatrix(Matrix4.scaling(100, 100, 100).translate(0, -0.1, 0))
box.node.updateWorldMatrix(Matrix4.scaling(100, 100, 100).translate(3, 1, -3))
box2.node.updateWorldMatrix(Matrix4.scaling(100, 200, 100).translate(-3, 1, -3))
box3.node.updateWorldMatrix(Matrix4.scaling(50, 50, 50).translate(4, 5, -8))
hero.node.localMatrix = Matrix4.scaling(100, 100, 100)
hero.node.updateWorldMatrix()
followObject(hero.node)

let keyPressed = false
let i = 0

const update = () => {
  requestAnimationFrame(update)
  if (keyPressed) {
    hero.node.localMatrix.translate(0, 0, -0.03)
    hero.getAnimation("Walk").update(i += 0.02)
    hero.node.traverse((node) => {
      if (node instanceof Mesh) {
        node.updateSkeleton()
      }
    })
    hero.node.updateWorldMatrix()
    followObject(hero.node)
  } else {
    hero.node.updateWorldMatrix()
  }
  renderer.render(scene, camera)
}

requestAnimationFrame(update)

document.body.appendChild(gl.canvas)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})

window.addEventListener("keypress", (e) => {
  e.preventDefault()
  if (e.key.toLowerCase() === "w") {
    keyPressed = true
    // astronaut.localMatrix.translate(0, 0, step)
  }
  if (e.key.toLowerCase() === "s") {
    keyPressed = true
  }
  if (e.key.toLowerCase() === "a") {
    hero.node.localMatrix.rotateY(-0.3)
  }
  if (e.key.toLowerCase() === "d") {
    hero.node.localMatrix.rotateY(0.3)
  }
})

window.addEventListener("keyup", () => keyPressed = false)
