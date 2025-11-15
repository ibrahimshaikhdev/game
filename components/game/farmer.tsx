'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FarmerProps {
  onPositionChange?: (position: THREE.Vector3) => void
}

export default function Farmer({ onPositionChange }: FarmerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  )
  const [swipeDirection, setSwipeDirection] = useState<{
    x: number
    z: number
  } | null>(null)
  const velocityRef = useRef(new THREE.Vector3())

  useEffect(() => {
    const keysPressed: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = true
      
      const moveSpeed = 0.15
      let moveX = 0
      let moveZ = 0

      if (keysPressed['arrowup'] || keysPressed['w']) moveZ = -1
      if (keysPressed['arrowdown'] || keysPressed['s']) moveZ = 1
      if (keysPressed['arrowleft'] || keysPressed['a']) moveX = -1
      if (keysPressed['arrowright'] || keysPressed['d']) moveX = 1

      if (moveX !== 0 || moveZ !== 0) {
        const magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ)
        setSwipeDirection({
          x: (moveX / magnitude) * moveSpeed,
          z: (moveZ / magnitude) * moveSpeed,
        })
      } else {
        setSwipeDirection(null)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setTouchStart({ x: touch.clientX, y: touch.clientY })
      }
    }

    const handleTouchEnd = () => {
      setTouchStart(null)
      setSwipeDirection(null)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart || !e.touches.length) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      if (magnitude > 10) {
        setSwipeDirection({
          x: (deltaX / magnitude) * 0.15,
          z: (deltaY / magnitude) * 0.15,
        })
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [touchStart])

  useFrame(() => {
    if (!groupRef.current) return

    const moveSpeed = 0.15
    if (swipeDirection) {
      velocityRef.current.x = swipeDirection.x * moveSpeed
      velocityRef.current.z = swipeDirection.z * moveSpeed
    } else {
      velocityRef.current.multiplyScalar(0.85)
    }

    groupRef.current.position.add(velocityRef.current)

    groupRef.current.position.x = Math.max(
      -500,
      Math.min(500, groupRef.current.position.x)
    )
    groupRef.current.position.z = Math.max(
      -500,
      Math.min(500, groupRef.current.position.z)
    )

    onPositionChange?.(groupRef.current.position)

    if (velocityRef.current.length() > 0.01) {
      const angle = Math.atan2(
        velocityRef.current.x,
        velocityRef.current.z
      )
      groupRef.current.rotation.y = angle
    }

    const bobOffset = Math.sin(Date.now() * 0.008) * 0.15
    if (groupRef.current.children[0]) {
      groupRef.current.children[0].position.y = bobOffset
    }
  })

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 2, 4, 8]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>

      {/* Hat */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[0.5, 0.4, 32]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}
