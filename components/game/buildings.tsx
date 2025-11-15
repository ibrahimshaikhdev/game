'use client'

import { BuildingData } from '@/contexts/game-context'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface BuildingsProps {
  buildings: BuildingData[]
  onBuildingSelected?: (buildingId: string) => void
}

export default function Buildings({
  buildings,
  onBuildingSelected,
}: BuildingsProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  )

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuildingId(buildingId)
    onBuildingSelected?.(buildingId)
  }

  return (
    <group>
      {buildings.map((building) => (
        <Building
          key={building.id}
          building={building}
          isSelected={selectedBuildingId === building.id}
          onSelect={() => handleBuildingSelect(building.id)}
        />
      ))}
    </group>
  )
}

interface BuildingProps {
  building: BuildingData
  isSelected: boolean
  onSelect: () => void
}

function Building({ building, isSelected, onSelect }: BuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current && (isSelected || hovered)) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.15
    } else if (groupRef.current) {
      groupRef.current.position.y = 0
    }
  })

  const getBuildingColor = (type: string) => {
    const colors: Record<string, string> = {
      house: '#d4a574',
      barn: '#a0522d',
      silo: '#808080',
      garage: '#696969',
      pen: '#8b7355',
    }
    return colors[type] || '#808080'
  }

  const getBuildingSize = (type: string): [number, number, number] => {
    const sizes: Record<string, [number, number, number]> = {
      house: [4, 4, 4],
      barn: [6, 5, 6],
      silo: [2, 6, 2],
      garage: [5, 3, 5],
      pen: [4, 1.5, 4],
    }
    return sizes[type] || [3, 3, 3]
  }

  const size = getBuildingSize(building.type)
  const buildProgress = building.buildProgress / building.buildTime

  return (
    <group
      ref={groupRef}
      position={[building.x, 0, building.z]}
      onClick={onSelect}
    >
      <mesh
        ref={meshRef}
        position={[0, size[1] / 2, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={getBuildingColor(building.type)}
          metalness={0.2}
          roughness={0.7}
          emissive={isSelected ? '#ffaa00' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Construction progress bar */}
      {building.buildProgress < building.buildTime && (
        <group position={[0, size[1] + 1, 0]}>
          {/* Background */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[6, 0.3, 0.2]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          {/* Progress fill */}
          <mesh position={[-(3 - 3 * buildProgress), 0, 0.1]}>
            <boxGeometry args={[6 * buildProgress, 0.3, 0.2]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" />
          </mesh>
        </group>
      )}

      {/* Completed indicator */}
      {building.buildProgress >= building.buildTime && (
        <mesh position={[0, size[1] + 1, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00aa00"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Roof/decorative top for house */}
      {building.type === 'house' && (
        <mesh position={[0, size[1], 0]} castShadow>
          <coneGeometry args={[size[0] * 0.7, 2, 4]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      )}

      {/* Top indicator for silo */}
      {building.type === 'silo' && (
        <mesh position={[0, size[1], 0]} castShadow>
          <coneGeometry args={[size[0] * 1.2, 1, 32]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
      )}
    </group>
  )
}
