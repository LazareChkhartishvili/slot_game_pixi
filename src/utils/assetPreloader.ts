import { Assets } from "pixi.js";
import { SYMBOL_ASSETS, BG_ASSETS } from "../constants/assets";

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const preloadGameAssets = async (
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> => {
  const allAssets = [
    ...SYMBOL_ASSETS.map((path) => `/${path}`),
    ...BG_ASSETS.map((path) => `/${path}`),

    "/images/background.jpg",
    "/images/logo.png",
    "/images/symbols/comet.png",
    "/images/symbols/divider.png",
    "/images/symbols/spin.png",
    "/images/symbols/auto_icon_blue.png",
    "/images/symbols/auto_icon_red.png",
    "/images/symbols/fast_icon_blue.png",
    "/images/symbols/fast_icon_red.png",
    "/images/symbols/sound_on.png",
    "/images/symbols/sound_off.png",
    "/images/symbols/header_info_icon.png",
  ];

  const total = allAssets.length;
  let loaded = 0;

  Assets.addBundle(
    "game",
    allAssets.reduce((acc, path, index) => {
      acc[`asset-${index}`] = path;
      return acc;
    }, {} as Record<string, string>)
  );

  try {
    await Assets.loadBundle("game", (progress) => {
      loaded = Math.floor(progress * total);
      const percentage = Math.min(Math.round(progress * 100), 100);
      onProgress?.({
        loaded,
        total,
        percentage,
      });
    });

    onProgress?.({
      loaded: total,
      total,
      percentage: 100,
    });
  } catch (error) {
    console.error("❌ Failed to preload assets:", error);
    throw error;
  }
};

export const isAssetLoaded = (path: string): boolean => {
  return Assets.cache.has(path);
};
