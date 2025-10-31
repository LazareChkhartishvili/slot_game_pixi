import { useState, useEffect } from "react";
import { preloadGameAssets, type PreloadProgress } from "../utils/assetPreloader";

export const useAssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadGameAssets((progress) => {
          setLoadProgress(progress);
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load assets:", error);
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return { isLoading, loadProgress };
};

