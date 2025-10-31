import { useEffect } from "react";
import { InputController } from "../controllers/InputController";
import { GAME_CONFIG } from "../constants/game";

interface UseKeyboardControlsProps {
  onSpin: () => void;
  onOpenSettings: () => void;
  onToggleMusic: () => void;
  onToggleFastMode: () => void;
  onToggleAutoSpin: () => void;
  onChangeBet: (newBet: number) => void;
  uiDisabled: boolean;
  isAutoSpinning: boolean;
  balance: number;
  betAmount: number;
}

export const useKeyboardControls = ({
  onSpin,
  onOpenSettings,
  onToggleMusic,
  onToggleFastMode,
  onToggleAutoSpin,
  onChangeBet,
  uiDisabled,
  isAutoSpinning,
  balance,
  betAmount,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    InputController.updateGuards({
      uiDisabled,
      isAutoSpinning,
      balance,
      betAmount,
    });
  }, [uiDisabled, isAutoSpinning, balance, betAmount]);

  useEffect(() => {
    const onSpinHandler = () => onSpin();
    const onOpenHandler = () => onOpenSettings();
    const onMusicHandler = () => onToggleMusic();
    const onFastHandler = () => onToggleFastMode();
    const onAutoHandler = () => onToggleAutoSpin();
    const onDecBetHandler = () => {
      if (betAmount > GAME_CONFIG.INITIAL_STATE.MIN_BET) {
        const step = betAmount < 2.0 ? 0.2 : betAmount < 10.0 ? 1.0 : 5.0;
        const newBet = Math.max(
          GAME_CONFIG.INITIAL_STATE.MIN_BET,
          Math.round((betAmount - step) * 100) / 100
        );
        onChangeBet(newBet);
      }
    };
    const onIncBetHandler = () => {
      if (betAmount < GAME_CONFIG.INITIAL_STATE.MAX_BET) {
        const step = betAmount < 2.0 ? 0.2 : betAmount < 10.0 ? 1.0 : 5.0;
        const newBet = Math.min(
          GAME_CONFIG.INITIAL_STATE.MAX_BET,
          Math.round((betAmount + step) * 100) / 100
        );
        onChangeBet(newBet);
      }
    };

    InputController.addEventListener("spin", onSpinHandler as EventListener);
    InputController.addEventListener(
      "openSettings",
      onOpenHandler as EventListener
    );
    InputController.addEventListener(
      "toggleMusic",
      onMusicHandler as EventListener
    );
    InputController.addEventListener(
      "toggleFast",
      onFastHandler as EventListener
    );
    InputController.addEventListener(
      "toggleAuto",
      onAutoHandler as EventListener
    );
    InputController.addEventListener(
      "decreaseBet",
      onDecBetHandler as EventListener
    );
    InputController.addEventListener(
      "increaseBet",
      onIncBetHandler as EventListener
    );

    return () => {
      InputController.removeEventListener(
        "spin",
        onSpinHandler as EventListener
      );
      InputController.removeEventListener(
        "openSettings",
        onOpenHandler as EventListener
      );
      InputController.removeEventListener(
        "toggleMusic",
        onMusicHandler as EventListener
      );
      InputController.removeEventListener(
        "toggleFast",
        onFastHandler as EventListener
      );
      InputController.removeEventListener(
        "toggleAuto",
        onAutoHandler as EventListener
      );
      InputController.removeEventListener(
        "decreaseBet",
        onDecBetHandler as EventListener
      );
      InputController.removeEventListener(
        "increaseBet",
        onIncBetHandler as EventListener
      );
    };
  }, [
    onSpin,
    onOpenSettings,
    onToggleMusic,
    onToggleFastMode,
    onToggleAutoSpin,
    onChangeBet,
    uiDisabled,
    isAutoSpinning,
    balance,
    betAmount,
  ]);
};
