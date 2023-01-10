import { AmbientLight, DirectionalLight } from "@core/lights"
import { PerspectiveCamera } from "@core/camera"
import { CameraControl } from "@core/cameraControl"
import { KeyboardManager } from "@core/controls/keyboard"
import { parseGltf } from "@core/loaders/gltf"
import { Node } from "@core/node"
import { Object3D } from "@core/object3d"

import { Renderer } from "@webgl/renderer"
import { Scene } from "@webgl/scene"

import { toRadian } from "@math/angle"
import { Vector3 } from "@math/vector3"
import { Quaternion } from "@math/quaternion"

import { PhysicsEngine } from "@physics/engine"

import { timesMap } from "@utils/array"

import { DebugLightsRenderer } from "@webgl/debug/renderers/lights"
import { DebugSkeletonRenderer } from "@webgl/debug/renderers/skeletons"
import { DebugOBBRenderer } from "@webgl/debug/renderers/obb"
import { DebugAABBRenderer } from "@webgl/debug/renderers/aabb"

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
  debugRenderers: [
    DebugLightsRenderer,
    DebugSkeletonRenderer,
    DebugAABBRenderer,
    DebugOBBRenderer,
  ],
})

renderer.gl.canvas.addEventListener("click", () => {
  new CameraControl({ camera, element: renderer.gl.canvas as Element, speed: 0.7 })
})

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
const wall = await Promise.all(timesMap(3, () => loadModel("models/box.glb")))

court.frustumCulled = false
court.isMovable = false
court.restitution = 1
court.setScale(new Vector3(100, 100, 100))
court.setRotation(Quaternion.fromAxisAngle(new Vector3(0, -1, 0), Math.PI / 2))

net.isMovable = false
net.restitution = 0.15
net.setScale(new Vector3(3, 2.5, 4.5))
net.setPosition(new Vector3(31, 0, 0))
net.setRotation(Quaternion.fromAxisAngle(new Vector3(0, -1, 0), Math.PI / 2))

ball.airFriction = 0.001
ball.restitution = 0.6
ball.colliders = [court, net, ...wall]
ball.setMass(0.1)
ball.setScale(new Vector3(7, 7, 7))
ball.setPosition(new Vector3(0, 7, 1085))

player.frustumCulled = false
player.colliders = [net, npc, court]
player.setMass(70)
player.setRotation(Quaternion.fromAxisAngle(Vector3.one().normalize(), -Math.PI / 4))
player.setPosition(new Vector3(0, 88, 1200))

npc.colliders = [court]
npc.setMass(70)
npc.setPosition(new Vector3(0, 88, -1200))

wall[0].setPosition(new Vector3(0, 0, 300))
wall[1].setPosition(new Vector3(25, 40, 300))
wall[2].setPosition(new Vector3(-25, 40, 300))
wall.forEach((b) => {
  b.setScale(new Vector3(2, 2, 2))
  b.friction = 0.5
  b.staticFriction = 0.9
  b.colliders = [court, net, ball, ...wall.filter((x) => x !== b)]
  b.setMass(0.05)
})

const scene = new Scene()
scene.addLight(directionalLight, ambientLight)
scene.addCamera(camera)
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
  const from = new Vector3(0, 700, 1500)
  const up = new Vector3(0, 150, 0)
  camera.setPosition(from.add(node.position))
  camera.lookAt(up.add(node.position))
}

const followBall = () => {
  if (ball.velocity.lengthSquared() < 1) {
    npc.animate("Idle", i)
    return
  }
  const ballPosition = ball.node.position
  const npcPosition = npc.node.position
  if (ballPosition.x > npcPosition.x) {
    npc.animate("RunLeft", i)
  } else if (ballPosition.x < npcPosition.x) {
    npc.animate("RunRight", i)
  } else {
    npc.animate("Idle", i)
  }
  npcPosition.x = ballPosition.x
  npc.setPosition(npcPosition)
}

followObject(player.node)

let i = 0
const angle = Math.PI / 10
const power = 170
const speed = 30

const update = () => {
  player.velocity.x = 0
  player.velocity.z = 0

  if (keyboard.isPressed("KeyW")) player.velocity.add(new Vector3(0, 0, -1))
  if (keyboard.isPressed("KeyS")) player.velocity.add(new Vector3(0, 0, 1))
  if (keyboard.isPressed("KeyA")) player.velocity.add(new Vector3(-1, 0, 0))
  if (keyboard.isPressed("KeyD")) player.velocity.add(new Vector3(1, 0, 0))

  if (!player.velocity.equal(Vector3.zero())) {
    const y = player.velocity.y
    player.velocity.normalize().multiplyScalar(speed)
    player.velocity.y = y
  }

  player.animate(getAnimation(), i += 0.02)

  followBall()

  if (ball.aabb.collide(npc.aabb)) {
    ball.velocity.set(0, Math.sin(angle), Math.cos(angle)).multiplyScalar(power)
    // ball.angularVelocity.set(0, 50 * (Math.random() - 0.5), 0)
  }

  if (ball.aabb.collide(player.aabb)) {
    ball.velocity.set(0, Math.sin(angle), -Math.cos(angle)).multiplyScalar(power)
    // ball.angularVelocity.set(0, 50 * (Math.random() - 0.5), 0)
  }

  physics.run(scene.objects)
  renderer.render(scene)
  requestAnimationFrame(update)
}

requestAnimationFrame(update)

document.body.appendChild(renderer.gl.canvas as Element)
window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight)
  camera.setOptions({ aspect: window.innerWidth / window.innerHeight })
})
