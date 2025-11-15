'use client'

import { useState } from 'react'
import { useGame } from '@/contexts/game-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import FarmingUI from './farming-ui'
import BuildingUI from './building-ui'
import QuestsUI from './quests-ui'
import LeaderboardUI from './leaderboard-ui'
import InventoryUI from './inventory-ui'

export default function GameUI({
  language,
  onLanguageChange,
}: {
  language: 'en' | 'hi'
  onLanguageChange: (lang: 'en' | 'hi') => void
}) {
  const { gameState } = useGame()
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const t = {
    en: {
      coins: 'Coins',
      level: 'Level',
      exp: 'XP',
    },
    hi: {
      coins: 'सिक्के',
      level: 'स्तर',
      exp: 'अनुभव',
    },
  }

  const translations = t[language]

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top-left: Stats */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Card className="bg-black/70 border-green-500 p-4 text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">💰</span>
            <span className="font-bold text-sm">
              {translations.coins}: {gameState.coins}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xl">⭐</span>
            <span className="font-bold text-sm">
              {translations.level}: {gameState.level}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-xl">✨</span>
            <span className="font-bold text-sm">
              {translations.exp}: {Math.floor(gameState.experience % 1000)}/1000
            </span>
          </div>
        </Card>
      </div>

      {/* Top-right: Language toggle */}
      <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
        <Button
          variant={language === 'en' ? 'default' : 'outline'}
          onClick={() => onLanguageChange('en')}
          className="text-xs"
        >
          EN
        </Button>
        <Button
          variant={language === 'hi' ? 'default' : 'outline'}
          onClick={() => onLanguageChange('hi')}
          className="text-xs"
        >
          HI
        </Button>
      </div>

      {/* Right sidebar: Quests, Leaderboard, Inventory */}
      <QuestsUI language={language} />
      <LeaderboardUI
        language={language}
        playerLevel={gameState.level}
        playerCoins={gameState.coins}
      />
      <InventoryUI language={language} />

      {/* Farming UI for selected field */}
      <FarmingUI selectedFieldId={selectedFieldId} language={language} />

      {/* Building UI */}
      <BuildingUI language={language} />
    </div>
  )
}
