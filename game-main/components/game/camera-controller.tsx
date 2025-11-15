'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface CameraControllerProps {
  targetPosition: THREE.Vector3
}

export default function CameraController({
  targetPosition,
}: CameraControllerProps) {
  const { camera } = useThree()
  const cameraOffsetRef = useRef(new THREE.Vector3(0, 20, 30))
  const targetLookRef = useRef(new THREE.Vector3(0, 0, 0))
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoom((prev) => Math.max(0.5, Math.min(3, prev + e.deltaY * 0.001)))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useFrame(() => {
    // Smooth camera follow
    const desiredOffset = new THREE.Vector3(0, 20, 30).multiplyScalar(zoom)
    cameraOffsetRef.current.lerp(desiredOffset, 0.1)

    const targetCameraPos = targetPosition.clone().add(cameraOffsetRef.current)
    camera.position.lerp(targetCameraPos, 0.15)

    // Look at farmer with slight offset
    targetLookRef.current.lerp(
      targetPosition.clone().add(new THREE.Vector3(0, 2, 0)),
      0.1
    )
    camera.lookAt(targetLookRef.current)
  })

  return null
}
