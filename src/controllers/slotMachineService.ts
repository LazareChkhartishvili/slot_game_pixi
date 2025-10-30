import { GAME_CONFIG } from "../constants/game";
import type { SlotMachineState } from "../types";

export class SlotMachineService {
  private state: SlotMachineState;
  private readonly totalSymbols: number;

  constructor(
    columns: number = GAME_CONFIG.REELS.COLUMNS,
    rows: number = GAME_CONFIG.REELS.ROWS
  ) {
    this.totalSymbols = GAME_CONFIG.SYMBOLS.TOTAL_TYPES;

    // Initialize positions (each position represents which symbol is shown)
    const reelPositions = Array(columns)
      .fill(0)
      .map(() =>
        Array(rows)
          .fill(0)
          .map(() => Math.floor(Math.random() * this.totalSymbols))
      );

    this.state = {
      isSpinning: false,
      reelPositions,
      balance: GAME_CONFIG.INITIAL_STATE.BALANCE,
      betAmount: GAME_CONFIG.INITIAL_STATE.BET_AMOUNT,
      lastWin: 0,
      winningPositions: [],
    };
  }

  getState(): SlotMachineState {
    return { ...this.state };
  }

  spin(): Promise<{ win: number }> {
    if (this.state.isSpinning) {
      return Promise.reject(new Error("Already spinning"));
    }

    if (this.state.balance < this.state.betAmount) {
      return Promise.reject(new Error("Insufficient balance"));
    }

    // Deduct bet amount (round to 2 decimal places to avoid floating point precision issues)
    this.state.balance =
      Math.round((this.state.balance - this.state.betAmount) * 100) / 100;
    this.state.isSpinning = true;
    this.state.winningPositions = [];

    // Create a promise that resolves when spinning is complete
    return new Promise((resolve, reject) => {
      try {
        // Generate new random positions immediately but don't update UI yet
        const newPositions = this.state.reelPositions.map((reel) =>
          reel.map(() => Math.floor(Math.random() * this.totalSymbols))
        );

        // Store the new positions to be used after animation completes
        this.state.reelPositions = newPositions;

        // Start animation - when complete, resolve the promise
        setTimeout(() => {
          const { win, winningPositions } = this.calculateWin();
          this.state.lastWin = win;
          // Round to 2 decimal places to avoid floating point precision issues
          this.state.balance =
            Math.round((this.state.balance + win) * 100) / 100;
          this.state.isSpinning = false;
          this.state.winningPositions = winningPositions;
          resolve({ win });
        }, GAME_CONFIG.ANIMATION.REEL_SPIN_DURATION);
      } catch (error) {
        this.state.isSpinning = false;
        reject(error);
      }
    });
  }

  /**
   * Calculate win based on current reel positions
   */
  private calculateWin(): {
    win: number;
    winningPositions: [number, number][];
  } {
    // Evaluate only the middle row and pay if 3+ match starting from LEFTMOST or RIGHTMOST
    const middleRow = this.state.reelPositions
      .map((reel) => reel[1])
      .filter((symbol): symbol is number => symbol !== undefined);

    const length = middleRow.length;
    if (length === 0) {
      return { win: 0, winningPositions: [] };
    }

    // Count run from left edge
    let leftLen = 1;
    const leftSymbol = middleRow[0] as number;
    for (let i = 1; i < length; i++) {
      if (middleRow[i] === leftSymbol) leftLen++;
      else break;
    }

    // Count run from right edge
    let rightLen = 1;
    const rightSymbol = middleRow[length - 1] as number;
    for (let i = length - 2; i >= 0; i--) {
      if (middleRow[i] === rightSymbol) rightLen++;
      else break;
    }

    const minMatch = GAME_CONFIG.WIN_CALCULATION.MIN_MATCHES_FOR_WIN;
    let totalWin = 0;
    const winningPositions: [number, number][] = [];

    const payLeft = leftLen >= minMatch;
    const payRight = rightLen >= minMatch;

    const overlap =
      payLeft &&
      payRight &&
      leftSymbol === rightSymbol &&
      leftLen + rightLen > length;

    if (payLeft) {
      const len = overlap
        ? Math.max(leftLen, Math.min(leftLen, length))
        : leftLen;
      const multiplier = (leftSymbol + 1) * len;
      totalWin += this.state.betAmount * multiplier;
      for (let i = 0; i < len; i++) winningPositions.push([i, 1]);
    }

    if (payRight) {
      let len = rightLen;
      let start = length - rightLen;

      if (overlap) {
        if (leftLen >= length) {
          len = 0;
        } else {
          const leftCovered = leftLen;
          start = Math.max(leftCovered, length - rightLen);
          len = length - start;
        }
      }
      if (len > 0) {
        const multiplier = (rightSymbol + 1) * len;
        totalWin += this.state.betAmount * multiplier;
        for (let i = 0; i < len; i++) winningPositions.push([start + i, 1]);
      }
    }

    return { win: totalWin, winningPositions };
  }

  setBet(amount: number): void {
    if (this.state.isSpinning) {
      throw new Error("Cannot change bet while spinning");
    }

    if (amount < GAME_CONFIG.INITIAL_STATE.MIN_BET) {
      throw new Error(
        `Bet amount must be at least ${GAME_CONFIG.INITIAL_STATE.MIN_BET}`
      );
    }

    if (amount > GAME_CONFIG.INITIAL_STATE.MAX_BET) {
      throw new Error(
        `Bet amount cannot exceed ${GAME_CONFIG.INITIAL_STATE.MAX_BET}`
      );
    }

    this.state.betAmount = amount;
  }

  addBonus(amount: number): void {
    this.state.balance = Math.round((this.state.balance + amount) * 100) / 100;
  }

  reset(): void {
    if (this.state.isSpinning) {
      throw new Error("Cannot reset while spinning");
    }

    const columns = this.state.reelPositions.length;
    const rows = this.state.reelPositions[0]?.length || GAME_CONFIG.REELS.ROWS;

    const reelPositions = Array(columns)
      .fill(0)
      .map(() =>
        Array(rows)
          .fill(0)
          .map(() => Math.floor(Math.random() * this.totalSymbols))
      );

    this.state = {
      isSpinning: false,
      reelPositions,
      balance: GAME_CONFIG.INITIAL_STATE.BALANCE,
      betAmount: GAME_CONFIG.INITIAL_STATE.BET_AMOUNT,
      lastWin: 0,
      winningPositions: [],
    };
  }
}
