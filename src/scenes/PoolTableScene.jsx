function Table() {
  return (
    <group>
      {/* Table surface (felt) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[6, 3.5]} />
        <meshStandardMaterial
          color="#0b5c33"
          roughness={0.9}
        />
      </mesh>

      {/* Table rails (wooden border) */}
      <mesh
        position={[0, 0.05, -1.85]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6.3, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#3b2418"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      <mesh
        position={[0, 0.05, 1.85]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[6.3, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#3b2418"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      <mesh
        position={[-3.15, 0.05, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.2, 0.2, 3.7]} />
        <meshStandardMaterial
          color="#3b2418"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      <mesh
        position={[3.15, 0.05, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.2, 0.2, 3.7]} />
        <meshStandardMaterial
          color="#3b2418"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

function Ball({ position, color }) {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.12, 32, 32]} />

      <meshStandardMaterial
        color={color}
        roughness={0.15}
        metalness={0.05}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

function BallRack() {
  // Triangle rack formation — rows of 1, 2, 3, 4, 5 balls
  const colors = [
    '#f6c90e',
    '#1e3a8a',
    '#b91c1c',
    '#7c3aed',
    '#111827',
    '#f97316',
    '#065f46',
    '#facc15',
    '#dc2626',
    '#2563eb',
    '#166534',
    '#f59e0b',
    '#4c1d95',
    '#78350f',
    '#e11d48',
  ]

  const balls = []
  let colorIndex = 0
  const spacing = 0.26

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = 1.5 + row * spacing * 0.85
      const z = (col - row / 2) * spacing

      balls.push(
        <Ball
          key={`${row}-${col}`}
          position={[x, 0.12, z]}
          color={colors[colorIndex % colors.length]}
        />
      )

      colorIndex++
    }
  }

  return <>{balls}</>
}

export default function PoolTableScene() {
  return (
    <group>
      <Table />

      <BallRack />

      {/* Cue ball */}
      <Ball
        position={[-1.5, 0.12, 0]}
        color="#ffffff"
      />
    </group>
  )
}