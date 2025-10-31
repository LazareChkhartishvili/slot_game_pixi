import type { Position } from "./common";

export interface SpinButtonProps extends Position {
  handleSpin: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
}

export interface BetControlsProps extends Position {
  betAmount: number;
  onChangeBet: (amount: number) => void;
  disabled: boolean;
}

export interface BalanceDisplayProps extends Position {
  balance: number;
  lastWin: number;
  isSpinning: boolean;
  showWinAnimation?: boolean;
}
