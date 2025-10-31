import { useState, useEffect, useRef } from "react";
import { preloadGameAssets, type PreloadProgress } from "../utils/assetPreloader";

export const useAssetPreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await preloadGameAssets((progress) => {
          setLoadProgress(progress);
        });
        
        await new Promise(resolve => {
          loadTimeoutRef.current = setTimeout(resolve, 500);
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load assets:", error);
        setIsLoading(false);
      }
    };

    loadAssets();

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  return { isLoading, loadProgress };
};

