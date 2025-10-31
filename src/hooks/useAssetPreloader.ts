/**
 * Custom hook for preloading game assets
 */

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
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load assets:", error);
        // Still allow game to start even if some assets fail
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  return { isLoading, loadProgress };
};

