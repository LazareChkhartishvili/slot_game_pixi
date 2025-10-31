// Button Colors
export const BUTTON_COLORS = {
  // Spin button
  spinActive: {
    base: 0xb11d40,
    shadow: 0x7f132e,
    stopIcon: 0x631b33,
  },
  spinInactive: {
    base: 0x789e1a,
    shadow: 0x4c5a0e,
  },

  // Toggle buttons (Auto/Fast)
  toggleActive: {
    base: 0x991b1b, // Red
    shadow: 0x7f1d1d,
  },
  toggleInactive: {
    base: 0x1e40af, // Blue
    shadow: 0x1e3a8a,
  },

  // Common
  overlay: 0x000000,
} as const;

// UI Colors
export const UI_COLORS = {
  // Bet controls
  betPanel: {
    background: 0x241c47,
    border: 0x3344aa,
    buttonActive: 0x242253,
    buttonDisabled: 0x1a1a2e,
  },

  // Balance panel
  balanceLabel: 0xffffff,
  balanceAmount: 0x00ff00,
  winAmount: 0xffff00,

  // Reel
  reelBackground: 0x333333,
  reelMask: 0xffffff,
  reelDim: 0x000000,
  neonBlue: 0x00bfff,

  // Slot machine
  slotBackground: 0x000000,

  // Symbol glow
  symbolGlow: 0xffff00,

  // Text
  textPrimary: 0xffffff,
  textSecondary: 0xa0a3ff,
  textDisabled: 0x3a3a4e,
} as const;

// Button Dimensions
export const BUTTON_DIMENSIONS = {
  spin: {
    width: 240,
    height: 140,
    cornerRadius: 28,
    shadowOffset: 6,
    overlayPadding: 5,
    stopSize: 55,
    stopCorner: 12,
    iconSize: 60,
  },
  toggle: {
    width: 70,
    height: 65,
    cornerRadius: 14,
    shadowOffset: 6,
    overlayPadding: 5,
    iconSize: 30,
  },
  betControl: {
    panelWidth: 330,
    panelHeight: 90,
    panelRadius: 18,
    buttonRadius: 16,
  },
} as const;

// Opacity values
export const OPACITY = {
  overlay: 0.1,
  disabled: 0.6,
  buttonDisabled: 0.5,
  buttonActive: 0.9,
  reelBackground: 0.2,
  reelDim: 0.7,
  slotBackground: 0.15,
  symbolGlow: {
    inner: 0.5,
    outer: 0.25,
  },
} as const;

// Border radius values
export const BORDER_RADIUS = {
  small: 8,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 28,
} as const;
