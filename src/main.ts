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
document.body.appendChild(VRButton.createButton(renderer)) 
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

// === Smiley Pancakes (Grouped) ===
const pancakeGroup = new THREE.Group();
const pancakeStackHeight = 6;
const pancakeRadius = 0.6;
const pancakeThickness = 0.1;
const pancakeColor = 0xf5d6a1;

// Top of the table is at y = 0.57, stack starts slightly above that
const stackStartY = 0.57 + 0.05;

for (let i = 0; i < pancakeStackHeight; i++) {
  const pancake = new THREE.Mesh(
    new THREE.CylinderGeometry(pancakeRadius, pancakeRadius, pancakeThickness, 32),
    new THREE.MeshStandardMaterial({ color: pancakeColor })
  );
  pancake.position.y = stackStartY + i * (pancakeThickness + 0.02);
  pancakeGroup.add(pancake);
}

// === Smiley Face on Top Pancake ===
const topPancakeY = stackStartY + (pancakeStackHeight - 1) * (pancakeThickness + 0.02);
const eyeGeometry = new THREE.CircleGeometry(0.05, 16);
const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
eyeLeft.position.set(-0.15, topPancakeY + 0.051, 0.15);
eyeLeft.rotation.x = -Math.PI / 2;

const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
eyeRight.position.set(0.15, topPancakeY + 0.051, 0.15);
eyeRight.rotation.x = -Math.PI / 2;

const mouthGeometry = new THREE.RingGeometry(0.12, 0.14, 32, 1, 0, Math.PI);
const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(0, topPancakeY + 0.051, -0.05);
mouth.rotation.x = -Math.PI / 2;

pancakeGroup.add(eyeLeft, eyeRight, mouth);

// Center pancake group on table
pancakeGroup.position.set(0, 0, 0);
scene.add(pancakeGroup);


// === Tubby Table (center) ===
const tubbyTable = new THREE.Group();

// 1. Table Top (flat, with blue rim)
const tableTop = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5, 1.5, 0.13, 48),
  new THREE.MeshStandardMaterial({ color: 0x2293c6, metalness: 0.4, roughness: 0.3 })
);
tableTop.position.y = 0.57;
tubbyTable.add(tableTop);

// Blue Rim (torus)
const rim = new THREE.Mesh(
  new THREE.TorusGeometry(1.08, 0.07, 24, 64),
  new THREE.MeshStandardMaterial({ color: 0x2293c6, metalness: 0.7, roughness: 0.25 })
);
rim.position.y = 0.64;
rim.rotation.x = Math.PI / 2;
tubbyTable.add(rim);

// 2. Spring Base (bronze/gold spiral)
const springPoints = [];
const springTurns = 3.2;
const springHeight = 0.38;
const springRadius = 0.36;
for (let i = 0; i <= 64; i++) {
  const theta = i / 64 * Math.PI * 2 * springTurns;
  const y = i / 64 * springHeight;
  springPoints.push(new THREE.Vector3(Math.cos(theta) * springRadius, y, Math.sin(theta) * springRadius));
}
const springCurve = new THREE.CatmullRomCurve3(springPoints);
const springGeo = new THREE.TubeGeometry(springCurve, 64, 0.055, 10, false);
const springMat = new THREE.MeshStandardMaterial({ color: 0xb38850, metalness: 0.8, roughness: 0.25 });
const springMesh = new THREE.Mesh(springGeo, springMat);
springMesh.position.y = 0.19;
tubbyTable.add(springMesh);

// 3. Two Legs (angled cylinders + feet)
for (let i = 0; i < 2; i++) {
  const sign = i === 0 ? 1 : -1;
  // Leg
  const leg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 1.15, 14),
    new THREE.MeshStandardMaterial({ color: 0xb38850, metalness: 0.8, roughness: 0.25 })
  );
  leg.position.set(sign * 0.73, -0.22, 0.43);
  leg.rotation.z = Math.PI / 4 * sign;
  leg.rotation.x = Math.PI / 8;
  tubbyTable.add(leg);

  // Foot
  const foot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 0.09, 18),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.6 })
  );
  foot.position.set(sign * 1.19, -0.74, 0.69);
  tubbyTable.add(foot);
}

tubbyTable.position.set(0, 0.15, 0);
scene.add(tubbyTable);


function createCustardPuddle(x: number, z: number): THREE.Mesh {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.2, 0.3, 0.5, 0.2, 0.3, 0)
  shape.bezierCurveTo(0.6, -0.4, -0.4, -0.3, -0.2, 0)
  shape.bezierCurveTo(-0.5, 0.4, -0.1, 0.4, 0, 0)

  const geometry = new THREE.ShapeGeometry(shape)
  const material = new THREE.MeshStandardMaterial({
    color: 0xffe0f0,
    roughness: 0.4,
    metalness: 0,
    transparent: true,
    opacity: 0.8
  })

  const puddle = new THREE.Mesh(geometry, material)
  puddle.rotation.x = -Math.PI / 2 // Lay flat
  puddle.position.set(x, 0.01, z) // Slightly above the floor

  return puddle
}
//golden ticket
function createTextTexture(text: string, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background transparent or colored
  ctx.clearRect(0, 0, width, height);

  // Text style
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#b8860b';  // dark golden text color
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, width / 2, height / 2);

  // Optional: Add some shadow or stroke for better readability
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 2;
  // ctx.strokeText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter; // better for text
  return texture;
}

function addWillyWonkaTicket(x: number, z: number) {
  const group = new THREE.Group();

  const width = 1.5;
  const height = 0.7;

  // === Border Plane ===
  const borderGeometry = new THREE.PlaneGeometry(width + 0.06, height + 0.06); // Slightly bigger
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0xdaa520, // goldenrod border
    side: THREE.DoubleSide,
    metalness: 0.6,
    roughness: 0.4
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  group.add(border);

  // === Main Ticket Plane ===
  const geometry = new THREE.PlaneGeometry(width, height);
  const textTexture = createTextTexture('golden ticket', 512, 256);

  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: textTexture,
    roughness: 0.3,
    metalness: 0.5,
    transparent: false // No need for transparency now
  });

  const ticket = new THREE.Mesh(geometry, material);
  group.add(ticket);

  // Position the group
  group.rotation.x = -Math.PI / 8; // tilt up slightly
  group.position.set(x, 2.5, z); // float in air

  return group;
}

// scene.add(addWillyWonkaTicket(-3, -4))

function addFlower(x: number, z: number) {
  const flowerGroup = new THREE.Group()

  // Pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0x964B00 })
  )
  pot.position.y = 0.15
  flowerGroup.add(pot)

  // Stem
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  )
  stem.position.y = 0.65
  flowerGroup.add(stem)

  // Center
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  )
  center.position.y = 1.1
  flowerGroup.add(center)

  // Petals (simple circular layout)
  const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xff69b4 })
  for (let i = 0; i < 6; i++) {
    const angle = i * (Math.PI / 3)
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      petalMaterial
    )
    petal.position.set(Math.cos(angle) * 0.2, 1.1, Math.sin(angle) * 0.2)
    flowerGroup.add(petal)
  }

  flowerGroup.position.set(x, 0, z)
  return flowerGroup
}

// scene.add(addFlower(-5, 3))

// spongebob

function addSpongeBob() {
  const spongebob = new THREE.Group()

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffff33 })
  )
  body.position.y = 0.6
  spongebob.add(body)

  // Eyes
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMaterial)
  const eyeRight = eyeLeft.clone()
  eyeLeft.position.set(-0.2, 1.1, 0.16)
  eyeRight.position.set(0.2, 1.1, 0.16)

  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
  const pupilLeft = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), pupilMaterial)
  const pupilRight = pupilLeft.clone()
  pupilLeft.position.set(-0.2, 1.1, 0.22)
  pupilRight.position.set(0.2, 1.1, 0.22)

  spongebob.add(eyeLeft, eyeRight, pupilLeft, pupilRight)

  // Pants
  const pants = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  )
  pants.position.y = 0.2
  spongebob.add(pants)

  // Legs
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
  for (let i = 0; i < 2; i++) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12),
      legMaterial
    )
    leg.position.set(i === 0 ? -0.2 : 0.2, 0.05, 0)
    spongebob.add(leg)
  }

  spongebob.position.set(11, 0, 2)
  return spongebob
}

// Store clickable objects and their URLs
const clickableObjects: { object: THREE.Object3D; url: string }[] = [];


// Add flower, ticket, and spongebob to clickable list with URLs
const flower = addFlower(-10, -8);
scene.add(flower);
clickableObjects.push({ object: flower, url: 'https://hannac7.github.io/Daisy/' });

const ticket = addWillyWonkaTicket(-11, 5);
scene.add(ticket);
clickableObjects.push({ object: ticket, url: 'https://kevingarciamartin.github.io/willy-wonka/' });

const spongebob = addSpongeBob();
scene.add(spongebob);
clickableObjects.push({ object: spongebob, url: 'https://spongebob-bedroom.vercel.app' });


//floating cake
function createFloatingCake() {
  const group = new THREE.Group();

  // === Cake Base Layer ===
  const baseLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5 }) // light pink cake
  );
  baseLayer.position.y = 0;

  // === Middle Layer ===
  const middleLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.25, 32),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }) // white cream
  );
  middleLayer.position.y = 0.3;

  // === Top Layer ===
  const topLayer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.5 }) // light pink again
  );
  topLayer.position.y = 0.55;

  // === Cherry on top ===
  const cherry = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x660000, emissiveIntensity: 0.5 })
  );
  cherry.position.set(0, 0.75, 0);

  group.add(baseLayer, middleLayer, topLayer, cherry);

  // Position the whole group in the air
  group.position.set(8, 3, 10); // floating at y = 3

  return group;
}



const cakeOnTable = createFloatingCake();
scene.add(cakeOnTable);
clickableObjects.push({
  object: cakeOnTable,
  url: 'https://immersive-space.netlify.app'
});



// Raycaster & mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Listen for clicks
window.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1) for both components.
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Collect all mesh descendants of clickable objects (since some are groups)
const meshesToTest: THREE.Mesh[] = [];
clickableObjects.forEach((item) => {
  item.object.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      meshesToTest.push(child as THREE.Mesh);
    }
  });
});


  // Check for intersections
  const intersects = raycaster.intersectObjects(meshesToTest, true);

  if (intersects.length > 0) {
    // Find which clickable object was clicked (the one that contains the intersected mesh)
    const clickedMesh = intersects[0].object;
    const clicked = clickableObjects.find(({ object }) =>
      object.children.includes(clickedMesh) || object === clickedMesh || object.getObjectById(clickedMesh.id)
    );

    if (clicked) {
      window.open(clicked.url, '_blank'); // open in new tab
    }
  }
});



// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xfcfcfc, 1.5)
gui.add(ambientLight, 'intensity', 0, 3).name('Ambient Light')

const hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x6AB8C5, 2.0)
hemiLight.position.set(0, 20, 0)
scene.add(hemiLight)

const pointLight = new THREE.PointLight(0xfcfcfc, 5, 100)
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
const custardPuddle1 = createCustardPuddle(5, -5.1)
const custardPuddle2 = createCustardPuddle(4, -4.6)
const custardPuddle3 = createCustardPuddle(7, -5.5)

scene.add(custardPuddle1, custardPuddle2, custardPuddle3)

 
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


function createFloatingText(message: string): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(255, 255, 255, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(6, 1.5);
  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(0, 5.5, 0); // Floating position
  return plane;
}

const floatingText = createFloatingText('Find secret objects to view other bedrooms!');
scene.add(floatingText);
floatingText.lookAt(camera.position);


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

