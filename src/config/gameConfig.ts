/**
 * Game Configuration
 * Centralized configuration for gameplay balance, thresholds, and constants
 */

/**
 * Chaos thresholds for nightmare zone progression
 * These determine when each stage of the nightmare activates based on task count
 */
export const CHAOS_THRESHOLDS = {
  STAGE_2_TASKS_APPEAR: 1,        // Tasks start appearing
  STAGE_3_INTERACTIONS_BEGIN: 3,  // Start requiring interactions
  STAGE_4_MULTIPLICATION: 8,      // Tasks multiply faster
  STAGE_5_MUTATION: 12,           // Cursor drift, visual chaos
  STAGE_6_AUTOMATION: 18,         // Auto-expansion, overwhelming
  STAGE_7_CHAOS: 24,              // Full chaos, toast spam
  STAGE_8_TIME_THRESHOLD: 10000,  // Stage 8: 10 seconds in Stage 7
  STAGE_9_TIME_THRESHOLD: 60000,  // Stage 9: 60 seconds in Stage 8 - total annihilation
  ESCAPE_THRESHOLD: 50,           // Escape hatches available
  CURSOR_DRIFT_SUBTLE: 15,        // More noticeable
  CURSOR_DRIFT_OBVIOUS: 30,       // Much harder to click
  CURSOR_DRIFT_INSANE: 50,        // Nearly impossible
} as const;

/**
 * Audio configuration for sound effects and ambience
 */
export const AUDIO_CONFIG = {
  PING_FREQUENCY: 800, // Hz - Slack-like notification ping
  PING_DURATION: 0.1, // seconds
  KNOCK_FREQUENCIES: [400, 500], // Two-tone knock pattern
  KNOCK_TIMING: [0, 0.08], // Quick double knock
  FALLING_PITCH_SHIFT_MAX: -12, // semitones down
  NIGHTMARE_BASE_INTERVAL: 5000, // ms between pings
  NIGHTMARE_FAST_INTERVAL: 1000, // ms at max chaos
  REVERB_DECAY: 2, // seconds
  DISTORTION_AMOUNT: 0.8,

  // Stage 8 breakdown audio parameters
  STAGE_8: {
    SECOND_SYNTH_FREQUENCY: 600, // Lower than primary (800)
    SECOND_SYNTH_INTERVAL_RATIO: 0.7, // 70% of primary interval (polyrhythm)
    PITCH_VARIANCE: 5, // ±5 semitones per ping
    BITCRUSH_BITS: 4, // Sample rate reduction
    FILTER_FREQ_START: 2000, // Hz - filter sweep start
    FILTER_FREQ_END: 400, // Hz - muffled endpoint
    PAN_RANGE: 1.0, // Full stereo width
    TREMOLO_FREQUENCY: 8, // Hz - amplitude modulation
    TREMOLO_DEPTH: 0.5, // 50% amplitude modulation
  },
} as const;
