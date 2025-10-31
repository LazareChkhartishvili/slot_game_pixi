import { Container, Graphics, Sprite } from "@pixi/react";
import { Graphics as GraphicsType, Assets } from "pixi.js";
import { useCallback, useState, useEffect, useRef } from "react";

import { Easing, removeAll, Tween, update } from "@tweenjs/tween.js";
import { GAME_CONFIG } from "../../constants/game";
import type { ReelSymbolContainer } from "../../types";
import { SlotSymbol } from "./SlotSymbol";

export const ReelColumn = ({
  x,
  y,
  width,
  height,
  symbolCount,
  isSpinning,
  symbols,
  reelIndex,
  targetPositions,
  winningPositions = [],
  anyWinningSymbolsInGame,
  fastMode = false,
}: ReelSymbolContainer) => {
  const [offset, setOffset] = useState(0);
  const [dividerLoaded, setDividerLoaded] = useState(false);
  const maskRef = useRef<GraphicsType>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeSymbolsRef = useRef<number[]>([...symbols]);
  const spinningRef = useRef(false);
  const stoppingRef = useRef(false);
  const totalSpins = useRef(0);
  const reelHasWinningSymbolsRef = useRef(false);

  const finalPositionsRef = useRef<number[] | null>(null);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spinSpeed = GAME_CONFIG.ANIMATION.SPIN_SPEED;
  const spinSpeedRef = useRef(spinSpeed);

  const symbolHeight = height / symbolCount;

  const speedMultiplier = fastMode ? 0.2 : 1;
  const startDelayPerReel =
    GAME_CONFIG.ANIMATION.REEL_START_DELAY_PER_REEL * speedMultiplier;
  const stopDelayPerReel =
    GAME_CONFIG.ANIMATION.REEL_STOP_DELAY_PER_REEL * speedMultiplier;
  const baseDuration = GAME_CONFIG.ANIMATION.BASE_DURATION * speedMultiplier;

  const hasWinningSymbols = winningPositions.length > 0;

  useEffect(() => {
    Assets.load("/images/symbols/divider.png")
      .then(() => setDividerLoaded(true))
      .catch((error) => console.error("Failed to load divider:", error));
  }, []);

  useEffect(() => {
    reelHasWinningSymbolsRef.current = hasWinningSymbols;
  }, [hasWinningSymbols]);

  const drawMask = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(0xffffff);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [width, height]
  );

  const drawReelBackground = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(0x333333, 0.2);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();
    },
    [width, height]
  );

  const drawWinEffect = useCallback(
    (g: GraphicsType) => {
      g.clear();

      if (isSpinning || !anyWinningSymbolsInGame) {
        return;
      }

      if (winningPositions.length === 0) {
        g.beginFill(0x000000, 0.7);
        g.drawRect(0, 0, width, height);
        g.endFill();
        return;
      }

      const winningRows = winningPositions.map((pos) => pos[1]);

      for (let rowIndex = 0; rowIndex < symbolCount; rowIndex++) {
        if (!winningRows.includes(rowIndex)) {
          const rowY = rowIndex * symbolHeight;
          g.beginFill(0x000000, 0.7);
          g.drawRect(0, rowY, width, symbolHeight);
          g.endFill();
        }
      }
    },
    [
      width,
      height,
      isSpinning,
      winningPositions,
      anyWinningSymbolsInGame,
      symbolCount,
      symbolHeight,
    ]
  );

  const animate = useCallback((time: number) => {
    update(time);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const calculateRemainingSpins = useCallback(() => {
    if (!targetPositions || !targetPositions.length) return 5;

    return 2 + reelIndex + Math.floor(Math.random() * 2);
  }, [targetPositions, reelIndex]);

  const prepareStopPositions = useCallback(() => {
    if (!targetPositions || !Array.isArray(targetPositions)) {
      return;
    }

    const targetSequence = [...targetPositions];

    for (let i = 0; i < symbolCount; i++) {
      targetSequence.push(
        Math.floor(Math.random() * GAME_CONFIG.SYMBOLS.TOTAL_TYPES)
      );
    }

    finalPositionsRef.current = targetSequence;

    spinSpeedRef.current = spinSpeed;
  }, [targetPositions, symbolCount]);

  const spinOneSymbol = useCallback(() => {
    if (!spinningRef.current) return;
    totalSpins.current++;

    let duration = baseDuration;

    if (stoppingRef.current) {
      const slowdownFactor = Math.min(2.5, 1 + (totalSpins.current % 5) * 0.4);
      duration *= slowdownFactor;
    }

    const from = { y: 0 };
    const to = { y: symbolHeight };

    const easingFunction = !stoppingRef.current
      ? Easing.Quadratic.InOut
      : Easing.Back.Out;

    new Tween(from)
      .to(to, duration)
      .easing(easingFunction)
      .onUpdate(() => setOffset(from.y))
      .onComplete(() => {
        setOffset(0);

        const lastIdx = activeSymbolsRef.current.length - 1;
        const lastSymbol = activeSymbolsRef.current[lastIdx];
        if (lastSymbol !== undefined) {
          activeSymbolsRef.current = [
            lastSymbol,
            ...activeSymbolsRef.current.slice(0, lastIdx),
          ];
        }

        if (spinningRef.current) {
          if (stoppingRef.current) {
            const remainingSpins =
              calculateRemainingSpins() - totalSpins.current;

            if (remainingSpins <= 0 && finalPositionsRef.current) {
              performFinalStop();
            } else {
              spinOneSymbol();
            }
          } else {
            spinOneSymbol();
          }
        }
      })
      .start();
  }, [baseDuration, symbolHeight, calculateRemainingSpins]);

  const performFinalStop = useCallback(() => {
    if (!finalPositionsRef.current) return;

    activeSymbolsRef.current = [...finalPositionsRef.current];

    const from = { y: symbolHeight * 0.3 };
    const to = { y: 0 };

    new Tween(from)
      .to(to, 300)
      .easing(Easing.Elastic.Out)
      .onUpdate(() => setOffset(from.y))
      .onComplete(() => {
        setOffset(0);
        spinningRef.current = false;
        stoppingRef.current = false;
        finalPositionsRef.current = null;
      })
      .start();
  }, [symbolHeight]);

  const startSpinning = useCallback(() => {
    if (spinningRef.current) return;

    spinningRef.current = true;
    stoppingRef.current = false;
    totalSpins.current = 0;
    finalPositionsRef.current = null;

    removeAll();

    startTimeoutRef.current = setTimeout(() => {
      const bounce = { y: 0 };

      new Tween(bounce)
        .to({ y: -symbolHeight * 0.05 }, 120)
        .easing(Easing.Sinusoidal.InOut)
        .onUpdate(() => setOffset(bounce.y))
        .onComplete(() => {
          new Tween(bounce)
            .to({ y: symbolHeight * 0.25 }, 160)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => setOffset(bounce.y))
            .onComplete(() => {
              new Tween(bounce)
                .to({ y: symbolHeight * 0.1 }, 90)
                .easing(Easing.Sinusoidal.In)
                .onUpdate(() => setOffset(bounce.y))
                .onComplete(() => {
                  new Tween(bounce)
                    .to({ y: 0 }, 70)
                    .easing(Easing.Back.Out)
                    .onUpdate(() => setOffset(bounce.y))
                    .onComplete(() => {
                      bounceTimeoutRef.current = setTimeout(() => {
                        spinOneSymbol();
                      }, 30);
                    })
                    .start();
                })
                .start();
            })
            .start();
        })
        .start();
    }, reelIndex * startDelayPerReel);
  }, [symbolHeight, startDelayPerReel, reelIndex, spinOneSymbol]);

  const stopSpinning = useCallback(() => {
    if (!spinningRef.current || stoppingRef.current) return;
    stoppingRef.current = true;
    prepareStopPositions();
  }, [prepareStopPositions]);

  useEffect(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    if (isSpinning && !spinningRef.current) {
      startSpinning();
    } else if (!isSpinning && spinningRef.current && !stoppingRef.current) {
      stopTimeoutRef.current = setTimeout(() => {
        stopSpinning();
      }, reelIndex * stopDelayPerReel);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current);
        bounceTimeoutRef.current = null;
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    };
  }, [
    isSpinning,
    animate,
    startSpinning,
    stopSpinning,
    reelIndex,
    stopDelayPerReel,
  ]);

  const getVisibleSymbols = useCallback(() => {
    const visibleSymbols: number[] = [];
    const activeSymbolsLength = activeSymbolsRef.current.length || 1;
    for (let i = 0; i < symbolCount + 2; i++) {
      const symbol = activeSymbolsRef.current[i % activeSymbolsLength];
      if (symbol !== undefined) {
        visibleSymbols.push(symbol);
      }
    }
    return visibleSymbols;
  }, [symbolCount]);

  const isWinningPosition = useCallback(
    (rowIndex: number) => {
      if (!hasWinningSymbols) return false;

      return winningPositions.some(([, row]) => row === rowIndex);
    },
    [hasWinningSymbols, winningPositions]
  );

  const visibleSymbols = getVisibleSymbols();

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawReelBackground} />
      <Graphics draw={drawMask} ref={maskRef} />

      <Container y={offset} mask={maskRef.current}>
        {visibleSymbols.map((symbolType, index) => {
          const visibleRowIndex = index % symbolCount;
          const isWinning = isWinningPosition(visibleRowIndex);

          return (
            <SlotSymbol
              key={`symbol-${index}-${totalSpins.current}`}
              x={width / 2}
              y={index * symbolHeight + symbolHeight / 2}
              width={width * 0.8}
              height={symbolHeight * 0.8}
              symbolType={symbolType}
              isWinning={isWinning && !isSpinning}
            />
          );
        })}
      </Container>

      <Graphics draw={drawWinEffect} />

      {dividerLoaded && reelIndex < 4 && (
        <Sprite
          texture={Assets.get("/images/symbols/divider.png")}
          x={width - 2}
          y={0}
          height={height}
          width={2}
        />
      )}
    </Container>
  );
};
