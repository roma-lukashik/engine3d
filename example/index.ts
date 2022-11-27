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
import { continuousAABBCollisionDetection } from "./sat"

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

const scene = new Scene()
scene.addLight(
  directionalLight,
  ambientLight,
)

const followObject = (node: Node): void => {
  const nodePosition = node.getWorldPosition()
  const nodeRotation = node.getWorldRotation()
  const from = new Vector3(0, 700, -1500)
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
  const collision = findCollision(object, translationVector.clone().negate(), colliders)
  if (collision) {
    object.node.localMatrix.translateByVector(collision.clone().negate().add(translationVector))
  } else {
    object.node.localMatrix.translateByVector(translationVector)
  }
  object.updateWorldMatrix()
}

const findCollision = (object: Object3D, translationVector: Vector3, colliders: Object3D[]) => {
  for (const collider of colliders) {
    const overlap = continuousAABBCollisionDetection(object.aabb, collider.aabb, translationVector)
    if (overlap) {
      return overlap
    }
  }
  return
}

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

ball.node.children[0].localMatrix.scale(7, 7, 7)
ball.node.localMatrix = Matrix4.translation(0, 8, 1085)
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
let i = 0

const angle = Math.PI / 10
const power = 170
const direction = Vector3.one()
const velocity = Vector3.zero()
const angularVelocity = Vector3.zero()
const speed = 6
const dt = 0.15

const getAnimation = (): PlayerAnimations => {
  if (wPressed && aPressed) return "RunForwardLeft"
  if (wPressed && dPressed) return "RunForwardRight"
  if (sPressed && aPressed) return "RunBackwardLeft"
  if (sPressed && dPressed) return "RunBackwardRight"
  if (wPressed) return "RunForward"
  if (sPressed) return "RunBackward"
  if (aPressed) return "RunLeft"
  if (dPressed) return "RunRight"
  return "Idle"
}

const update = () => {
  const colliders = [net, npc]
  const movingVector = Vector3.zero()

  if (wPressed) movingVector.add(new Vector3(0, 0, 1))
  if (sPressed) movingVector.add(new Vector3(0, 0, -1))
  if (aPressed) movingVector.add(new Vector3(1, 0, 0))
  if (dPressed) movingVector.add(new Vector3(-1, 0, 0))

  if (!movingVector.equal(Vector3.zero())) {
    movingVector.normalize().multiplyScalar(speed)
    move(player, movingVector, colliders)
  }

  player.animate(getAnimation(), i += 0.02)

  const mass = 0.1
  const radius = ball.aabb.max.clone().subtract(ball.aabb.min).length() / 8000
  const forces = calculateForces(mass, velocity, angularVelocity, radius)
  const acceleration = forces.divideScalar(mass)
  const dv = acceleration.multiplyScalar(dt)
  if (!velocity.equal(Vector3.zero())) {
    velocity.add(dv)
  }
  const dx = velocity.clone().multiplyScalar(dt)

  const netOverlap = continuousAABBCollisionDetection(ball.aabb, net.aabb, dx, [new Vector3(0, 0, 1)])
  if (netOverlap) {
    velocity.reflect(netOverlap).multiplyScalar(0.1)
    ball.node.localMatrix.translateByVector(netOverlap.negate().add(dx).divideScalar(7))
    ball.updateWorldMatrix()
  }

  const courtOverlap = continuousAABBCollisionDetection(ball.aabb, court.aabb, dx, [new Vector3(0, 1, 0)])
  if (courtOverlap) {
    velocity.reflect(courtOverlap).multiplyScalar(0.7)
    ball.node.localMatrix.translateByVector(courtOverlap.negate().add(dx).divideScalar(7))
    ball.updateWorldMatrix()
  }

  const npcOverlap = continuousAABBCollisionDetection(ball.aabb, npc.aabb, dx, [new Vector3(0, 0, 1)])
  if (npcOverlap) {
    direction.reflect(npcOverlap)
    ball.node.localMatrix.translateByVector(npcOverlap.negate().add(dx).divideScalar(7))
    ball.updateWorldMatrix()

    velocity.set(0, Math.sin(angle), Math.cos(angle)).multiply(direction).multiplyScalar(power)
    angularVelocity.set(0, 5000 * (Math.random() - 0.5), 0)
  }

  const approachSpeed = movingVector.clone().negate().subtract(dx)
  const playerOverlap = continuousAABBCollisionDetection(player.aabb, ball.aabb, approachSpeed, [new Vector3(0, 0, 1)])
  if (playerOverlap) {
    direction.reflect(playerOverlap)
    ball.node.localMatrix.translateByVector(playerOverlap)
    ball.updateWorldMatrix()

    velocity.set(0, Math.sin(angle), Math.cos(angle)).multiply(direction).multiplyScalar(power)
    angularVelocity.set(0, 5000 * (Math.random() - 0.5), 0)
  }

  if (!netOverlap && !courtOverlap && !npcOverlap && !playerOverlap) {
    ball.node.localMatrix.translateByVector(dx)
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
  if (e.key.toLowerCase() === " ") {
    followObject(player.node)
  }
})
