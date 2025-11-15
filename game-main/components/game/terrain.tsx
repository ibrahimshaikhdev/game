'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    const geometry = new THREE.PlaneGeometry(500, 500, 256, 256)
    const positionAttribute = geometry.getAttribute('position')
    const positions = positionAttribute.array as Float32Array

    // Multi-layer noise for natural terrain
    const noiseFunction = (x: number, z: number) => {
      let noise = 0
      let amplitude = 1
      let frequency = 1
      let maxValue = 0

      for (let i = 0; i < 4; i++) {
        noise +=
          amplitude *
          Math.sin((x * frequency) * 0.005) *
          Math.cos((z * frequency) * 0.005)
        maxValue += amplitude
        amplitude *= 0.5
        frequency *= 2
      }

      return noise / maxValue
    }

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const z = positions[i + 2]
      const height = noiseFunction(x, z) * 5
      positions[i + 1] = height
    }

    positionAttribute.needsUpdate = true
    geometry.computeVertexNormals()

    meshRef.current.receiveShadow = true
    meshRef.current.castShadow = true
  }, [])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[500, 500, 256, 256]} />
      <meshStandardMaterial
        color="#2d5016"
        metalness={0.1}
        roughness={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
