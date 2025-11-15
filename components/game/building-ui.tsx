'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/game-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdModal from './ad-modal'

interface BuildingUIProps {
  language: 'en' | 'hi'
  onBuildingPlaced?: () => void
}

export default function BuildingUI({
  language,
  onBuildingPlaced,
}: BuildingUIProps) {
  const { gameState, addBuilding, updateGameState, deductCoins, addAdReward } = useGame()
  const [showBuildMenu, setShowBuildMenu] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingBuildType, setPendingBuildType] = useState<
    'house' | 'barn' | 'silo' | 'garage' | 'pen' | null
  >(null)

  const buildingCosts: Record<string, number> = {
    house: 500,
    barn: 300,
    silo: 200,
    garage: 400,
    pen: 150,
  }

  const t = {
    en: {
      house: 'House',
      barn: 'Barn',
      silo: 'Silo',
      garage: 'Garage',
      pen: 'Animal Pen',
      cost: 'Cost',
      build: 'Build',
      cancel: 'Cancel',
      insufficient: 'Insufficient coins',
      buildTime: '10 min',
      watchAd: 'Watch Ad for Coins',
    },
    hi: {
      house: 'घर',
      barn: 'खलिहान',
      silo: 'गोदाम',
      garage: 'गैरेज',
      pen: 'पशु पेन',
      cost: 'कीमत',
      build: 'निर्माण',
      cancel: 'रद्द करें',
      insufficient: 'अपर्याप्त सिक्के',
      buildTime: '10 मिनट',
      watchAd: 'सिक्के के लिए विज्ञापन देखें',
    },
  }

  const translations = t[language]

  const handleBuildClick = (type: 'house' | 'barn' | 'silo' | 'garage' | 'pen') => {
    const cost = buildingCosts[type]
    if (gameState.coins < cost) {
      alert(translations.insufficient)
      return
    }
    
    const randomX = (Math.random() - 0.5) * 200
    const randomZ = (Math.random() - 0.5) * 200
    const newBuilding = {
      id: `building-${Date.now()}`,
      type,
      x: randomX,
      z: randomZ,
      level: 1,
      buildTime: 600,
      buildProgress: 0,
    }
    
    if (deductCoins(cost)) {
      addBuilding(newBuilding)
      onBuildingPlaced?.()
    }
  }

  const handleAdWatched = () => {
    if (pendingBuildType) {
      addAdReward(100)
      setShowAdModal(false)
      setPendingBuildType(null)
    }
  }

  const handleOptionalAdClick = (type: 'house' | 'barn' | 'silo' | 'garage' | 'pen') => {
    setPendingBuildType(type)
    setShowAdModal(true)
  }

  const buildings = [
    { type: 'house' as const, label: translations.house },
    { type: 'barn' as const, label: translations.barn },
    { type: 'silo' as const, label: translations.silo },
    { type: 'garage' as const, label: translations.garage },
    { type: 'pen' as const, label: translations.pen },
  ]

  return (
    <>
      {/* Build menu button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        {!showBuildMenu ? (
          <Button
            onClick={() => setShowBuildMenu(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg font-bold"
          >
            Build
          </Button>
        ) : (
          <Card className="bg-black/80 border-amber-500 p-4">
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {buildings.map((building) => (
                <div key={building.type} className="space-y-1">
                  <Button
                    onClick={() => handleBuildClick(building.type)}
                    variant="outline"
                    className="w-full text-xs"
                  >
                    {building.label}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    {translations.cost}: {buildingCosts[building.type]}
                  </p>
                  <Button
                    onClick={() => handleOptionalAdClick(building.type)}
                    variant="default"
                    className="w-full text-xs"
                  >
                    {translations.watchAd}
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => setShowBuildMenu(false)}
                variant="destructive"
                className="col-span-2 text-xs"
              >
                {translations.cancel}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Ad Modal for building speed-up */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => {
          setShowAdModal(false)
          setPendingBuildType(null)
        }}
        onAdWatched={handleAdWatched}
        language={language}
      />
    </>
  )
}
