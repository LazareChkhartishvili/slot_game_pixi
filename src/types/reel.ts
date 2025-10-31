import type { Position, Dimension } from "./common";

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
