import { Container, Sprite } from "@pixi/react";
import { useEffect, useState, useRef } from "react";
import { Assets, Container as ContainerType } from "pixi.js";
import type { SymbolContainer } from "../../types";

import { BG_ASSETS, SYMBOL_ASSETS } from "../../constants/assets";
import { useSymbolBackgroundAnimation } from "../../hooks/useSymbolBackgroundAnimation";
import { useGlowAnimation } from "../../hooks/useGlowAnimation";

export const SlotSymbol = ({
  x,
  y,
  width,
  height,
  symbolType,
  isWinning = false,
}: SymbolContainer) => {
  const [symbolLoaded, setSymbolLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const containerRef = useRef<ContainerType>(null);
  const bgContainerRef = useRef<ContainerType>(null);

  const safeSymbolType = symbolType % SYMBOL_ASSETS.length;
  const symbolPath = SYMBOL_ASSETS[safeSymbolType] as string;
  const bgPath = BG_ASSETS[safeSymbolType] as string;

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Assets.load(symbolPath);
        setSymbolLoaded(true);
        await Assets.load(bgPath);
        setBgLoaded(true);
      } catch (error) {
        console.error(
          `Failed to load assets for symbol ${safeSymbolType}`,
          error
        );
      }
    };
    loadAssets();
  }, [symbolPath, bgPath, safeSymbolType]);

  useSymbolBackgroundAnimation(bgLoaded, bgContainerRef);
  const glowScale = useGlowAnimation(isWinning);

  if (!symbolLoaded || !bgLoaded) {
    return null;
  }

  const bgTexture = Assets.get(bgPath);
  const symbolTexture = Assets.get(symbolPath);

  if (!bgTexture || !symbolTexture) {
    return null;
  }

  return (
    <Container ref={containerRef} position={[x, y]}>
      <Container ref={bgContainerRef}>
        <Sprite
          texture={bgTexture}
          anchor={0.5}
          width={width * 2}
          height={height * 1.8}
        />
      </Container>
      <Sprite
        texture={symbolTexture}
        anchor={0.5}
        width={width}
        height={height}
      />

      {isWinning && (
        <>
          <Sprite
            texture={symbolTexture}
            anchor={0.5}
            width={width * 1.15 * glowScale}
            height={height * 1.15 * glowScale}
            alpha={0.5}
            tint={0xffff00}
          />
          <Sprite
            texture={symbolTexture}
            anchor={0.5}
            width={width * 1.25 * glowScale}
            height={height * 1.25 * glowScale}
            alpha={0.25}
            tint={0xffff00}
          />
        </>
      )}
    </Container>
  );
};
