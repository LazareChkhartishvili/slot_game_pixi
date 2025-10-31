export const GAME_CONFIG = {
  // Reel configuration
  REELS: {
    COLUMNS: 5,
    ROWS: 3,
  },

  // Symbol configuration
  SYMBOLS: {
    TOTAL_TYPES: 8,
    MULTIPLIER_BASE: 1,
  },

  // Animation timing
  ANIMATION: {
    REEL_SPIN_DURATION: 800,
    REEL_START_DELAY_PER_REEL: 120,
    REEL_STOP_DELAY_PER_REEL: 200,
    UI_DISABLE_DURATION: 1400,
    SPIN_SPEED: 15,
    BASE_DURATION: 700 / 15,
  },

  // Initial game state
  INITIAL_STATE: {
    BALANCE: 1000,
    BET_AMOUNT: 1.0,
    MIN_BET: 0.2,
    MAX_BET: 100.0,
    BET_STEP: 0.2,
  },

  // Win calculation
  WIN_CALCULATION: {
    MIN_MATCHES_FOR_WIN: 3,
    // Paytable: [symbolIndex][matches-3] = multiplier
    // Multipliers increase with symbol value and match count
    // Increased multipliers for more profitable gameplay
    PAYTABLE: [
      // Symbol 0 (lowest value) - 3, 4, 5 matches
      [5, 12, 25],
      // Symbol 1
      [8, 18, 35],
      // Symbol 2
      [12, 25, 50],
      // Symbol 3
      [18, 40, 80],
      // Symbol 4
      [25, 60, 120],
      // Symbol 5
      [40, 100, 200],
      // Symbol 6
      [60, 150, 300],
      // Symbol 7 (highest value)
      [100, 250, 500],
    ],
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
