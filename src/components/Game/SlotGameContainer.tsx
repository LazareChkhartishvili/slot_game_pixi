import { Container, Text } from "@pixi/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextStyle } from "pixi.js";
import { sound } from "@pixi/sound";

import { GameLogo } from "./GameLogo";
import { SettingsIcon } from "./SettingsIcon";

import type { Size, SlotMachineRef, SlotMachineState } from "../../types";
import { useLayoutDimensions } from "../../hooks/useLayoutDimensions";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import { GAME_CONFIG } from "../../constants/game";
import { SlotMachineReels } from "./SlotMachineReels";
import { MusicIcon } from "./MusicIcon";
import { BalancePanel } from "./BalancePanel";
import { BetAmountControls } from "./BetAmountControls";
import { FastSpeedButton } from "./FastSpeedButton";
import { AutoSpinButton } from "./AutoSpinButton";
import { SpinActionButton } from "./SpinActionButton";

export const SlotGameContainer = ({ width, height }: Size) => {
  const slotMachineRef = useRef<SlotMachineRef>(null);
  const [gameState, setGameState] = useState<SlotMachineState>({
    isSpinning: false,
    reelPositions: [],
    balance: GAME_CONFIG.INITIAL_STATE.BALANCE,
    betAmount: GAME_CONFIG.INITIAL_STATE.BET_AMOUNT,
    lastWin: 0,
    winningPositions: [],
  });

  const [uiDisabled, setUiDisabled] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);

  const isMusicPlayingRef = useRef(false);
  const isAutoSpinningRef = useRef(false);
  const isFastModeRef = useRef(false);

  const layout = useLayoutDimensions({ width, height });
  const layoutRef = useRef(layout);

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    sound.add("background-music", {
      url: "/music/music.ogg",
      loop: true,
      volume: 0.5,
      preload: true,
    });

    return () => {
      if (sound.exists("background-music")) {
        sound.stop("background-music");
        sound.remove("background-music");
      }
    };
  }, []);

  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  useEffect(() => {
    isFastModeRef.current = isFastMode;
  }, [isFastMode]);

  useEffect(() => {
    if (slotMachineRef.current) {
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  useEffect(() => {
    const handleKonamiCode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const bonus = customEvent.detail?.bonus || 1000000;

      if (slotMachineRef.current && slotMachineRef.current.addBonus) {
        slotMachineRef.current.addBonus(bonus);
        setGameState(slotMachineRef.current.getState());

        if (document.body) {
          document.body.classList.add("konami-active");
          setTimeout(() => {
            document.body.classList.remove("konami-active");
          }, 3000);
        }
      }
    };

    window.addEventListener("konamiCode", handleKonamiCode as EventListener);
    return () =>
      window.removeEventListener(
        "konamiCode",
        handleKonamiCode as EventListener
      );
  }, []);

  const handleSpin = useCallback(() => {
    if (!slotMachineRef.current) return;

    setUiDisabled(true);

    slotMachineRef.current
      .spin()
      .then(() => {
        if (slotMachineRef.current) {
          const newState = slotMachineRef.current.getState();
          setGameState(newState);

          const disableDuration = isFastModeRef.current
            ? GAME_CONFIG.ANIMATION.UI_DISABLE_DURATION * 0.6
            : GAME_CONFIG.ANIMATION.UI_DISABLE_DURATION;

          setTimeout(() => {
            setUiDisabled(false);

            if (
              isAutoSpinningRef.current &&
              newState.balance >= newState.betAmount
            ) {
              const autoSpinDelay = isFastModeRef.current ? 200 : 500;
              setTimeout(() => {
                handleSpin();
              }, autoSpinDelay);
            } else if (
              isAutoSpinningRef.current &&
              newState.balance < newState.betAmount
            ) {
              setIsAutoSpinning(false);
            }
          }, disableDuration);
        }
      })
      .catch((error) => {
        console.error("Spin failed:", error);
        setUiDisabled(false);
        if (isAutoSpinningRef.current) {
          setIsAutoSpinning(false);
        }
      });
  }, []);

  const handleBetChange = useCallback((newBet: number) => {
    if (slotMachineRef.current) {
      slotMachineRef.current.setBet(newBet);
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    const currentLayout = layoutRef.current;
    window.dispatchEvent(
      new CustomEvent("settingsOpen", {
        detail: {
          x: currentLayout.slotMachinePosition.x,
          y: currentLayout.slotMachinePosition.y,
          width: currentLayout.slotMachineWidth,
          height: currentLayout.slotMachineHeight,
        },
      })
    );
  }, []);

  const handleToggleMusic = useCallback(() => {
    const currentState = isMusicPlayingRef.current;
    const newState = !currentState;

    setIsMusicPlaying(newState);
    isMusicPlayingRef.current = newState;

    if (!sound.exists("background-music")) {
      return;
    }

    if (newState) {
      try {
        const inst = sound.find("background-music");
        if (inst && inst.isPlaying) return;

        sound.stop("background-music");
        sound.play("background-music", {
          start: 11,
          loop: true,
        });
      } catch (error) {
        console.error("Failed to play music:", error);
      }
    } else {
      sound.stop("background-music");
    }
  }, []);

  const handleToggleAutoSpin = useCallback(() => {
    setIsAutoSpinning((prev) => {
      const newValue = !prev;

      if (newValue && !gameState.isSpinning && !uiDisabled) {
        setTimeout(() => {
          handleSpin();
        }, 0);
      }

      return newValue;
    });
  }, [gameState.isSpinning, uiDisabled, handleSpin]);

  const handleToggleFastMode = useCallback(() => {
    setIsFastMode((prev) => !prev);
  }, []);

  useKeyboardControls({
    onSpin: handleSpin,
    onOpenSettings: handleOpenModal,
    onToggleMusic: handleToggleMusic,
    onToggleFastMode: handleToggleFastMode,
    onToggleAutoSpin: handleToggleAutoSpin,
    onChangeBet: handleBetChange,
    uiDisabled,
    isAutoSpinning,
    balance: gameState.balance,
    betAmount: gameState.betAmount,
  });

  const textBelowStyle = useMemo(
    () =>
      new TextStyle({
        fill: 0xffffff,
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "Poppins, sans-serif",
        align: "center",
        letterSpacing: 1,
      }),
    []
  );

  return (
    <Container>
      <GameLogo
        x={layout.logoX}
        y={layout.logoY}
        width={layout.logoWidth}
        height={layout.logoHeight}
      />

      <MusicIcon
        x={layout.musicIconX}
        y={layout.musicIconY}
        size={35}
        isPlaying={isMusicPlaying}
        onClick={handleToggleMusic}
      />

      <SettingsIcon
        x={layout.settingsIconX}
        y={layout.settingsIconY}
        size={35}
        onClick={handleOpenModal}
      />

      <SlotMachineReels
        ref={slotMachineRef}
        x={layout.slotMachinePosition.x}
        y={layout.slotMachinePosition.y}
        width={layout.slotMachineWidth}
        height={layout.slotMachineHeight}
        onStateUpdate={setGameState}
        fastMode={isFastMode}
      />

      <Text
        text="WISH YOU GOOD LUCK!"
        x={layout.textBelowSlotMachineX}
        y={layout.textBelowSlotMachineY}
        anchor={[0, 0.2]}
        style={textBelowStyle}
        alpha={0.7}
      />

      <BalancePanel
        x={layout.balanceX}
        y={layout.balanceY}
        balance={gameState.balance}
        lastWin={gameState.lastWin}
        isSpinning={uiDisabled}
      />

      <BetAmountControls
        x={layout.rightPanelX}
        y={layout.betControlsY}
        betAmount={gameState.betAmount}
        onChangeBet={handleBetChange}
        disabled={uiDisabled || isAutoSpinning}
      />

      <FastSpeedButton
        x={layout.fastSpeedButtonX}
        y={layout.fastSpeedButtonY}
        isActive={isFastMode}
        onClick={handleToggleFastMode}
        disabled={isAutoSpinning}
      />

      <AutoSpinButton
        x={layout.autoSpinButtonX}
        y={layout.autoSpinButtonY}
        isActive={isAutoSpinning}
        onClick={handleToggleAutoSpin}
        disabled={false}
      />

      <SpinActionButton
        handleSpin={handleSpin}
        disabled={
          uiDisabled ||
          isAutoSpinning ||
          gameState.balance < gameState.betAmount
        }
        isSpinning={uiDisabled || isAutoSpinning}
        x={layout.spinButtonX}
        y={layout.spinButtonY}
      />
    </Container>
  );
};
