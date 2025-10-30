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
    BET_AMOUNT: 0.2,
    MIN_BET: 0.2,
    MAX_BET: 100.0,
    BET_STEP: 0.2,
  },

  // Win calculation
  WIN_CALCULATION: {
    MIN_MATCHES_FOR_WIN: 3,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
