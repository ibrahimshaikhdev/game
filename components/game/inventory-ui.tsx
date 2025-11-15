'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/game-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface InventoryUIProps {
  language: 'en' | 'hi'
}

export default function InventoryUI({ language }: InventoryUIProps) {
  const { gameState } = useGame()
  const [showInventory, setShowInventory] = useState(false)

  const t = {
    en: {
      inventory: 'Inventory',
      wheat: 'Wheat',
      corn: 'Corn',
      rice: 'Rice',
      empty: 'No items',
    },
    hi: {
      inventory: 'सामग्री',
      wheat: 'गेहूं',
      corn: 'मकई',
      rice: 'चावल',
      empty: 'कोई वस्तु नहीं',
    },
  }

  const translations = t[language]

  const items = [
    { id: 'wheat', label: translations.wheat, emoji: '🌾' },
    { id: 'corn', label: translations.corn, emoji: '🌽' },
    { id: 'rice', label: translations.rice, emoji: '🍚' },
  ]

  return (
    <>
      <div className="absolute bottom-24 right-4 pointer-events-auto">
        <Button
          onClick={() => setShowInventory(!showInventory)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-bold"
        >
          {translations.inventory}
        </Button>
      </div>

      {showInventory && (
        <div className="absolute bottom-40 right-4 pointer-events-auto">
          <Card className="bg-black/80 border-orange-500 p-4 max-w-xs">
            <h3 className="text-white font-bold mb-3 text-sm">
              {translations.inventory}
            </h3>

            <div className="space-y-2">
              {items.map((item) => {
                const count = gameState.inventory[item.id] || 0
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800 p-2 rounded text-sm"
                  >
                    <span className="text-white">
                      {item.emoji} {item.label}
                    </span>
                    <span className="text-yellow-400 font-bold">x{count}</span>
                  </div>
                )
              })}
            </div>

            {Object.values(gameState.inventory).every((v) => !v) && (
              <p className="text-gray-400 text-xs text-center mt-3">
                {translations.empty}
              </p>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
