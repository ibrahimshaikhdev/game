'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface FieldData {
  id: string
  x: number
  z: number
  planted: boolean
  crop: string | null
  growthStage: number
}

export interface GameState {
  coins: number
  experience: number
  level: number
  fields: FieldData[]
  buildings: Array<{
    id: string
    type: string
    x: number
    z: number
    constructionProgress: number
    completed: boolean
    placedAt: number
  }>
  inventory: {
    wheat: number
    corn: number
    rice: number
  }
  weather?: string
  currentTime?: number
}

export interface BuildingData {
  type: string
  x: number
  z: number
}

interface GameContextType {
  gameState: GameState
  updateCoins: (amount: number) => void
  updateExperience: (amount: number) => void
  plantCrop: (fieldId: string, cropType: string) => void
  harvestCrop: (fieldId: string) => void
  addBuilding: (building: BuildingData) => void
  updateGameState: (updates: Partial<GameState>) => void
  loadGame: () => void
  saveGame: () => void
  deductCoins: (amount: number) => boolean
  addAdReward: (amount: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const generateFieldPositions = (): FieldData[] => {
  const fields: FieldData[] = []
  const gridSize = 3
  const spacing = 10

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      fields.push({
        id: `field-${row}-${col}`,
        x: (col - 1) * spacing,
        z: (row - 1) * spacing,
        planted: false,
        crop: null,
        growthStage: 0,
      })
    }
  }
  return fields
}

const INITIAL_STATE: GameState = {
  coins: 1000,
  experience: 0,
  level: 1,
  fields: generateFieldPositions(),
  buildings: [],
  inventory: { wheat: 0, corn: 0, rice: 0 },
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)

  useEffect(() => {
    loadGame()
  }, [])

  useEffect(() => {
    const saveInterval = setInterval(saveGame, 30000)
    return () => clearInterval(saveInterval)
  }, [gameState])

  const loadGame = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmTycoonGameState')
      if (saved) {
        try {
          setGameState(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to load game state', e)
        }
      }
    }
  }

  const saveGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmTycoonGameState', JSON.stringify(gameState))
    }
  }

  const updateCoins = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount),
    }))
  }

  const updateExperience = (amount: number) => {
    setGameState((prev) => {
      const newExp = prev.experience + amount
      const newLevel = Math.floor(newExp / 1000) + 1
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
      }
    })
  }

  const plantCrop = (fieldId: string, cropType: string) => {
    setGameState((prev) => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, crop: cropType, planted: true } : field
      ),
    }))
  }

  const harvestCrop = (fieldId: string) => {
    const fieldIndex = gameState.fields.findIndex(field => field.id === fieldId)
    if (fieldIndex !== -1) {
      const field = gameState.fields[fieldIndex]
      if (field.crop) {
        const cropType = field.crop.toLowerCase()
        const rewardCoins = 100 + gameState.level * 10
        const rewardXp = 50

        setGameState((prev) => ({
          ...prev,
          coins: prev.coins + rewardCoins,
          experience: prev.experience + rewardXp,
          level: Math.floor((prev.experience + rewardXp) / 1000) + 1,
          fields: prev.fields.map((field, index) =>
            index === fieldIndex ? { ...field, crop: null, planted: false, growthStage: 0 } : field
          ),
          inventory: {
            ...prev.inventory,
            [cropType]: (prev.inventory[cropType as keyof typeof prev.inventory] || 0) + 1,
          },
        }))
      }
    }
  }

  const deductCoins = (amount: number): boolean => {
    if (gameState.coins >= amount) {
      updateCoins(-amount)
      return true
    }
    return false
  }

  const addAdReward = (amount: number) => {
    updateCoins(amount)
  }

  const addBuilding = (building: BuildingData) => {
    const buildingCosts: Record<string, number> = {
      House: 500,
      Barn: 300,
      Silo: 400,
      Garage: 350,
      'Animal Pen': 250,
    }

    const cost = buildingCosts[building.type] || 300

    if (deductCoins(cost)) {
      setGameState((prev) => ({
        ...prev,
        buildings: [
          ...prev.buildings,
          {
            id: `building-${Date.now()}`,
            type: building.type,
            x: building.x,
            z: building.z,
            constructionProgress: 0,
            completed: false,
            placedAt: Date.now(),
          },
        ],
      }))
    }
  }

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const value: GameContextType = {
    gameState,
    updateCoins,
    updateExperience,
    plantCrop,
    harvestCrop,
    addBuilding,
    updateGameState,
    loadGame,
    saveGame,
    deductCoins,
    addAdReward,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextType {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
