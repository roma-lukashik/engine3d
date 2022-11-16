import { AmbientLight, DirectionalLight } from "@core/lights"
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

import { calculateForces } from "./physics"

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
  ambientLight,
)

const followObject = (node: Node): void => {
  const nodePosition = node.getWorldPosition()
  const nodeRotation = node.getWorldRotation()
  const from = new Vector3(0, 400, -500)
  const up = new Vector3(0, 150, 0)
  camera.setPosition(from.rotateByQuaternion(nodeRotation).add(nodePosition))
  camera.lookAt(up.add(nodePosition))
}

const followBall = () => {
  const ballPosition = ball.node.getWorldPosition()
  const hp = npc.node.getWorldPosition()
  if (ballPosition.x > hp.x) {
    npc.animate("RunLeft", i)
  } else if (ballPosition.x < hp.x) {
    npc.animate("RunRight", i)
  } else {
    npc.animate("Idle", i)
  }
  npc.node.localMatrix = Matrix4.translation(ballPosition.x, hp.y, hp.z)
  npc.updateWorldMatrix()
}

const move = (object: Object3D, translationVector: Vector3, colliders: Object3D[] = []) => {
  const collide = colliders.some((collider) => collider.aabb.collide(object.aabb))
  if (!collide) {
    object.node.localMatrix.translate(translationVector.x, translationVector.y, translationVector.z)
  }
}

type PlayerAnimations =
  | "Run"
  | "RunLeft"
  | "RunRight"
  | "Walk"
  | "WalkLeft"
  | "WalkRight"
  | "WalkBackward"
  | "Idle"

const loadModel = async <T extends string>(url: string) => {
  const gltf = await parseGltf<T>(await (await fetch(url)).arrayBuffer())
  return new Object3D(gltf.node, gltf.animations)
}

const player = await loadModel<PlayerAnimations>("models/player.glb")
const npc = await loadModel<PlayerAnimations>("models/player.glb")
const court = await loadModel("models/court.glb")
const ball = await loadModel("models/ball.glb")
const net = await loadModel("models/net.glb")

player.frustumCulled = false
court.frustumCulled = false

scene.addObject(court)
scene.addObject(net)
scene.addObject(player)
scene.addObject(npc)
scene.addObject(ball)

court.node.localMatrix = Matrix4.scaling(100, 100, 100).rotateY(Math.PI / 2)
court.updateWorldMatrix()

net.node.localMatrix = Matrix4.scaling(4.5, 2.5, 3).translate(5, 0, 0).rotateY(Math.PI / 2)
net.updateWorldMatrix()

ball.node.localMatrix = Matrix4.scaling(7, 7, 7).translate(0, 1.1, 155)
ball.updateWorldMatrix()

player.node.localMatrix = Matrix4.translation(0, 88, 1200).rotateY(Math.PI)
player.updateWorldMatrix()

npc.node.localMatrix = Matrix4.translation(0, 88, -1200)
npc.updateWorldMatrix()

followObject(player.node)

let wPressed = false
let sPressed = false
let aPressed = false
let dPressed = false
// let shiftPressed = false
let i = 0

const angle = Math.PI / 8
const power = 62
const direction = Vector3.one()
const velocity = Vector3.zero()
const angularVelocity = Vector3.zero()
let dT = 0

const update = () => {
  const step = 0.03
  const colliders = [net, npc]
  const speed = 200
  const movingVector = Vector3.zero()

  if (wPressed) movingVector.add(new Vector3(0, 0, speed * step))
  if (sPressed) movingVector.add(new Vector3(0, 0, speed * -step))
  if (aPressed) movingVector.add(new Vector3(speed * step, 0, 0))
  if (dPressed) movingVector.add(new Vector3(speed * -step, 0, 0))

  if (!movingVector.equal(Vector3.zero())) {
    move(player, movingVector, colliders)
  }

  i += 0.02

  if (aPressed) {
    player.animate("RunLeft", i)
  } else if (dPressed) {
    player.animate("RunRight", i)
  } else if (wPressed) {
    player.animate("Run", i)
    // followObject(player.node)
  } else if (sPressed) {
    player.animate("WalkBackward", i)
  } else {
    player.animate("Idle", i)
  }

  const mass = 0.1
  const radius = ball.aabb.max.clone().subtract(ball.aabb.min).length() / 1000 / 2
  const forces = calculateForces(mass, velocity, angularVelocity, radius)
  const acceleration = forces.divideScalar(mass)
  const dV = acceleration.multiplyScalar(dT)
  velocity.add(dV)
  const dx = velocity.clone().multiplyScalar(dT)
  ball.node.localMatrix.translate(dx.x, dx.y, dx.z)
  ball.updateWorldMatrix()

  if (ball.aabb.collide(net.aabb)) {
    velocity.multiplyScalar(0.1)
    velocity.z *= -1
    velocity.y *= -1
    ball.node.localMatrix.translate(0, -dx.y, -dx.z)
    ball.updateWorldMatrix()
  }

  if (ball.aabb.collide(court.aabb)) {
    velocity.multiplyScalar(0.7)
    velocity.y *= -1
    ball.node.localMatrix.translate(0, -dx.y, 0)
    ball.updateWorldMatrix()
  }

  if (ball.aabb.collide(npc.aabb)) {
    direction.x = player.node.getWorldPosition().subtract(npc.node.getWorldPosition()).normalize().x
    direction.z *= -1
    velocity.set(1, Math.sin(angle), Math.cos(angle)).multiply(direction).multiplyScalar(power)
    angularVelocity.set(0, 0, 0)
    ball.node.localMatrix.translate(-dx.x, -dx.y, -dx.z)
    ball.updateWorldMatrix()
  }

  // almost stop
  if (velocity.lengthSquared() < 1) {
    velocity.set(0, 0, 0)
  }
  followBall()

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
  // if (e.shiftKey) {
  //   shiftPressed = true
  // }
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
  // if (!e.shiftKey) {
  //   shiftPressed = false
  // }
  if (e.key.toLowerCase() === " ") {
    dT = 0.07
    direction.z *= -1
    direction.x = direction.z * camera.position.clone().subtract(camera.target).normalize().x
    angularVelocity.set(0, 300, 0)
    velocity.set(1, Math.sin(angle), Math.cos(angle)).multiply(direction).multiplyScalar(power)
  }
})
