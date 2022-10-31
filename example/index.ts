import { AmbientLight, DirectionalLight, SpotLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { CameraControl } from "@core/cameraControl"
import { parseGltf } from "@core/loaders/gltf"
import { Node } from "@core/node"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Object3D } from "@core/object3d"

const camera = new PerspectiveCamera({
  aspect: window.innerWidth / window.innerHeight,
  fovy: toRadian(60),
  far: 8000,
})

const directionalLight = new DirectionalLight({
  intensity: 0.8,
  castShadow: true,
  bias: 0.005,
})
directionalLight.setPosition(new Vector3(-500, 800, 500))

const spotLight = new SpotLight({
  intensity: 0.7,
  castShadow: true,
  distance: 1200,
  angle: Math.PI / 8,
  penumbra: 1.0,
  bias: 0.000001,
  color: 0xff0000,
})
spotLight.setPosition(new Vector3(-700, 500, 500))
spotLight.setTarget(new Vector3(-300, 0, 200))

const spotLight2 = new SpotLight({
  intensity: 0.99,
  castShadow: true,
  distance: 1200,
  angle: Math.PI / 8,
  penumbra: 0.5,
  bias: 0.00001,
})

const ambientLight = new AmbientLight({
  intensity: 0.25,
})

const renderer = new Renderer({
  width: window.innerWidth,
  height: window.innerHeight,
})

renderer.gl.canvas.onclick = () => {
  new CameraControl({ camera, element: renderer.gl.canvas, rotationSpeed: 0.7 })
}

const scene = new Scene()
scene.addLight(
  directionalLight,
  spotLight,
  spotLight2,
  ambientLight,
)

const followObject = (node: Node): void => {
  const nodePosition = node.getWorldPosition()
  const nodeRotation = node.getWorldRotation()
  const from = new Vector3(0, 300, 400)
  const up = new Vector3(0, 150, 0)
  camera.setPosition(from.rotateByQuaternion(nodeRotation).add(nodePosition))
  camera.lookAt(up.add(nodePosition))

  spotLight2.setPosition(up.clone().add(new Vector3(0, 0, -35).rotateByQuaternion(nodeRotation)))
  spotLight2.setTarget(new Vector3(0, 40, -250).rotateByQuaternion(nodeRotation).add(nodePosition))
}

const move = (object: Object3D, translationVector: Vector3, colliders: Object3D[] = []) => {
  const collide = colliders.some((collider) => collider.aabb.collide(object.aabb))
  if (!collide) {
    const position = object.node.getWorldPosition()
    const target = camera.target.clone().subtract(camera.position).add(position)
    target.y = position.y
    object.node.localMatrix = Matrix4.lookAt(position, target, new Vector3(0, 1, 0))
      .scale(100, 100, 100)
      .translate(translationVector.x, translationVector.y, translationVector.z)
  }
}

type HeroAnimations =
  | "Idle"
  | "Run"
  | "TPose"
  | "Walk"

const loadModel = async <T extends string>(url: string) => {
  const gltf = await parseGltf<T>(await (await fetch(url)).arrayBuffer())
  return new Object3D(gltf.node, gltf.animations)
}

const hero = await loadModel<HeroAnimations>("models/soldier.glb")
const surface = await loadModel("models/surface.glb")
const box = await loadModel("models/box.glb")
const box2 = await loadModel("models/box.glb")
const box3 = await loadModel("models/box.glb")

hero.frustumCulled = false
surface.frustumCulled = false

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
  const step = 0.03
  const colliders = [box, box2, box3]
  const speed = shiftPressed ? 3 : 1
  if (wPressed) move(hero, new Vector3(0, 0, speed * -step), colliders)
  if (sPressed) move(hero, new Vector3(0, 0, speed * step), colliders)
  if (aPressed) hero.node.localMatrix.rotateY(-0.03)
  if (dPressed) hero.node.localMatrix.rotateY(0.03)

  if (wPressed || sPressed) {
    hero.animate(shiftPressed ? "Run" : "Walk", i += 0.02)
    followObject(hero.node)
  } else {
    hero.updateWorldMatrix()
  }

  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

requestAnimationFrame(update)

document.body.appendChild(renderer.gl.canvas)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})

window.addEventListener("keydown", (e) => {
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
