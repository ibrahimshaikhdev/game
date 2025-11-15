// components/game/monetag-ads.tsx
"use client";

import { useMonetagAd } from "@/hooks/useMonetag";
import { useGame } from "@/contexts/game-context";
import { useState } from "react";

interface MonetgAdsProps {
  publisherId: string;
}

export default function MonetgAds({ publisherId }: MonetgAdsProps) {
  const { showRewardedAd } = useMonetagAd();
  const { addCoins, speedUpHarvest } = useGame(); // ← Your game context
  const [isLoading, setIsLoading] = useState(false);

  // Global function to show ad from anywhere (e.g. UI button)
  (window as any).triggerSpeedUpAd = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const watched = await showRewardedAd();

    if (watched) {
      speedUpHarvest?.(); // 10min → 2min
      addCoins?.(100);
      alert("Harvest Speed +80%! +100 Coins!");
    } else {
      alert("Ad not completed.");
    }
    setIsLoading(false);
  };

  return null; // Invisible component — just handles ads
}
