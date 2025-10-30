import { useEffect, useState } from "react";
import { AnimationLoop } from "../controllers/AnimationLoop";

export const useBorderAnimation = (speed: number = 0.0003) => {
  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    const unsubscribe = AnimationLoop.subscribe((dt) => {
      setAnimation((prev) => (prev + speed * dt) % 1);
    });
    return () => unsubscribe();
  }, [speed]);

  return animation;
};
