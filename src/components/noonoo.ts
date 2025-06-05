import * as THREE from 'three'

export function createNooNoo(scene: THREE.Scene): THREE.Group {
  const nooNoo = new THREE.Group()

  // Body: horizontal cylinder
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32),
    new THREE.MeshStandardMaterial({ color: 0x3d8ec9 })
  )
  body.rotation.z = Math.PI / 2
  body.position.y = 0.5
  nooNoo.add(body)

  // Base platform
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.2, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  )
  base.position.y = 0.1
  nooNoo.add(base)

  // Hose: coming out of cylinder's flat front
  const hose = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16, 4, true),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
  )
  hose.rotation.z = Math.PI / 2
  hose.position.set(0.6, 0.5, 0) // aligned with cylinder end
  nooNoo.add(hose)

  // Nozzle
  const nozzle = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.04, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  )
  nozzle.rotation.y = Math.PI / 2
  nozzle.position.set(1.05, 0.5, 0)
  nooNoo.add(nozzle)

  // Eyes (on front face of cylinder)
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), eyeMaterial)
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), eyeMaterial)

  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pupilMaterial)
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), pupilMaterial)

  leftEye.position.set(0.6, 1.0, -0.15)
  rightEye.position.set(0.6, 1.0, 0.15)
  leftPupil.position.set(0.7, 1.0, -0.15)
  rightPupil.position.set(0.7, 1.0, 0.15)

  nooNoo.add(leftEye, rightEye, leftPupil, rightPupil)

  // Brush on top
  const brush = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  )
  brush.position.set(0, 1.15, 0.0)
  nooNoo.add(brush)

  // Position Noo-Noo
  nooNoo.position.set(-4, 0, 2)
  scene.add(nooNoo)

  return nooNoo
}