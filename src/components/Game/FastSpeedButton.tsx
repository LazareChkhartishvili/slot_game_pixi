import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { Assets, Graphics as GraphicsType } from "pixi.js";

interface FastSpeedButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const FastSpeedButton = ({
  x,
  y,
  isActive,
  onClick,
  disabled = false,
}: FastSpeedButtonProps) => {
  const [fastRedLoaded, setFastRedLoaded] = useState(false);
  const [fastBlueLoaded, setFastBlueLoaded] = useState(false);

  const fastIconRedPath = "/images/symbols/fast_icon_red.png";
  const fastIconBluePath = "/images/symbols/fast_icon_blue.png";

  useEffect(() => {
    const loadIcons = async () => {
      try {
        await Assets.load(fastIconRedPath);
        setFastRedLoaded(true);
        await Assets.load(fastIconBluePath);
        setFastBlueLoaded(true);
      } catch (error) {
        console.error("Failed to load fast icons:", error);
      }
    };
    loadIcons();
  }, [fastIconRedPath, fastIconBluePath]);

  const drawButton = useCallback(
    (g: GraphicsType) => {
      g.clear();

      const width = 70;
      const height = 65;
      const cornerRadius = 14;

      // Color palette - Darker Red when active, Darker Blue when inactive
      const baseColor = isActive ? 0x991b1b : 0x1e40af; // Darker red when active, darker blue when inactive
      const shadowColor = isActive ? 0x7f1d1d : 0x1e3a8a;

      // Bottom shadow (depth illusion) - Only ONE shadow
      g.beginFill(shadowColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2 + 6,
        width,
        height,
        cornerRadius
      );
      g.endFill();

      // Top layer - main button
      g.beginFill(baseColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height - 6,
        cornerRadius
      );
      g.endFill();

      // Inner overlay for 3D effect
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

  const fastRedTexture = fastRedLoaded ? Assets.get(fastIconRedPath) : null;
  const fastBlueTexture = fastBlueLoaded ? Assets.get(fastIconBluePath) : null;
  const currentTexture = isActive ? fastRedTexture : fastBlueTexture;

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor={disabled ? "default" : "pointer"}
      pointerdown={(e) => {
        if (!disabled) {
          e.stopPropagation();
          onClick();
        }
      }}
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
};
