import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Pitch() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshStandardMaterial color="#166534" roughness={0.9} />
    </mesh>
  )
}

function PitchLines() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Center circle (thin ring) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.5, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Halfway line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.05, 14]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  )
}

function Goal({ position }) {
  const postMat = <meshStandardMaterial color="white" />
  return (
    <group position={position}>
      <mesh position={[-1, 0.6, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        {postMat}
      </mesh>
      <mesh position={[1, 0.6, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        {postMat}
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.08, 0.08, 0.08]} />
        {postMat}
      </mesh>
    </group>
  )
}

function Ball() {
  const ballRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Rolls toward the goal, loops back, with a bounce (abs-sine) for height
    const progress = (t * 0.6) % 6
    ballRef.current.position.z = 4 - progress
    ballRef.current.position.y = 0.15 + Math.abs(Math.sin(t * 4)) * 0.25
    ballRef.current.rotation.x = t * 4 // rolling spin
  })

  return (
    <mesh ref={ballRef} castShadow>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial color="white" roughness={0.4} />
    </mesh>
  )
}

export default function FootballScene() {
  return (
    <group>
      <Pitch />
      <PitchLines />
      <Goal position={[0, 0, -5]} />
      <Ball />
    </group>
  )
}