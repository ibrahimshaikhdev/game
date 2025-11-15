'use client'

import { useState, useEffect } from 'react'
import { useGame } from '@/contexts/game-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FarmingUIProps {
  selectedFieldId: string | null
  language: 'en' | 'hi'
}

export default function FarmingUI({
  selectedFieldId,
  language,
}: FarmingUIProps) {
  const { gameState, plantCrop, harvestCrop, updateCoins, updateExperience } = useGame()
  const [showCropMenu, setShowCropMenu] = useState(false)

  const selectedField = selectedFieldId
    ? gameState.fields.find((f) => f.id === selectedFieldId)
    : null

  const t = {
    en: {
      selectField: 'Select a field to farm',
      plant: 'Plant',
      harvest: 'Harvest',
      wheat: 'Wheat',
      corn: 'Corn',
      rice: 'Rice',
      readyHarvest: 'Ready to harvest!',
      growing: 'Growing...',
      empty: 'Empty field',
    },
    hi: {
      selectField: 'खेत का चयन करें',
      plant: 'बीज बोएं',
      harvest: 'कटाई करें',
      wheat: 'गेहूं',
      corn: 'मकई',
      rice: 'चावल',
      readyHarvest: 'कटाई के लिए तैयार!',
      growing: 'बढ़ रहा है...',
      empty: 'खाली खेत',
    },
  }

  const translations = t[language]

  const handleHarvest = () => {
    if (selectedField) {
      const baseCoins = 100
      const levelBonus = gameState.level * 10
      const totalCoins = baseCoins + levelBonus
      updateCoins(totalCoins)
      updateExperience(50)
      harvestCrop(selectedField.id)
    }
  }

  if (!selectedField) {
    return (
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Card className="bg-black/80 border-green-500 p-4 text-white">
          <p className="text-center text-sm">{translations.selectField}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-auto">
      <Card className="bg-black/80 border-green-500 p-4 text-white min-w-64">
        <div className="mb-3">
          <p className="text-sm font-bold mb-1">Field Status:</p>
          <p className="text-xs text-gray-300">
            {!selectedField.planted
              ? translations.empty
              : selectedField.growthStage >= 2.8
                ? translations.readyHarvest
                : `${translations.growing} (${Math.round((selectedField.growthStage / 3) * 100)}%)`}
          </p>
        </div>

        {/* Plant or Harvest options */}
        {!selectedField.planted ? (
          <div>
            {!showCropMenu ? (
              <Button
                onClick={() => setShowCropMenu(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white mb-2"
              >
                {translations.plant}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    plantCrop(selectedField.id, 'wheat')
                    setShowCropMenu(false)
                  }}
                  variant="outline"
                  className="w-full text-xs"
                >
                  {translations.wheat}
                </Button>
                <Button
                  onClick={() => {
                    plantCrop(selectedField.id, 'corn')
                    setShowCropMenu(false)
                  }}
                  variant="outline"
                  className="w-full text-xs"
                >
                  {translations.corn}
                </Button>
                <Button
                  onClick={() => {
                    plantCrop(selectedField.id, 'rice')
                    setShowCropMenu(false)
                  }}
                  variant="outline"
                  className="w-full text-xs"
                >
                  {translations.rice}
                </Button>
                <Button
                  onClick={() => setShowCropMenu(false)}
                  variant="destructive"
                  className="w-full text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ) : selectedField.growthStage >= 2.8 ? (
          <Button
            onClick={handleHarvest}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {translations.harvest}
          </Button>
        ) : (
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{
                width: `${(selectedField.growthStage / 3) * 100}%`,
              }}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
