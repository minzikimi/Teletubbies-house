import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import GUI from 'lil-gui'
import { createTeletubbies } from './components/teletuby'
import { createNooNoo } from './components/noonoo'

// === Scene Setup ===
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x87ceeb, 15, 50)

// === Camera ===
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 8, 15)

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.xr.enabled = true // VR 기능 활성화!
document.body.appendChild(renderer.domElement)
document.body.appendChild(VRButton.createButton(renderer)) // VR 버튼 추가

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.enableDamping = true

// === GUI 생성 ===
const gui = new GUI()

// === Dome (Ceiling & Wall) ===
const domeGeometry = new THREE.SphereGeometry(15, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2)
const domeMaterial = new THREE.MeshStandardMaterial({
  color: 0x6AB8C5,
  side: THREE.BackSide,
  emissive: 0x224455,
  emissiveIntensity: 0.6,
  roughness: 0.5,
  metalness: 0.1
})
const dome = new THREE.Mesh(domeGeometry, domeMaterial)
dome.position.y = 7.5
scene.add(dome)

gui.addColor({ domeColor: 0x6AB8C5 }, 'domeColor').name('Dome Color').onChange((value: number) => {
  domeMaterial.color.set(value);
});

gui.add(domeMaterial, 'emissiveIntensity', 0, 2).name('Emissive Intensity')

// === Floor ===
const floorGeometry = new THREE.CircleGeometry(15, 64)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xafd4db })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.position.y = 0
scene.add(floor)

// === Window (transparent disc) ===
const windowCount = 3
const windowRadius = 13.7
const windowY = 5
const windowAngleStart = Math.PI * 0.15
const windowAngleEnd = Math.PI * 0.85

for (let i = 0; i < windowCount; i++) {
  const theta = windowAngleStart + (windowAngleEnd - windowAngleStart) * (i / (windowCount - 1))
  const x = Math.sin(theta) * windowRadius
  const y = windowY
  const z = -Math.cos(theta) * windowRadius

  const windowMesh = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 32),
    new THREE.MeshBasicMaterial({
      color: 0x6AB8C5,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    })
  )
  windowMesh.position.set(x, y, z)
  windowMesh.lookAt(0, y, 0)
  scene.add(windowMesh)

  for (let j = 0; j < 8; j++) {
    const petalGeometry = new THREE.RingGeometry(1.2, 1.5, 32, 1, 0, Math.PI / 6)
    const petalMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    })
    const petal = new THREE.Mesh(petalGeometry, petalMaterial)
    petal.position.set(x, y, z)
    petal.lookAt(0, y, 0)
    petal.rotateZ((Math.PI / 4) * j)
    scene.add(petal)
  }
}

// === Teletubby Beds ===
const bedCount = 4
const bedRadius = 12.5
const bedY = 0

for (let i = 0; i < bedCount; i++) {
  const angle = Math.PI / 2 + (i * Math.PI / 6)
  const x = Math.cos(angle) * bedRadius
  const z = Math.sin(angle) * bedRadius

  const bedBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 0.4, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1
    })
  )
  bedBase.position.set(x, bedY + 0.2, z)
  bedBase.rotation.y = -angle
  scene.add(bedBase)

  const mattress = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0xf09494 })
  )
  mattress.position.set(x, bedY + 0.45, z)
  mattress.rotation.y = -angle
  scene.add(mattress)

  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  )
  pillow.position.set(x, bedY + 0.6, z + 0.3)
  pillow.rotation.y = -angle
  scene.add(pillow)
}

// === Smiley Pancakes ===
const pancakeStackHeight = 3
const pancakeRadius = 0.6
const pancakeThickness = 0.1
const pancakeColor = 0xf5d6a1

for (let i = 0; i < pancakeStackHeight; i++) {
  const pancake = new THREE.Mesh(
    new THREE.CylinderGeometry(pancakeRadius, pancakeRadius, pancakeThickness, 32),
    new THREE.MeshStandardMaterial({ color: pancakeColor })
  )
  pancake.position.set(0, 0.3 + i * (pancakeThickness + 0.02), 0)
  scene.add(pancake)
}

// === Smiley Face on Top Pancake ===
const eyeGeometry = new THREE.CircleGeometry(0.05, 16)
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial)
const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial)

const mouthGeometry = new THREE.RingGeometry(0.12, 0.14, 32, 1, 0, Math.PI)
const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)

const topPancakeY = 0.3 + (pancakeStackHeight - 1) * (pancakeThickness + 0.02)

eyeLeft.position.set(-0.15, topPancakeY + 0.051, 0.15)
eyeRight.position.set(0.15, topPancakeY + 0.051, 0.15)
mouth.position.set(0, topPancakeY + 0.051, -0.05)

eyeLeft.rotation.x = -Math.PI / 2
eyeRight.rotation.x = -Math.PI / 2
mouth.rotation.x = -Math.PI / 2

scene.add(eyeLeft, eyeRight, mouth)

// === Table in the center ===
const table = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 0.3, 32),
  new THREE.MeshLambertMaterial({ color: 0x4e99ef })
)
table.position.set(0, 0.15, 0)
scene.add(table)

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
gui.add(ambientLight, 'intensity', 0, 3).name('Ambient Light')

const hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x6AB8C5, 2.0)
hemiLight.position.set(0, 20, 0)
scene.add(hemiLight)

const pointLight = new THREE.PointLight(0xffffff, 5, 100)
pointLight.position.set(0, 12, 0)
scene.add(pointLight)
gui.add(pointLight, 'intensity', 0, 10).name('Point Light')

// === Resize Handling ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// === Add Teletubbies ===
createTeletubbies(scene)
createNooNoo(scene)

 
//custard machine
const custardMachine = new THREE.Group();

function createPillar(x: number) {
  const pillarGroup = new THREE.Group();

  // Main pillar (soft silver/gray)
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 1.3, 32),
    new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.2, roughness: 0.6 })
  );
  pillar.position.y = 0.65;
  pillarGroup.add(pillar);

  // Blue ring (soft pastel blue)
  const blueRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.06, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x68aff7, roughness: 0.7 })
  );
  blueRing.position.y = 1.22;
  blueRing.rotation.x = Math.PI / 2;
  pillarGroup.add(blueRing);

  // Dome on top (soft pink, low emissive)
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 16),
    new THREE.MeshStandardMaterial({ color: 0xfe71b9, emissive: 0xfe71b9, emissiveIntensity: 0.3 })
  );
  dome.position.y = 1.42;
  pillarGroup.add(dome);

  // Base (soft pink)
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0xffe0f0, roughness: 0.7 })
  );
  base.position.y = 0.1;
  pillarGroup.add(base);

  // Button (soft red, low emissive)
  const button = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffa0a0, emissive: 0xff8080, emissiveIntensity: 0.2 })
  );
  button.position.set(0, 0.7, 0.28);
  pillarGroup.add(button);

  pillarGroup.position.x = x;
  return pillarGroup;
}

custardMachine.add(createPillar(-0.75));
custardMachine.add(createPillar(0.75));

// Base bar (soft pink)
const baseBar = new THREE.Mesh(
  new THREE.BoxGeometry(1.4, 0.15, 0.6),
  new THREE.MeshStandardMaterial({ color: 0xffe0f0, roughness: 0.7 })
);
baseBar.position.set(0, 0.1, 0);
custardMachine.add(baseBar);

// Lever/arm (soft blue)
const lever = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.08, 0.12),
  new THREE.MeshStandardMaterial({ color: 0xa3d1ff, roughness: 0.7 })
);
lever.position.set(-0.15, 0.45, 0.22);
lever.rotation.z = Math.PI / 7;
custardMachine.add(lever);

// Bowl (soft, translucent pink)
const bowl = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xffe0f0, transparent: true, opacity: 0.6 })
);
bowl.position.set(0.18, 0.13, 0.32);
bowl.rotation.x = Math.PI;
custardMachine.add(bowl);

// Position the machine in the room
custardMachine.position.set(5, 0, -5); // Adjust as needed
scene.add(custardMachine);



// === Audio Setup ===
const listener = new THREE.AudioListener()
camera.add(listener)

const sound = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()
audioLoader.load('/ost.mp3', buffer => {
  sound.setBuffer(buffer)
  sound.setLoop(true)
  sound.setVolume(0.5)
})

// === Button Control ===
const playMusicBtn = document.getElementById('playMusicBtn')
const iconImg = playMusicBtn ? playMusicBtn.querySelector('img') : null

if (playMusicBtn && iconImg) {
  playMusicBtn.addEventListener('click', () => {
    if (!sound.isPlaying) {
      sound.play()
      iconImg.src = '/music-off.svg'
      iconImg.alt = 'Pause'
    } else {
      sound.pause()
      iconImg.src = '/music-on.svg'
      iconImg.alt = 'Play'
    }
  })
}

// === Animation Loop (WebXR 지원) ===
renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
