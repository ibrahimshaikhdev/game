'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import GameUI from '@/components/game/game-ui'
import { GameProvider } from '@/contexts/game-context'
import { QuestProvider } from '@/contexts/quests-context'
import MonetgAds from '@/components/game/monetag-ads'

const DynamicGameScene = dynamic(() => import('@/components/game/game-scene'), {
  ssr: false,
})

const MONETAG_PUBLISHER_ID = 'YOUR_MONETAG_PUBLISHER_ID'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    setIsLoading(false)
    
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)
    } catch (err) {
      console.error('Audio context failed:', err)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Farm Tycoon</h1>
          <p className="text-xl text-green-100">Loading your farm...</p>
        </div>
      </div>
    )
  }

  return (
    <GameProvider language={language}>
      <QuestProvider>
        <MonetgAds publisherId={MONETAG_PUBLISHER_ID} />
        <div className="w-full h-screen bg-black">
          <Canvas
            camera={{ position: [0, 20, 30], fov: 50 }}
            shadows
            dpr={[1, 2]}
          >
            <PerspectiveCamera
              makeDefault
              position={[0, 20, 30]}
              fov={50}
            />
            <ambientLight intensity={0.6} name="ambientLight" />
            <directionalLight
              position={[100, 100, 50]}
              intensity={1}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              castShadow
            />
            <DynamicGameScene onFieldSelected={setSelectedFieldId} />
          </Canvas>

          <GameUI language={language} onLanguageChange={setLanguage} />
        </div>
      </QuestProvider>
    </GameProvider>
  )
}
