import { Graphics } from "@pixi/react";
import { Graphics as PixiGraphicsType } from "pixi.js";
import { useCallback, memo } from "react";
import type { ExplosionParticle } from "../../types";

interface ExplosionEffectProps {
  explosions: ExplosionParticle[][];
}

export const ExplosionEffect = memo(({ explosions }: ExplosionEffectProps) => {
  const drawAllParticles = useCallback(
    (g: PixiGraphicsType | null) => {
      if (!g) return;
      g.clear();

      explosions.forEach((explosion) => {
        explosion.forEach((particle) => {
          g.beginFill(particle.color, particle.life);
          g.drawCircle(particle.x, particle.y, particle.size * particle.life);
          g.endFill();
        });
      });
    },
    [explosions]
  );

  return <Graphics draw={drawAllParticles} />;
});
