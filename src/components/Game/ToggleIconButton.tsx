import { Container, Graphics, Sprite } from "@pixi/react";
import { useCallback, useEffect, useState, memo } from "react";
import { Assets, Graphics as GraphicsType } from "pixi.js";
import {
  BUTTON_COLORS,
  BUTTON_DIMENSIONS,
  OPACITY,
} from "../../constants/theme";

interface ToggleIconButtonProps {
  x: number;
  y: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  activeIconPath: string;
  inactiveIconPath: string;
}

export const ToggleIconButton = memo(
  ({
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

    // Select colors based on active state
    const colors = isActive
      ? BUTTON_COLORS.toggleActive
      : BUTTON_COLORS.toggleInactive;

    const drawButton = useCallback(
      (g: GraphicsType) => {
        g.clear();

        const { width, height, cornerRadius, shadowOffset, overlayPadding } =
          BUTTON_DIMENSIONS.toggle;

        // Shadow
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
      },
      [colors]
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
        alpha={disabled ? OPACITY.disabled : 1}
      >
        <Graphics draw={drawButton} />
        {currentTexture && (
          <Sprite
            texture={currentTexture}
            anchor={[0.5, 0.5]}
            width={BUTTON_DIMENSIONS.toggle.iconSize}
            height={BUTTON_DIMENSIONS.toggle.iconSize}
          />
        )}
      </Container>
    );
  }
);
