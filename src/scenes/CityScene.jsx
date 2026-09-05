import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

function Building({ position, size, color }) {
  return (
    <mesh position={[position[0], size[1] / 2, position[2]]} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

function CitySkyline() {
  // Generate a randomized but stable skyline once, not on every render
  const buildings = useMemo(() => {
    const arr = []
    const colors = ['#1e293b', '#334155', '#0f172a', '#1e3a5f']
    for (let i = -8; i <= 8; i++) {
      const height = 1.5 + Math.abs(Math.sin(i * 1.3)) * 4
      const width = 1.1
      arr.push({
        position: [i * 1.6, 0, -8],
        size: [width, height, width],
        color: colors[Math.abs(i) % colors.length],
      })
    }
    return arr
  }, [])

  return (
    <>
      {buildings.map((b, i) => (
        <Building key={i} {...b} />
      ))}
    </>
  )
}

function StreetLines() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[0.15, 40]} />
      <meshStandardMaterial color="#facc15" />
    </mesh>
  )
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 40]} />
      <meshStandardMaterial color="#27272a" roughness={0.95} />
    </mesh>
  )
}

function SpeedingCar() {
  const carRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Speeds straight down the road, looping
    carRef.current.position.z = 10 - ((t * 5) % 20)
  })

  return (
    <group ref={carRef} position={[1.2, 0.3, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.4, 2]} />
        <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Taillights - visible since we're behind the car */}
      <mesh position={[-0.35, 0, 1.01]}>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.35, 0, 1.01]}>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

export default function CityScene() {
  return (
    <group>
      <Road />
      <StreetLines />
      <CitySkyline />
      <SpeedingCar />
    </group>
  )
}