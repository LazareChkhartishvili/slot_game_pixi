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
   * Uses standard slot machine logic: paylines from left to right
   */
  private calculateWin(): {
    win: number;
    winningPositions: [number, number][];
  } {
    const paytable = GAME_CONFIG.WIN_CALCULATION.PAYTABLE;
    const minMatches = GAME_CONFIG.WIN_CALCULATION.MIN_MATCHES_FOR_WIN;
    let totalWin = 0;
    const winningPositions: [number, number][] = [];

    // Define paylines: top row (0), middle row (1), bottom row (2)
    const paylines = [
      // Top row
      this.state.reelPositions.map((reel) => reel[0]),
      // Middle row
      this.state.reelPositions.map((reel) => reel[1]),
      // Bottom row
      this.state.reelPositions.map((reel) => reel[2]),
    ];

    // Check each payline
    paylines.forEach((payline, rowIndex) => {
      if (payline.length === 0) return;

      // Track which individual positions have already been counted as wins
      const usedPositions = new Set<number>();

      // Function to check and add win
      const addWin = (
        symbol: number,
        matchCount: number,
        startCol: number
      ) => {
        if (matchCount < minMatches) return;

        // Check if any position in this range is already used
        let hasOverlap = false;
        for (let i = startCol; i < startCol + matchCount; i++) {
          if (usedPositions.has(i)) {
            hasOverlap = true;
            break;
          }
        }
        if (hasOverlap) return;

        const symbolMultipliers = paytable[symbol];
        const multiplierIndex = Math.min(
          matchCount - minMatches,
          symbolMultipliers.length - 1
        );
        const multiplier = symbolMultipliers[multiplierIndex] || 0;

        if (multiplier > 0) {
          totalWin += this.state.betAmount * multiplier;
          
          // Mark all positions in this win as used
          for (let i = startCol; i < startCol + matchCount; i++) {
            usedPositions.add(i);
            winningPositions.push([i, rowIndex]);
          }
        }
      };

      // Scan from LEFT TO RIGHT
      let currentSymbol = payline[0];
      let matchCount = 1;
      let startColumn = 0;

      for (let col = 1; col < payline.length; col++) {
        if (payline[col] === currentSymbol) {
          matchCount++;
        } else {
          addWin(currentSymbol, matchCount, startColumn);
          // Start new sequence
          currentSymbol = payline[col];
          matchCount = 1;
          startColumn = col;
        }
      }
      // Check final sequence from left
      addWin(currentSymbol, matchCount, startColumn);

      // Scan from RIGHT TO LEFT (for sequences that start from the right edge)
      currentSymbol = payline[payline.length - 1];
      matchCount = 1;
      startColumn = payline.length - 1;

      for (let col = payline.length - 2; col >= 0; col--) {
        if (payline[col] === currentSymbol) {
          matchCount++;
          startColumn = col;
        } else {
          addWin(currentSymbol, matchCount, startColumn);
          // Start new sequence
          currentSymbol = payline[col];
          matchCount = 1;
          startColumn = col;
        }
      }
      // Check final sequence from right
      addWin(currentSymbol, matchCount, startColumn);
    });

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
