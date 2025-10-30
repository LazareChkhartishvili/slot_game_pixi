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

      // Draw all particles from all explosions in a single Graphics object
      // This is MUCH more efficient than creating separate Graphics for each particle
      explosions.forEach((explosion) => {
        explosion.forEach((particle) => {
          g.beginFill(particle.color, particle.life);
          g.drawCircle(
            particle.x,
            particle.y,
            particle.size * particle.life
          );
          g.endFill();
        });
      });
    },
    [explosions]
  );

  // Return single Graphics object instead of hundreds of individual Graphics
  return <Graphics draw={drawAllParticles} />;
});
