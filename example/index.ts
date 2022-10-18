import { AmbientLight, DirectionalLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { CameraControl } from "@core/cameraControl"
import { parseGltf } from "@core/loaders/gltf"
import { Object3d } from "@core/object3d"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Gltf } from "@core/gltf"

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
const scene = new Scene()
scene.addLight(
  directionalLight,
  directionalLight2,
  ambientLight,
)

const followObject = (object: Object3d): void => {
  const objectPosition = object.getWorldPosition()
  const objectRotation = object.getWorldRotation()
  const from = new Vector3(0, 300, 400)
  const up = new Vector3(0, 150, 0)
  camera.setPosition(from.rotateByQuaternion(objectRotation).add(objectPosition))
  camera.lookAt(up.add(objectPosition))
}

const move = (object: Gltf, translationVector: Vector3, colliders: Gltf[] = []) => {
  const collide = colliders.some((collider) => collider.aabb.collide(object.aabb))
  if (!collide) {
    object.node.localMatrix.translate(translationVector.x, translationVector.y, translationVector.z)
  }
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

scene.addObject(surface)
scene.addObject(box)
scene.addObject(box2)
scene.addObject(box3)
scene.addObject(hero)

surface.updateWorldMatrix(Matrix4.scaling(100, 100, 100).translate(0, -0.1, 0))
box.updateWorldMatrix(Matrix4.scaling(150, 200, 150).translate(3, 1, -3))
box2.updateWorldMatrix(Matrix4.scaling(150, 200, 150).translate(-3, 1, -3))
box3.updateWorldMatrix(Matrix4.scaling(150, 200, 150).translate(3, 1, 3))

hero.node.localMatrix = Matrix4.scaling(100, 100, 100)
hero.updateWorldMatrix()
followObject(hero.node)

let wPressed = false
let sPressed = false
let aPressed = false
let dPressed = false
let shiftPressed = false
let i = 0

const update = () => {
  if (wPressed || sPressed) {
    hero.animate(shiftPressed ? "Run" : "Walk", i += 0.02)
    followObject(hero.node)
  } else {
    hero.node.updateWorldMatrix()
  }

  const step = 0.03
  if (wPressed) move(hero, new Vector3(0, 0, (shiftPressed ? 3 : 1) * -step), [box, box2, box3])
  if (sPressed) move(hero, new Vector3(0, 0, (shiftPressed ? 3 : 1) * step), [box, box2, box3])
  if (aPressed) hero.node.localMatrix.rotateY(-0.03)
  if (dPressed) hero.node.localMatrix.rotateY(0.03)

  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

requestAnimationFrame(update)

document.body.appendChild(renderer.gl.canvas)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})

window.addEventListener("keypress", (e) => {
  e.preventDefault()
  if (e.key.toLowerCase() === "w") {
    wPressed = true
  }
  if (e.key.toLowerCase() === "s") {
    sPressed = true
  }
  if (e.key.toLowerCase() === "a") {
    aPressed = true
  }
  if (e.key.toLowerCase() === "d") {
    dPressed = true
  }
  if (e.shiftKey) {
    shiftPressed = true
  }
})

window.addEventListener("keyup", (e) => {
  e.preventDefault()
  if (e.key.toLowerCase() === "w") {
    wPressed = false
  }
  if (e.key.toLowerCase() === "s") {
    sPressed = false
  }
  if (e.key.toLowerCase() === "a") {
    aPressed = false
  }
  if (e.key.toLowerCase() === "d") {
    dPressed = false
  }
  if (!e.shiftKey) {
    shiftPressed = false
  }
})
