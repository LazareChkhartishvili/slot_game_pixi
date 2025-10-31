import { Sprite } from "@pixi/react";
import { Texture, FederatedPointerEvent } from "pixi.js";
import { useCallback, memo } from "react";
import type { Star } from "../../types";
import type { ExplosionParticle } from "../../types";

interface CometSpriteProps {
  comet: Star;
  texture: Texture;
  onCometClick: (comet: Star) => ExplosionParticle[];
}

export const CometSprite = memo(
  ({ comet, texture, onCometClick }: CometSpriteProps) => {
    const handleClick = useCallback(
      (e: FederatedPointerEvent) => {
        e.stopPropagation();
        onCometClick(comet);
      },
      [comet, onCometClick]
    );

    return (
      <Sprite
        texture={texture}
        x={comet.x}
        y={comet.y}
        anchor={[0.5, 0.5]}
        width={comet.size}
        height={comet.size}
        alpha={comet.alpha}
        rotation={comet.angle + Math.PI / 2}
        eventMode="static"
        cursor="pointer"
        pointerdown={handleClick}
      />
    );
  }
);
