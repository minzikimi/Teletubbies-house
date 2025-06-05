import * as THREE from 'three'

export function createTeletubbies(scene: THREE.Scene): THREE.Group[] {
  const teletubbyHeights = [1.0, 1.2, 1.1, 1.3]
  const teletubbyAntennaTypes = ['circle', 'stick', 'curve', 'triangle']
const teletubbyColors = [
  0xff4d4d, 
  0x66cc66,
  0xffe066, 
  0xb266ff 
]

  const teletubbyPositions = [
    [-2, 0, -3],
    [2, 0, 3.5],
    [0.7, 0, -3.5],
    [5, 0, -3]
  ]

  const teletubbies: THREE.Group[] = []

  for (let i = 0; i < 4; i++) {
    const group = new THREE.Group()
    group.position.set(...teletubbyPositions[i])
    group.scale.setScalar(teletubbyHeights[i])
    teletubbies.push(group)
    scene.add(group)

    const color = teletubbyColors[i]

    // Body
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 24),
      new THREE.MeshStandardMaterial({ color })
    )
    body.position.set(0, 0.42, 0)
    group.add(body)

    // TV Screen
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.35, 0.25),
      new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('/tele.jpg'),
        emissive: 0x000000
      })
    )
    screen.position.set(0, 0.5, 0.48)
    group.add(screen)

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      new THREE.MeshStandardMaterial({ color })
    )
    head.position.set(0, 0.82, 0)
    group.add(head)

    // Face
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 16),
      // new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    face.position.set(0, 0.85, 0.22)
    group.add(face)

    // Eyes
    const eyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    )
    eyeL.position.set(-0.04, 0.88, 0.28)
    group.add(eyeL)

    const eyeR = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    )
    eyeR.position.set(0.04, 0.88, 0.28)
    group.add(eyeR)

    // Smile
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.007, 8, 24, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    )
    smile.position.set(0, 0.84, 0.29)
    smile.rotation.x = Math.PI / 2
    group.add(smile)

    // Arms
    const armL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.32, 12),
      new THREE.MeshStandardMaterial({ color })
    )
    armL.position.set(-0.19, 0.52, 0)
    armL.rotation.z = Math.PI / 3
    group.add(armL)

    const armR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.32, 12),
      new THREE.MeshStandardMaterial({ color })
    )
    armR.position.set(0.19, 0.52, 0)
    armR.rotation.z = -Math.PI / 3
    group.add(armR)

    // Legs
    const legL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12),
      new THREE.MeshStandardMaterial({ color })
    )
    legL.position.set(-0.08, 0.19, 0)
    group.add(legL)

    const legR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12),
      new THREE.MeshStandardMaterial({ color })
    )
    legR.position.set(0.08, 0.19, 0)
    group.add(legR)

    // Antenna
    let antenna: THREE.Mesh
    switch (teletubbyAntennaTypes[i]) {
      case 'circle':
        antenna = new THREE.Mesh(
          new THREE.TorusGeometry(0.08, 0.01, 8, 16),
          new THREE.MeshStandardMaterial({ color })
        )
        antenna.position.set(0, 1.15, 0)
        break

      case 'stick':
        antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.3, 12),
          new THREE.MeshStandardMaterial({ color })
        )
        antenna.position.set(0, 1.2, 0)
        break

      case 'curve':
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0.05, 0.1, 0),
          new THREE.Vector3(0, 0.2, 0)
        ])
        const tube = new THREE.TubeGeometry(curve, 20, 0.02, 8, false)
        antenna = new THREE.Mesh(
          tube,
          new THREE.MeshStandardMaterial({ color })
        )
        antenna.position.set(0, 1.1, 0)
        break

      case 'triangle':
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.lineTo(0.1, 0.2)
        shape.lineTo(-0.1, 0.2)
        shape.lineTo(0, 0)
        const geometry = new THREE.ShapeGeometry(shape)
        antenna = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({ color })
        )
        antenna.position.set(0, 1.15, 0)
        antenna.rotation.x = -Math.PI / 2
        break
    }

    group.add(antenna)
  }

  return teletubbies
}

