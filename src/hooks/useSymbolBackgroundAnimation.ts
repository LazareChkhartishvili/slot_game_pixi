import { useEffect } from "react";
import { Container as ContainerType } from "pixi.js";
import type { RefObject } from "react";
import { AnimationLoop } from "../controllers/AnimationLoop";

export const useSymbolBackgroundAnimation = (
  bgLoaded: boolean,
  ref: RefObject<ContainerType | null>
) => {
  useEffect(() => {
    if (!bgLoaded) return;
    let time = 0;
    const unsubscribe = AnimationLoop.subscribe((dt) => {
      time += dt * 0.001;
      if (ref.current) {
        const pulseScale = 1 + Math.sin(time * 2.5) * 0.08;
        ref.current.scale.set(pulseScale, pulseScale);
        const movementX = Math.sin(time * 1.2) * 3.0;
        const movementY = Math.cos(time * 1.2) * 3.0;
        ref.current.x = movementX;
        ref.current.y = movementY;
        ref.current.alpha = 0.85 + Math.sin(time * 2.0) * 0.1;
      }
    });
    return () => unsubscribe();
  }, [bgLoaded, ref]);
};
