/**
 * Asset Preloader - Preload all game assets at startup
 */

import { Assets } from "pixi.js";
import { SYMBOL_ASSETS, BG_ASSETS } from "../constants/assets";

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Preload all game assets
 */
export const preloadGameAssets = async (
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> => {
  // Define all assets to preload
  const allAssets = [
    // Symbols
    ...SYMBOL_ASSETS.map((path) => `/${path}`),
    // Symbol backgrounds
    ...BG_ASSETS.map((path) => `/${path}`),
    // UI assets
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

  // Add bundle for better management
  Assets.addBundle("game", allAssets.reduce((acc, path, index) => {
    acc[`asset-${index}`] = path;
    return acc;
  }, {} as Record<string, string>));

  try {
    // Load all assets in parallel with progress tracking
    await Assets.loadBundle("game", (progress) => {
      loaded = Math.floor(progress * total);
      onProgress?.({
        loaded,
        total,
        percentage: Math.floor(progress * 100),
      });
    });

    console.log(`✅ Loaded ${total} assets successfully`);
  } catch (error) {
    console.error("❌ Failed to preload assets:", error);
    throw error;
  }
};

/**
 * Check if an asset is already loaded
 */
export const isAssetLoaded = (path: string): boolean => {
  return Assets.cache.has(path);
};

