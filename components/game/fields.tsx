'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { FieldData } from '@/contexts/game-context'
import { useGame } from '@/contexts/game-context'

interface FieldsProps {
  fields: FieldData[]
  onFieldSelected?: (fieldId: string) => void
}

export default function Fields({ fields, onFieldSelected }: FieldsProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId)
    onFieldSelected?.(fieldId)
  }

  return (
    <group>
      {fields.map((field) => (
        <Field
          key={field.id}
          field={field}
          isSelected={selectedFieldId === field.id}
          onSelect={() => handleFieldSelect(field.id)}
        />
      ))}
    </group>
  )
}

interface FieldProps {
  field: FieldData
  isSelected: boolean
  onSelect: () => void
}

function Field({ field, isSelected, onSelect }: FieldProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current && (isSelected || hovered)) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.1
    } else if (groupRef.current) {
      groupRef.current.position.y = 0
    }
  })

  return (
    <group ref={groupRef} position={[field.x, 0.05, field.z]}>
      {/* Field ground */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onSelect}
      >
        <boxGeometry args={[6, 0.1, 6]} />
        <meshStandardMaterial
          color={
            isSelected
              ? '#ffd700'
              : field.planted
                ? '#8b7355'
                : '#a0826d'
          }
          metalness={0}
          roughness={1}
          emissive={isSelected ? '#ffaa00' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Planted crop visualization with growth stages */}
      {field.planted && field.crop && (
        <group position={[0, 0.5, 0]}>
          {Array.from({ length: Math.ceil(12 * (field.growthStage / 3)) }).map(
            (_, i) => (
              <mesh
                key={i}
                position={[
                  (Math.random() - 0.5) * 5,
                  0,
                  (Math.random() - 0.5) * 5,
                ]}
              >
                <coneGeometry
                  args={[
                    0.2 + field.growthStage * 0.1,
                    0.5 + field.growthStage * 0.5,
                    8,
                  ]}
                />
                <meshStandardMaterial
                  color={
                    field.growthStage < 1
                      ? '#90ee90'
                      : field.growthStage < 2
                        ? '#7cb342'
                        : '#558b2f'
                  }
                  emissive={field.growthStage === 3 ? '#ffee00' : '#000000'}
                  emissiveIntensity={field.growthStage === 3 ? 0.2 : 0}
                />
              </mesh>
            )
          )}
        </group>
      )}

      {/* Ready to harvest indicator */}
      {field.planted && field.growthStage === 3 && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffaa00"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  )
}
