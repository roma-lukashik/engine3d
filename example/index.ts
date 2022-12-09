import { AmbientLight, DirectionalLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { CameraControl } from "@core/cameraControl"
import { KeyboardManager } from "@core/controls/keyboard"
import { parseGltf } from "@core/loaders/gltf"
import { Node } from "@core/node"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Matrix4 } from "@math/matrix4"
import { Object3D } from "@core/object3d"

import { PhysicsEngine } from "@physics/engine"

import { timesMap } from "@utils/array"

const camera = new PerspectiveCamera({
  aspect: window.innerWidth / window.innerHeight,
  fovy: toRadian(30),
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
  new CameraControl({ camera, element: renderer.gl.canvas, speed: 0.7 })
}

const physics = new PhysicsEngine({ deltaTime: 0.2 })

const keyboard = new KeyboardManager()

type PlayerAnimations =
  | "Idle"
  | "RunForward"
  | "RunBackward"
  | "RunLeft"
  | "RunRight"
  | "RunForwardRight"
  | "RunForwardLeft"
  | "RunBackwardRight"
  | "RunBackwardLeft"

const loadModel = async <T extends string>(url: string) => {
  const gltf = await parseGltf<T>(await (await fetch(url)).arrayBuffer())
  return new Object3D(gltf.node, gltf.animations)
}

const player = await loadModel<PlayerAnimations>("models/player.glb")
const npc = await loadModel<PlayerAnimations>("models/player.glb")
const court = await loadModel("models/court.glb")
const ball = await loadModel("models/ball.glb")
const net = await loadModel("models/net.glb")
const wall = await Promise.all(timesMap(9, () => loadModel("models/box.glb")))

court.frustumCulled = false
court.isMovable = false
court.restitution = 1
court.node.localMatrix = Matrix4.scaling(100, 100, 100).rotateY(Math.PI / 2)
court.updateWorldMatrix()

net.isMovable = false
net.restitution = 0.15
net.node.localMatrix = Matrix4.scaling(4.5, 2.5, 3).translate(5, 0, 0).rotateY(Math.PI / 2)
net.updateWorldMatrix()

ball.setMass(0.1)
ball.airFriction = 0.001
ball.restitution = 0.6
ball.colliders = [court, net, ...wall]
ball.node.children[0].localMatrix.scale(7, 7, 7)
ball.node.localMatrix = Matrix4.translation(0, 8, 1085)
ball.updateWorldMatrix()

player.frustumCulled = false
player.setMass(70)
player.colliders = [net, npc, court]
player.node.children[0].localMatrix.rotateY(Math.PI)
player.node.localMatrix = Matrix4.translation(0, 88, 1200)
player.updateWorldMatrix()

npc.setMass(70)
npc.colliders = [court]
npc.node.localMatrix = Matrix4.translation(0, 88, -1200)
npc.updateWorldMatrix()

wall[0].node.localMatrix.translate(0, 0, 100)
wall[1].node.localMatrix.translate(20, 0, 100)
wall[2].node.localMatrix.translate(-20, 0, 100)
wall[3].node.localMatrix.translate(-20, 20, 100)
wall[4].node.localMatrix.translate(20, 20, 100)
wall[5].node.localMatrix.translate(0, 20, 100)
wall[6].node.localMatrix.translate(-20, 40, 100)
wall[7].node.localMatrix.translate(20, 40, 100)
wall[8].node.localMatrix.translate(0, 40, 100)
wall.forEach((b) => {
  b.setMass(0.05)
  b.friction = 0.5
  b.staticFriction = 0.8
  b.colliders = [court, net, ball, ...wall.filter((x) => x !== b)]
  b.updateWorldMatrix()
})

const scene = new Scene()
scene.addLight(
  directionalLight,
  ambientLight,
)

scene.addObject(court)
scene.addObject(net)
scene.addObject(player)
scene.addObject(npc)
scene.addObject(ball)
wall.forEach((box) => scene.addObject(box))

keyboard.registerKeyPres("Space", () => followObject(player.node))

const getAnimation = (): PlayerAnimations => {
  if (keyboard.isPressed("KeyW") && keyboard.isPressed("KeyA")) return "RunForwardLeft"
  if (keyboard.isPressed("KeyW") && keyboard.isPressed("KeyD")) return "RunForwardRight"
  if (keyboard.isPressed("KeyS") && keyboard.isPressed("KeyA")) return "RunBackwardLeft"
  if (keyboard.isPressed("KeyS") && keyboard.isPressed("KeyD")) return "RunBackwardRight"
  if (keyboard.isPressed("KeyW")) return "RunForward"
  if (keyboard.isPressed("KeyS")) return "RunBackward"
  if (keyboard.isPressed("KeyA")) return "RunLeft"
  if (keyboard.isPressed("KeyD")) return "RunRight"
  return "Idle"
}

const followObject = (node: Node): void => {
  const nodePosition = node.getWorldPosition()
  const nodeRotation = node.getWorldRotation()
  const from = new Vector3(0, 700, 1500)
  const up = new Vector3(0, 150, 0)
  camera.setPosition(from.rotateByQuaternion(nodeRotation).add(nodePosition))
  camera.lookAt(up.add(nodePosition))
}

const followBall = () => {
  const ballPosition = ball.node.getWorldPosition()
  const npcPosition = npc.node.getWorldPosition()
  if (ballPosition.x > npcPosition.x) {
    npc.animate("RunLeft", i)
  } else if (ballPosition.x < npcPosition.x) {
    npc.animate("RunRight", i)
  } else {
    npc.animate("Idle", i)
  }
  npc.node.localMatrix.translate(ballPosition.x - npcPosition.x, 0, 0)
  npc.updateWorldMatrix()
}

followObject(player.node)

let i = 0
const angle = Math.PI / 10
const power = 170
const speed = 30

const update = () => {
  player.velocity.set(0, 0, 0)

  if (keyboard.isPressed("KeyW")) player.velocity.add(new Vector3(0, 0, -1))
  if (keyboard.isPressed("KeyS")) player.velocity.add(new Vector3(0, 0, 1))
  if (keyboard.isPressed("KeyA")) player.velocity.add(new Vector3(-1, 0, 0))
  if (keyboard.isPressed("KeyD")) player.velocity.add(new Vector3(1, 0, 0))

  if (!player.velocity.equal(Vector3.zero())) {
    player.velocity.normalize().multiplyScalar(speed)
  }

  player.animate(getAnimation(), i += 0.02)

  if (ball.velocity.lengthSquared() > 1) {
    followBall()
  }

  if (ball.aabb.collide(npc.aabb)) {
    ball.velocity.set(0, Math.sin(angle), Math.cos(angle)).multiplyScalar(power)
    ball.angularVelocity.set(0, 50 * (Math.random() - 0.5), 0)
  }

  if (ball.aabb.collide(player.aabb)) {
    ball.velocity.set(0, Math.sin(angle), -Math.cos(angle)).multiplyScalar(power)
    ball.angularVelocity.set(0, 50 * (Math.random() - 0.5), 0)
  }

  physics.run(scene.objects)
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}

requestAnimationFrame(update)

document.body.appendChild(renderer.gl.canvas)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})
