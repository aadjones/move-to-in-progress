/**
 * Animation and timing configuration
 * Centralized parameters for the falling card experience
 */

export const ANIMATION_CONFIG = {
  // Falling phase
  falling: {
    /** Distance the user must scroll to reach the bottom (in pixels) */
    scrollDistance: 5000,

    /** Total page height for the falling phase (in pixels) */
    pageHeight: 8000,

    /** Card fall animation duration (in seconds) */
    cardFallDuration: 5,

    /** Distance the card travels during fall (in pixels) */
    cardFallDistance: 6000,

    /** Duration of the initial hesitation/pull effect (in milliseconds) */
    hesitationDuration: 300,

    /** Scroll interval for audio pings (in pixels) */
    audioTriggerInterval: 200,
  },

  // Ground phase
  ground: {
    /** How long to show "YOU HAVE REACHED THE BOTTOM" before nightmare (in milliseconds) */
    lingerDuration: 3000,
  },

  // Glitch effects
  glitch: {
    /** Maximum hue rotation in degrees */
    maxHueRotation: 180,

    /** Maximum scanline opacity */
    maxScanlineOpacity: 0.3,
  },
} as const;
