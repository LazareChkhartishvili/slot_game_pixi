export interface SlotMachineState {
  isSpinning: boolean;
  reelPositions: number[][];
  balance: number;
  betAmount: number;
  lastWin: number;
  winningPositions: [number, number][];
}

export interface SlotMachineRef {
  spin: () => Promise<{ win: number }>;
  getState: () => SlotMachineState;
  setBet: (amount: number) => void;
  addBonus?: (amount: number) => void;
}

export interface SlotMachineProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onStateUpdate?: (state: SlotMachineState) => void;
  fastMode?: boolean;
}
