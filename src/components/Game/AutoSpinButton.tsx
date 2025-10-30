import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { Assets, Graphics as GraphicsType } from "pixi.js";

interface AutoSpinButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const AutoSpinButton = ({
  x,
  y,
  isActive,
  onClick,
  disabled = false,
}: AutoSpinButtonProps) => {
  const [autoRedLoaded, setAutoRedLoaded] = useState(false);
  const [autoBlueLoaded, setAutoBlueLoaded] = useState(false);

  const autoIconRedPath = "/images/symbols/auto_icon_red.png";
  const autoIconBluePath = "/images/symbols/auto_icon_blue.png";

  // Load auto icons
  useEffect(() => {
    const loadIcons = async () => {
      try {
        await Assets.load(autoIconRedPath);
        setAutoRedLoaded(true);
        await Assets.load(autoIconBluePath);
        setAutoBlueLoaded(true);
      } catch (error) {
        console.error("Failed to load auto icons:", error);
      }
    };
    loadIcons();
  }, [autoIconRedPath, autoIconBluePath]);

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

  const autoRedTexture = autoRedLoaded ? Assets.get(autoIconRedPath) : null;
  const autoBlueTexture = autoBlueLoaded ? Assets.get(autoIconBluePath) : null;
  const currentTexture = isActive ? autoRedTexture : autoBlueTexture;

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor="pointer"
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
