'use client'

import React, { createContext, useContext, useState } from 'react'

export interface Quest {
  id: string
  type: 'harvest' | 'build' | 'coins'
  target: number
  progress: number
  reward: number
  completed: boolean
  resetTime: Date
}

interface QuestContextType {
  quests: Quest[]
  completeQuest: (questId: string) => void
  updateQuestProgress: (questId: string, progress: number) => void
  resetDailyQuests: () => void
}

const QuestContext = createContext<QuestContextType | undefined>(undefined)

export function QuestProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'quest-harvest-100',
      type: 'harvest',
      target: 100,
      progress: 0,
      reward: 500,
      completed: false,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      id: 'quest-build-3',
      type: 'build',
      target: 3,
      progress: 0,
      reward: 300,
      completed: false,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      id: 'quest-coins-1000',
      type: 'coins',
      target: 1000,
      progress: 0,
      reward: 200,
      completed: false,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ])

  const completeQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, completed: true, progress: q.target } : q
      )
    )
  }

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const newProgress = Math.min(q.target, q.progress + progress)
          return {
            ...q,
            progress: newProgress,
            completed: newProgress >= q.target,
          }
        }
        return q
      })
    )
  }

  const resetDailyQuests = () => {
    setQuests((prev) =>
      prev.map((q) => ({
        ...q,
        progress: 0,
        completed: false,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }))
    )
  }

  return (
    <QuestContext.Provider
      value={{ quests, completeQuest, updateQuestProgress, resetDailyQuests }}
    >
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  const context = useContext(QuestContext)
  if (!context) {
    throw new Error('useQuests must be used within QuestProvider')
  }
  return context
}
