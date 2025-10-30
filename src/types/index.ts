export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Dimension extends Size, Position {}

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

export interface SlotMachineProps extends Dimension {
  onStateUpdate?: (state: SlotMachineState) => void;
  fastMode?: boolean;
}

export interface ReelGrid extends Position {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  isSpinning: boolean;
  reelPositions: number[][];
  spinDelay?: number;
  winningPositions: [number, number][];
  fastMode?: boolean;
}

export interface ReelSymbolContainer extends Dimension {
  symbolCount: number;
  isSpinning: boolean;
  symbols: number[];
  reelIndex: number;
  targetPositions?: number[];
  winningPositions: [number, number][];
  anyWinningSymbolsInGame: boolean;
  fastMode?: boolean;
}

export interface SymbolContainer extends Dimension {
  symbolType: number;
  isWinning: boolean;
}

export interface Star extends Position {
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  type?: "star" | "comet";
  id?: number;
}

export interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: number;
}

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
