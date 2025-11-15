'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
  onAdWatched: () => void
  language: 'en' | 'hi'
}

export default function AdModal({
  isOpen,
  onClose,
  onAdWatched,
  language,
}: AdModalProps) {
  const [adProgress, setAdProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [adComplete, setAdComplete] = useState(false)

  const t = {
    en: {
      watchAd: 'Watch Ad to Earn Coins',
      adLoading: 'Ad Loading...',
      watching: 'Watching Ad',
      earnCoins: 'Earn +100 Coins!',
      skip: 'Skip',
      reward: 'Ad Reward Unlocked!',
      claimReward: 'Claim Reward',
      monetagNote: 'Ad powered by Monetag',
    },
    hi: {
      watchAd: 'सिक्के अर्जित करने के लिए विज्ञापन देखें',
      adLoading: 'विज्ञापन लोड हो रहा है...',
      watching: 'विज्ञापन देखा जा रहा है',
      earnCoins: '+100 सिक्के अर्जित करें!',
      skip: 'छोड़ें',
      reward: 'विज्ञापन पुरस्कार अनलॉक!',
      claimReward: 'पुरस्कार दावा करें',
      monetagNote: 'विज्ञापन Monetag द्वारा संचालित',
    },
  }

  const translations = t[language]

  useEffect(() => {
    if (!isOpen) {
      setAdProgress(0)
      setIsLoading(true)
      setAdComplete(false)
      return
    }

    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(loadTimer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isLoading || adComplete) return

    const interval = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 30) {
          setAdComplete(true)
          clearInterval(interval)
          return 30
        }
        return prev + 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isOpen, isLoading, adComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center pointer-events-auto z-50">
      <Card className="bg-black border-yellow-500 p-6 max-w-md w-full mx-4">
        <div className="space-y-4">
          {isLoading ? (
            <>
              <h2 className="text-2xl font-bold text-white text-center">
                {translations.adLoading}
              </h2>
              <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <div
                  id="monetag-ad-container"
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="animate-pulse text-white text-lg">
                    {translations.monetagNote}
                  </div>
                </div>
              </div>
            </>
          ) : adComplete ? (
            <>
              <h2 className="text-2xl font-bold text-white text-center">
                {translations.reward}
              </h2>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-black">
                  {translations.earnCoins}
                </p>
              </div>
              <Button
                onClick={onAdWatched}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
              >
                {translations.claimReward}
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white text-center">
                {translations.watching}
              </h2>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-white">
                  {Math.floor(adProgress)}/{30}s
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-100"
                  style={{
                    width: `${(adProgress / 30) * 100}%`,
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 text-sm"
                >
                  {translations.skip}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
