import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { Assets, Graphics as GraphicTypes } from "pixi.js";
import type { SpinButtonProps } from "../../types";
import {
  BUTTON_COLORS,
  BUTTON_DIMENSIONS,
  OPACITY,
} from "../../constants/theme";

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

  const colors = isSpinning
    ? BUTTON_COLORS.spinActive
    : BUTTON_COLORS.spinInactive;

  const drawSpinButton = useCallback(
    (g: GraphicTypes) => {
      g.clear();

      const {
        width,
        height,
        cornerRadius,
        shadowOffset,
        overlayPadding,
        stopSize,
        stopCorner,
      } = BUTTON_DIMENSIONS.spin;

      // Shadow-ebi
      g.beginFill(colors.shadow);
      g.drawRoundedRect(
        -width / 2,
        -height / 2 + shadowOffset,
        width,
        height,
        cornerRadius
      );
      g.endFill();

      // Base button
      g.beginFill(colors.base);
      g.drawRoundedRect(
        -width / 2,
        -height / 2,
        width,
        height - shadowOffset,
        cornerRadius
      );
      g.endFill();

      // Inner overlay
      g.beginFill(BUTTON_COLORS.overlay, OPACITY.overlay);
      g.drawRoundedRect(
        -width / 2 + overlayPadding,
        -height / 2 + overlayPadding,
        width - overlayPadding * 2,
        height - shadowOffset - overlayPadding * 2,
        cornerRadius - overlayPadding
      );
      g.endFill();

      // Stop icon when spinning
      if (isSpinning && "stopIcon" in colors) {
        g.beginFill(colors.stopIcon);
        g.drawRoundedRect(
          -stopSize / 2,
          -stopSize / 2,
          stopSize,
          stopSize,
          stopCorner
        );
        g.endFill();
      }
    },
    [colors, isSpinning]
  );

  const spinIconTexture = spinIconLoaded ? Assets.get(spinIconPath) : null;

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor="pointer"
      pointerdown={disabled ? undefined : handleSpin}
      alpha={disabled ? OPACITY.disabled : 1}
    >
      <Graphics draw={drawSpinButton} />
      {!isSpinning && spinIconTexture && (
        <Sprite
          texture={spinIconTexture}
          anchor={[0.5, 0.5]}
          width={BUTTON_DIMENSIONS.spin.iconSize}
          height={BUTTON_DIMENSIONS.spin.iconSize}
        />
      )}
    </Container>
  );
};
