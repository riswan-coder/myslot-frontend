import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Wheel({ position }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.35, 0.35, 0.3, 24]} />
      <meshStandardMaterial color="#111827" roughness={0.6} />
    </mesh>
  )
}

function CarBody() {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Lower chassis */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.2, 0.4, 1]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.2, 0.35, 0]} castShadow>
        <boxGeometry args={[1.1, 0.35, 0.85]} />
        <meshStandardMaterial color="#7f1d1d" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Wheels */}
      <Wheel position={[0.75, -0.35, 0.55]} />
      <Wheel position={[0.75, -0.35, -0.55]} />
      <Wheel position={[-0.75, -0.35, 0.55]} />
      <Wheel position={[-0.75, -0.35, -0.55]} />
      {/* Headlights */}
      <mesh position={[1.11, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[1.11, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.15]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 6]} />
      <meshStandardMaterial color="#1f2937" roughness={0.9} />
    </mesh>
  )
}

export default function CarScene() {
  const carRef = useRef()

  useFrame((state) => {
    // Gentle forward-back drift + slight bob, purely visual, no physics
    const t = state.clock.getElapsedTime()
    carRef.current.position.x = Math.sin(t * 0.5) * 3
    carRef.current.position.y = Math.abs(Math.sin(t * 3)) * 0.03
  })

  return (
    <group>
      <Road />
      <group ref={carRef}>
        <CarBody />
      </group>
    </group>
  )
}