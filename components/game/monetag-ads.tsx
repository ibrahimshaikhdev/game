'use client'

import { useEffect } from 'react'

interface MonetgAdsProps {
  publisherId: string
}

export default function MonetgAds({ publisherId }: MonetgAdsProps) {
  useEffect(() => {
    // Initialize Monetag ads
    if (typeof window !== 'undefined' && (window as any).monetag) {
      ;(window as any).monetag.showAds()
    }
  }, [])

  return (
    <>
      {/* Banner Ad - Top */}
      <div
        id="monetag-banner-top"
        className="w-full h-20 flex justify-center items-center bg-gray-900 my-2"
      >
        <script
          async
          src={`https://cdn.monetag.com/showAds.js?publisherId=${publisherId}`}
        ></script>
      </div>

      {/* Interstitial ad container */}
      <div id="monetag-interstitial"></div>
    </>
  )
}
