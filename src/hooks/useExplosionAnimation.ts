import { useEffect, useState, useRef } from "react";
import { AnimationLoop } from "../controllers/AnimationLoop";
import type { ExplosionParticle } from "../types";

export const useExplosionAnimation = () => {
  const explosionsRef = useRef<ExplosionParticle[][]>([]);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    let accumulator = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const unsubscribe = AnimationLoop.subscribe((dt) => {
      if (explosionsRef.current.length === 0) return;

      accumulator += dt;

      // Update particles every frame (60 FPS) - smooth animation
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

      if (accumulator >= frameTime) {
        accumulator = 0;
        forceUpdate({});
      }
    });

    return () => unsubscribe();
  }, []);

  return { explosionsRef, forceUpdate };
};
