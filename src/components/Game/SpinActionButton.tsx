import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { Assets, Graphics as GraphicTypes } from "pixi.js";
import type { SpinButtonProps } from "../../types";

export const SpinActionButton = ({
  handleSpin,
  disabled = false,
  isSpinning = false,
  x,
  y,
}: SpinButtonProps) => {
  const [spinIconLoaded, setSpinIconLoaded] = useState(false);
  const spinIconPath = "/images/symbols/spin.png";

  useEffect(() => {
    const loadSpinIcon = async () => {
      try {
        await Assets.load(spinIconPath);
        setSpinIconLoaded(true);
      } catch (error) {
        console.error("Failed to load spin icon:", error);
      }
    };
    loadSpinIcon();
  }, [spinIconPath]);

  const drawSpinButton = useCallback(
    (g: GraphicTypes) => {
      g.clear();

      // ზომები — ოდნავ შემცირებული
      const width = 240;
      const height = 140; // Increased from 110 to 120
      const cornerRadius = 28;

      // ფერთა პალიტრა (მუქი მწვანეები/წითლები)
      const baseColor = isSpinning ? "#b11d40" : 0x789e1a; // Dark green - main layer
      const shadowColor = isSpinning ? 0x7f132e : 0x4c5a0e; // Darker shadow

      /** ქვედა ჩრდილი (ღრმა ილუზია) - Only ONE shadow */
      g.beginFill(shadowColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2 + 6,
        width,
        height,
        cornerRadius
      );
      g.endFill();

      /** ზედა ფენა — მთავარი ღილაკი */
      g.beginFill(baseColor);
      g.drawRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height - 6,
        cornerRadius
      );
      g.endFill();

      /** შიდა overlay, რომ ჰქონდეს "დამჯდარი" 3D ეფექტი */
      g.beginFill(0x000000, 0.1);
      g.drawRoundedRect(
        -width / 2 + 5,
        -height / 2 + 5,
        width - 10,
        height - 14,
        cornerRadius - 5
      );
      g.endFill();

      if (isSpinning) {
        /** STOP სიმბოლო */
        const stopSize = 55;
        const stopCorner = 12;
        g.beginFill("#631b33");
        g.drawRoundedRect(
          -stopSize / 2,
          -stopSize / 2,
          stopSize,
          stopSize,
          stopCorner
        );
        g.endFill();
      }
      // Play icon will be rendered as Sprite, not drawn here
    },
    [isSpinning]
  );

  const spinIconTexture = spinIconLoaded ? Assets.get(spinIconPath) : null;

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor="pointer"
      pointerdown={disabled ? undefined : handleSpin}
      alpha={disabled ? 0.6 : 1}
    >
      <Graphics draw={drawSpinButton} />
      {!isSpinning && spinIconTexture && (
        <Sprite
          texture={spinIconTexture}
          anchor={[0.5, 0.5]}
          width={60}
          height={60}
        />
      )}
    </Container>
  );
};
