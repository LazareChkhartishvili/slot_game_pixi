import { useEffect, useState, useRef } from "react";
import { AnimationLoop } from "../controllers/AnimationLoop";
import type { ExplosionParticle } from "../types";

export const useExplosionAnimation = () => {
  const explosionsRef = useRef<ExplosionParticle[][]>([]);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = AnimationLoop.subscribe(() => {
      if (explosionsRef.current.length === 0) return;
      explosionsRef.current = explosionsRef.current
        .map((explosion) =>
          explosion
            .map((particle) => ({
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vx: particle.vx,
              vy: particle.vy,
              life: particle.life - 0.02,
              size: particle.size,
              color: particle.color,
            }))
            .filter((p) => p.life > 0)
        )
        .filter((explosion) => explosion.length > 0);
      forceUpdate({});
    });
    return () => unsubscribe();
  }, []);

  return { explosionsRef, forceUpdate };
};
