'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LeaderboardUIProps {
  language: 'en' | 'hi'
  playerLevel: number
  playerCoins: number
}

export default function LeaderboardUI({
  language,
  playerLevel,
  playerCoins,
}: LeaderboardUIProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'us'>('global')

  const t = {
    en: {
      leaderboard: 'Leaderboard',
      global: 'Global',
      us: 'US Only',
      rank: 'Rank',
      player: 'Player',
      level: 'Level',
      coins: 'Coins',
      youAreHere: 'You are here',
    },
    hi: {
      leaderboard: 'लीडरबोर्ड',
      global: 'वैश्विक',
      us: 'केवल यूएस',
      rank: 'रैंक',
      player: 'खिलाड़ी',
      level: 'स्तर',
      coins: 'सिक्के',
      youAreHere: 'आप यहाँ हैं',
    },
  }

  const translations = t[language]

  const leaderboardData = [
    { rank: 1, name: 'FarmMaster99', level: 45, coins: 50000 },
    { rank: 2, name: 'HarvestKing', level: 42, coins: 48000 },
    { rank: 3, name: 'TycoonFarmer', level: 40, coins: 45000 },
    { rank: 4, name: 'GreenThumb', level: 38, coins: 42000 },
    { rank: 5, name: 'CropChampion', level: 35, coins: 40000 },
    {
      rank: 156,
      name: 'You',
      level: playerLevel,
      coins: playerCoins,
      isPlayer: true,
    },
  ]

  return (
    <>
      <div className="absolute top-32 right-4 pointer-events-auto">
        <Button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold"
        >
          {translations.leaderboard}
        </Button>
      </div>

      {showLeaderboard && (
        <div className="absolute top-44 right-4 pointer-events-auto max-w-sm">
          <Card className="bg-black/80 border-blue-500 p-4">
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                <Button
                  onClick={() => setLeaderboardType('global')}
                  variant={
                    leaderboardType === 'global' ? 'default' : 'outline'
                  }
                  size="sm"
                  className="text-xs"
                >
                  {translations.global}
                </Button>
                <Button
                  onClick={() => setLeaderboardType('us')}
                  variant={leaderboardType === 'us' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  {translations.us}
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {leaderboardData.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex justify-between items-center p-2 rounded ${
                      entry.isPlayer
                        ? 'bg-yellow-900/50 border border-yellow-500'
                        : 'bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-white text-xs">
                      <span className="font-bold w-6">#{entry.rank}</span>
                      <span className="font-bold">{entry.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-blue-400">L{entry.level}</span>
                      <span className="text-yellow-400">{entry.coins}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
