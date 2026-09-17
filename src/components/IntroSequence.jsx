import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import PoolTableScene from '../scenes/PoolTableScene'
import CarScene from '../scenes/CarScene'
import FootballScene from '../scenes/FootballScene'
import CityScene from '../scenes/CityScene'

const scenes = [
  { id: 'pool', label: 'Billiards', Scene: PoolTableScene, camera: [0, 4, 5] },
  { id: 'racing', label: 'Racing', Scene: CarScene, camera: [0, 3, 8] },
  { id: 'football', label: 'Sports', Scene: FootballScene, camera: [0, 5, 9] },
  { id: 'city', label: 'Open World', Scene: CityScene, camera: [4, 4, 10] },
]

const SCENE_DURATION = 2800 // ms per scene

export default function IntroSequence({ onComplete }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= scenes.length) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), SCENE_DURATION)
    return () => clearTimeout(timer)
  }, [index, onComplete])

  if (index >= scenes.length) return null

  const current = scenes[index]

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Canvas camera={{ position: current.camera, fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            {current.id === 'city' && <fog attach="fog" args={['#000000', 8, 25]} />}
            <current.Scene />
          </Canvas>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-10 left-0 right-0 text-center text-white text-xl tracking-widest uppercase"
          >
            {current.label}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-white/60 hover:text-white text-sm tracking-wide"
      >
        Skip →
      </button>
    </div>
  )
}