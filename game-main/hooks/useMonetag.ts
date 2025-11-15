// hooks/useMonetag.ts
export const useMonetagAd = () => {
  const showRewardedAd = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const fn = (window as any).show_10190960;
      if (fn) {
        fn()
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } else {
        setTimeout(() => resolve(false), 1000);
      }
    });
  };

  return { showRewardedAd };
};
