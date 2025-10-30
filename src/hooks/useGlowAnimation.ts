import { useEffect, useState } from "react";
import { Easing, Tween } from "@tweenjs/tween.js";

export const useGlowAnimation = (isActive: boolean) => {
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    if (!isActive) return;

    const from = { value: 1.0 };
    const to = { value: 1.2 };

    const tween = new Tween(from)
      .to(to, 600)
      .easing(Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate(() => setScale(from.value))
      .start();

    return () => {
      tween.stop();
    };
  }, [isActive]);

  return scale;
};
