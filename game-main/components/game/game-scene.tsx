'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useGame } from '@/contexts/game-context'
import Terrain from './terrain'
import Farmer from './farmer'
import Fields from './fields'
import Buildings from './buildings'
import CameraController from './camera-controller'

export default function GameScene({
  onFieldSelected,
}: {
  onFieldSelected?: (fieldId: string | null) => void
}) {
  const { gameState, updateGameState } = useGame()
  const sceneRef = useRef<THREE.Scene | null>(null)
  const { scene } = useThree()
  const timeRef = useRef(0)
  const [farmerPosition, setFarmerPosition] = useState(new THREE.Vector3(0, 1, 0))

  useEffect(() => {
    sceneRef.current = scene
  }, [scene])

  // Day/night cycle and building progression
  useFrame((state) => {
    timeRef.current += 0.0005

    const dayNightCycle = Math.sin(timeRef.current * Math.PI) * 0.5 + 0.5
    const skyColor = new THREE.Color().lerpHSL(
      new THREE.Color(0x1a1a2e),
      new THREE.Color(0x87ceeb),
      dayNightCycle
    )

    scene.background = skyColor

    const ambientLight = scene.children.find(
      (child) => child instanceof THREE.Light && child.type === 'AmbientLight'
    )
    if (ambientLight && ambientLight instanceof THREE.Light) {
      ambientLight.intensity = 0.4 + dayNightCycle * 0.6
    }

    if (Math.random() < 0.01) {
      const weathers = ['sunny', 'rainy', 'cloudy'] as const
      updateGameState({ weather: weathers[Math.floor(Math.random() * 3)] })
    }

    updateGameState({ currentTime: dayNightCycle })

    if (Math.random() < 0.02) {
      updateGameState({
        buildings: gameState.buildings.map((b) => ({
          ...b,
          buildProgress: Math.min(b.buildTime, b.buildProgress + 5),
        })),
      })
    }
  })

  useEffect(() => {
    const cropGrowthInterval = setInterval(() => {
      updateGameState({
        fields: gameState.fields.map((field) => {
          if (field.planted && field.growthStage < 3) {
            return {
              ...field,
              growthStage: Math.min(3, field.growthStage + 0.5),
            }
          }
          return field
        }),
      })
    }, 10000)

    return () => clearInterval(cropGrowthInterval)
  }, [gameState.fields, updateGameState])

  return (
    <group>
      <CameraController targetPosition={farmerPosition} />
      <Terrain />
      <Fields
        fields={gameState.fields}
        onFieldSelected={onFieldSelected}
      />
      <Buildings buildings={gameState.buildings} />
      <Farmer onPositionChange={setFarmerPosition} />
      {gameState.weather === 'rainy' && <RainEffect />}
    </group>
  )
}

function RainEffect() {
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = 1000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesRef.current.geometry.dispose()
    particlesRef.current.geometry = geometry
  }, [])

  useFrame(() => {
    if (!particlesRef.current) return
    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.5
      if (positions[i + 1] < 0) {
        positions[i + 1] = 100
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial color="#6b7280" size={0.2} opacity={0.6} transparent />
    </points>
  )
}
