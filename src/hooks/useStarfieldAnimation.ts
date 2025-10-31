import { useEffect, useState } from "react";

import { AnimationLoop } from "../controllers/AnimationLoop";
import type { Size, Star } from "../types";

interface UseStarfieldAnimationProps extends Size {
  starCount?: number;
  cometCount?: number;
}

export const useStarfieldAnimation = ({
  width,
  height,
  starCount = 180,
  cometCount = 8,
}: UseStarfieldAnimationProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];

    // Create stars
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.05 + 0.01,
        angle: Math.random() * Math.PI * 2,
        type: "star",
      });
    }

    // Create comets (but ufro fasterrr)
    for (let i = 0; i < cometCount; i++) {
      newStars.push({
        id: starCount + i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 15 + 10,
        alpha: Math.random() * 0.6 + 0.5,
        speed: Math.random() * 0.3 + 0.15,
        angle: Math.random() * Math.PI * 2,
        type: "comet",
      });
    }

    setStars(newStars);
  }, [width, height, starCount, cometCount]);
  useEffect(() => {
    const unsubscribe = AnimationLoop.subscribe(() => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          const dx = Math.cos(star.angle) * star.speed;
          const dy = Math.sin(star.angle) * star.speed;

          let newX = star.x + dx;
          let newY = star.y + dy;

          if (newX < 0) newX = width;
          if (newX > width) newX = 0;
          if (newY < 0) newY = height;
          if (newY > height) newY = 0;

          return { ...star, x: newX, y: newY };
        })
      );
    });
    return () => unsubscribe();
  }, [width, height]);

  return stars;
};
