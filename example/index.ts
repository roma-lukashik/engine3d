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

court.frustumCulled = false
court.isMovable = false
court.restitution = 1
court.mass = 1e10
court.node.localMatrix = Matrix4.scaling(100, 100, 100).rotateY(Math.PI / 2)
court.updateWorldMatrix()

net.isMovable = false
net.restitution = 0.15
net.mass = 1e10
net.node.localMatrix = Matrix4.scaling(4.5, 2.5, 3).translate(5, 0, 0).rotateY(Math.PI / 2)
net.updateWorldMatrix()

ball.mass = 0.1
ball.restitution = 0.6
ball.colliders = [court, net, ...wall]
ball.node.children[0].localMatrix.scale(7, 7, 7)
ball.node.localMatrix = Matrix4.translation(0, 8, 1085)
ball.updateWorldMatrix()

player.frustumCulled = false
player.isMovable = false
player.colliders = [net, npc]
player.node.localMatrix = Matrix4.translation(0, 88, 1200).rotateY(Math.PI)
player.updateWorldMatrix()

npc.isMovable = false
npc.node.localMatrix = Matrix4.translation(0, 88, -1200)
npc.updateWorldMatrix()

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
  const from = new Vector3(0, 700, -1500)
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

const move = (object: Object3D, translationVector: Vector3) => {
  const collision = findCollision(object, translationVector.clone().negate())
  if (collision) {
    object.node.localMatrix.translateByVector(collision.add(translationVector))
  } else {
    object.node.localMatrix.translateByVector(translationVector)
  }
  object.updateWorldMatrix()
}

const findCollision = (object: Object3D, translationVector: Vector3) => {
  for (const collider of object.colliders) {
    const overlap = continuousAABBCollisionDetection(object.aabb, collider.aabb, translationVector)
    if (overlap) {
      return overlap
    }
  }
  return
}

followObject(player.node)

let i = 0
const angle = Math.PI / 10
const power = 170
const speed = 6
const dt = 0.15

const update = () => {
  const movingVector = Vector3.zero()

  if (keyboard.isPressed("KeyW")) movingVector.add(new Vector3(0, 0, 1))
  if (keyboard.isPressed("KeyS")) movingVector.add(new Vector3(0, 0, -1))
  if (keyboard.isPressed("KeyA")) movingVector.add(new Vector3(1, 0, 0))
  if (keyboard.isPressed("KeyD")) movingVector.add(new Vector3(-1, 0, 0))

  player.animate(getAnimation(), i += 0.02)

  if (!movingVector.equal(Vector3.zero())) {
    movingVector.normalize().multiplyScalar(speed)
    move(player, movingVector)
  }

  scene.objects.forEach((rigidBody) => {
    if (!rigidBody.isMovable) {
      return
    }

    const radius = rigidBody.aabb.max.clone().subtract(rigidBody.aabb.min).length() / 8000
    const forces = calculateForces(rigidBody, radius)
    const acceleration = forces.divideScalar(rigidBody.mass)
    const deltaVelocity = acceleration.multiplyScalar(dt)
    rigidBody.velocity.add(deltaVelocity)
    const dx = rigidBody.velocity.clone().multiplyScalar(dt)
    rigidBody.node.localMatrix.translateByVector(dx)

    rigidBody.colliders.forEach((collider) => {
      const overlap = continuousAABBCollisionDetection(rigidBody.aabb, collider.aabb, dx)
      if (!overlap) {
        return
      }
      const contactNormal = overlap.clone().normalize()
      const reducedMass = rigidBody.mass * collider.mass / (rigidBody.mass + collider.mass)
      const impactSpeed = contactNormal.dot(rigidBody.velocity.clone().subtract(collider.velocity))
      const impulseMagnitude = (1 + rigidBody.restitution * collider.restitution) * reducedMass * impactSpeed
      const deltaRigidBodyVelocity = contactNormal.clone().multiplyScalar(-impulseMagnitude / rigidBody.mass)
      const deltaColliderVelocity = contactNormal.multiplyScalar(impulseMagnitude / collider.mass)

      rigidBody.velocity.add(deltaRigidBodyVelocity)
      rigidBody.node.localMatrix.translateByVector(overlap.negate())

      collider.velocity.add(deltaColliderVelocity)
    })
  })

  if (ball.aabb.collide(npc.aabb)) {
    ball.velocity.set(0, Math.sin(angle), Math.cos(angle)).multiplyScalar(power)
    ball.angularVelocity.set(0, 5000 * (Math.random() - 0.5), 0)
  }

  if (ball.aabb.collide(player.aabb)) {
    ball.velocity.set(0, Math.sin(angle), -Math.cos(angle)).multiplyScalar(power)
    ball.angularVelocity.set(0, 5000 * (Math.random() - 0.5), 0)
  }

  scene.objects.forEach((rigidBody) => {
    // Assume, that if velocity magnitude less than 1, the body is not moving
    if (rigidBody.velocity.lengthSquared() > 1) {
      rigidBody.updateWorldMatrix()
    }
  })

  if (ball.velocity.lengthSquared() > 1) {
    followBall()
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
