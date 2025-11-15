'use client'

import { useState } from 'react'
import { useQuests } from '@/contexts/quests-context'
import { useGame } from '@/contexts/game-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface QuestsUIProps {
  language: 'en' | 'hi'
}

export default function QuestsUI({ language }: QuestsUIProps) {
  const { quests, completeQuest } = useQuests()
  const { updateCoins, updateExperience } = useGame()
  const [showQuests, setShowQuests] = useState(false)

  const t = {
    en: {
      dailyQuests: 'Daily Quests',
      harvest: 'Harvest',
      build: 'Build',
      earnCoins: 'Earn Coins',
      rewards: 'Rewards',
      complete: 'Complete',
      claimReward: 'Claim',
      completed: 'Completed',
    },
    hi: {
      dailyQuests: 'दैनिक कार्य',
      harvest: 'कटाई करें',
      build: 'निर्माण करें',
      earnCoins: 'सिक्के अर्जित करें',
      rewards: 'पुरस्कार',
      complete: 'पूर्ण करें',
      claimReward: 'दावा करें',
      completed: 'पूर्ण',
    },
  }

  const translations = t[language]

  const getQuestLabel = (type: string): string => {
    switch (type) {
      case 'harvest':
        return translations.harvest
      case 'build':
        return translations.build
      case 'coins':
        return translations.earnCoins
      default:
        return ''
    }
  }

  const handleClaimReward = (questId: string, reward: number) => {
    completeQuest(questId)
    updateCoins(reward)
    updateExperience(50)
  }

  return (
    <>
      <div className="absolute top-20 right-4 pointer-events-auto">
        <Button
          onClick={() => setShowQuests(!showQuests)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-bold"
        >
          {translations.dailyQuests}
        </Button>
      </div>

      {showQuests && (
        <div className="absolute top-32 right-4 pointer-events-auto max-w-xs">
          <Card className="bg-black/80 border-purple-500 p-4 space-y-3 max-h-96 overflow-y-auto">
            <h3 className="text-white font-bold text-lg mb-3">
              {translations.dailyQuests}
            </h3>

            {quests.map((quest) => {
              const progress = Math.min(100, (quest.progress / quest.target) * 100)
              return (
                <div
                  key={quest.id}
                  className="border border-purple-400 rounded p-2 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-bold text-sm">
                        {getQuestLabel(quest.type)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {Math.floor(quest.progress)}/{quest.target}
                      </p>
                    </div>
                    <p className="text-yellow-400 font-bold text-sm">
                      +{quest.reward}
                    </p>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {quest.completed && !quest.completed ? (
                    <Button
                      onClick={() =>
                        handleClaimReward(quest.id, quest.reward)
                      }
                      className="w-full text-xs bg-green-600 hover:bg-green-700 py-1"
                    >
                      {translations.claimReward}
                    </Button>
                  ) : quest.completed ? (
                    <p className="text-green-400 text-xs text-center font-bold">
                      {translations.completed}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </Card>
        </div>
      )}
    </>
  )
}
