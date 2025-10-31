import { Container, Text } from "@pixi/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const isAutoSpinningRef = useRef(false);
  const isFastModeRef = useRef(false);

  const layout = useLayoutDimensions({ width, height });

  // Initialize PixiJS Sound
  useEffect(() => {
    // Add music sound (user can add music file to public/music/background.mp3 or music.ogg)
    sound.add("background-music", {
      url: "/music/music.ogg",
      loop: true,
      volume: 0.5, // 50% volume
      preload: true, // Preload the sound
    });

    return () => {
      // Cleanup: stop and remove sound when component unmounts
      if (sound.exists("background-music")) {
        sound.stop("background-music");
        sound.remove("background-music");
      }
    };
  }, []);

  // Sync refs with state
  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  useEffect(() => {
    isFastModeRef.current = isFastMode;
  }, [isFastMode]);

  // Get initial state from controller
  useEffect(() => {
    if (slotMachineRef.current) {
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  // Listen for Konami code bonus
  useEffect(() => {
    const handleKonamiCode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const bonus = customEvent.detail?.bonus || 1000000;

      if (slotMachineRef.current && slotMachineRef.current.addBonus) {
        // Add bonus to balance
        slotMachineRef.current.addBonus(bonus);
        setGameState(slotMachineRef.current.getState());

        // Trigger retro animation on document.body
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
        // Update state after spin
        if (slotMachineRef.current) {
          const newState = slotMachineRef.current.getState();
          setGameState(newState);

          // Keep UI disabled for longer duration to match reel animation
          // Fast mode: reduce disable duration
          const disableDuration = isFastModeRef.current
            ? GAME_CONFIG.ANIMATION.UI_DISABLE_DURATION * 0.6
            : GAME_CONFIG.ANIMATION.UI_DISABLE_DURATION;

          setTimeout(() => {
            setUiDisabled(false);

            // Auto-spin: if enabled and has enough balance, spin again
            if (
              isAutoSpinningRef.current &&
              newState.balance >= newState.betAmount
            ) {
              // Small delay before next auto-spin
              const autoSpinDelay = isFastModeRef.current ? 200 : 500;
              setTimeout(() => {
                handleSpin();
              }, autoSpinDelay);
            } else if (
              isAutoSpinningRef.current &&
              newState.balance < newState.betAmount
            ) {
              // Stop auto-spin if not enough balance
              setIsAutoSpinning(false);
            }
          }, disableDuration);
        }
      })
      .catch((error) => {
        console.error("Spin failed:", error);
        setUiDisabled(false);
        // Stop auto-spin on error
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
    // Open DOM overlay outside the canvas with slot bounds
    window.dispatchEvent(
      new CustomEvent("settingsOpen", {
        detail: {
          x: layout.slotMachinePosition.x,
          y: layout.slotMachinePosition.y,
          width: layout.slotMachineWidth,
          height: layout.slotMachineHeight,
        },
      })
    );
  }, [layout]);

  const handleToggleMusic = useCallback(() => {
    console.log("Music toggle clicked, current state:", isMusicPlaying);

    // Toggle state first
    const newState = !isMusicPlaying;
    setIsMusicPlaying(newState);

    // Control music immediately on click (user interaction)
    if (!sound.exists("background-music")) {
      console.warn("Background music not loaded yet");
      return;
    }

    if (newState) {
      // Play music from the beginning and let it loop naturally
      try {
        const inst = sound.find("background-music");
        if (inst && inst.isPlaying) return;

        // Stop and play from the beginning
        sound.stop("background-music");
        sound.play("background-music", {
          start: 11, // Start from the beginning
          loop: true, // Loop the entire track
        });
      } catch (error) {
        console.warn("Could not play music:", error);
      }
    } else {
      // Stop the music
      sound.stop("background-music");
    }
  }, [isMusicPlaying]);

  const handleToggleAutoSpin = useCallback(() => {
    setIsAutoSpinning((prev) => !prev);
  }, []);

  const handleToggleFastMode = useCallback(() => {
    // Prevent toggling fast mode while reels are spinning or UI is locked
    if (uiDisabled || gameState.isSpinning) return;
    setIsFastMode((prev) => !prev);
  }, [uiDisabled, gameState.isSpinning]);

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

  // Style for text below slot machine
  const textBelowStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Poppins, sans-serif",
    align: "center",
    letterSpacing: 1,
  });

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
        disabled={uiDisabled}
      />

      <FastSpeedButton
        x={layout.fastSpeedButtonX}
        y={layout.fastSpeedButtonY}
        isActive={isFastMode}
        onClick={handleToggleFastMode}
        disabled={uiDisabled || gameState.balance < gameState.betAmount}
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
        disabled={uiDisabled || gameState.balance < gameState.betAmount}
        isSpinning={uiDisabled}
        x={layout.spinButtonX}
        y={layout.spinButtonY}
      />

      {/* DOM SettingsOverlay handles UI outside canvas now */}
    </Container>
  );
};
