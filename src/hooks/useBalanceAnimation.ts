import { useEffect, useRef, useState } from "react";
import { AnimationLoop } from "../controllers/AnimationLoop";

export const useBalanceAnimation = (balance: number) => {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const accumulatorRef = useRef(0);

  useEffect(() => {
    accumulatorRef.current = 0;
    const unsubscribe = AnimationLoop.subscribe((dt) => {
      accumulatorRef.current += dt;
      if (accumulatorRef.current < 50) return;
      accumulatorRef.current = 0;
      setDisplayBalance((prev) => {
        if (prev === balance) return prev;
        const diff = balance - prev;
        const step = Math.max(0.01, Math.abs(diff) / 20);
        if (Math.abs(diff) <= step) return balance;
        return diff > 0 ? prev + step : prev - step;
      });
    });
    return () => unsubscribe();
  }, [balance]);

  return displayBalance;
};
