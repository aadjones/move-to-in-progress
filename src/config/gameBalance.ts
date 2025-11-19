/**
 * Game Balance Constants
 *
 * Tuning values for game difficulty and ending thresholds
 */

/**
 * Task tier thresholds for ending variations
 * Based on total tasks unlocked during gameplay
 */
export const ENDING_TIER_THRESHOLDS = {
  LOW: 50,    // < 50 tasks = early escape, minimal suffering
  MEDIUM: 60, // 50-59 tasks = standard nightmare
  // 60+ tasks = high tier, full chaos experience
} as const;

/**
 * Determine ending tier based on task count
 */
export function getEndingTier(taskCount: number): 'low' | 'medium' | 'high' {
  if (taskCount < ENDING_TIER_THRESHOLDS.LOW) return 'low';
  if (taskCount < ENDING_TIER_THRESHOLDS.MEDIUM) return 'medium';
  return 'high';
}
