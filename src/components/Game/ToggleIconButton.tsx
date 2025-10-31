import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState, memo } from "react";
import { Assets, Graphics as GraphicsType } from "pixi.js";

interface ToggleIconButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  activeIconPath: string;
  inactiveIconPath: string;
}

export const ToggleIconButton = memo(({
  x,
  y,
  isActive,
  onClick,
  disabled = false,
  activeIconPath,
  inactiveIconPath,
}: ToggleIconButtonProps) => {
  const [activeLoaded, setActiveLoaded] = useState(false);
  const [inactiveLoaded, setInactiveLoaded] = useState(false);

  // Load icons
  useEffect(() => {
    const loadIcons = async () => {
      try {
        await Assets.load(activeIconPath);
        setActiveLoaded(true);
        await Assets.load(inactiveIconPath);
        setInactiveLoaded(true);
      } catch (error) {
        console.error("Failed to load toggle button icons:", error);
      }
    };
    loadIcons();
  }, [activeIconPath, inactiveIconPath]);

  const drawButton = useCallback(
    (g: GraphicsType) => {
      g.clear();

      const width = 70;
      const height = 65;
      const cornerRadius = 14;

      const baseColor = isActive ? 0x991b1b : 0x1e40af;
      const shadowColor = isActive ? 0x7f1d1d : 0x1e3a8a;

      g.beginFill(shadowColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2 + 6,
        width,
        height,
        cornerRadius
      );
      g.endFill();

      g.beginFill(baseColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height - 6,
        cornerRadius
      );
      g.endFill();

      g.beginFill(0x000000, 0.1);
      g.drawRoundedRect(
        -width / 2 + 5,
        -height / 2 + 5,
        width - 10,
        height - 14,
        cornerRadius - 5
      );
      g.endFill();
    },
    [isActive]
  );

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      if (!disabled) {
        e.stopPropagation();
        onClick();
      }
    },
    [disabled, onClick]
  );

  const activeTexture = activeLoaded ? Assets.get(activeIconPath) : null;
  const inactiveTexture = inactiveLoaded
    ? Assets.get(inactiveIconPath)
    : null;
  const currentTexture = isActive ? activeTexture : inactiveTexture;

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor={disabled ? "default" : "pointer"}
      pointerdown={handleClick}
      alpha={disabled ? 0.6 : 1}
    >
      <Graphics draw={drawButton} />
      {currentTexture && (
        <Sprite
          texture={currentTexture}
          anchor={[0.5, 0.5]}
          width={30}
          height={30}
        />
      )}
    </Container>
  );
});

