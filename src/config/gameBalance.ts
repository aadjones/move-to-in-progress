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
  LOW: 70,    // < 70 tasks = early escape, minimal suffering
  MEDIUM: 90, // 70-89 tasks = standard nightmare
  // 90+ tasks = high tier, full chaos experience
} as const;

/**
 * Determine ending tier based on task count
 */
export function getEndingTier(taskCount: number): 'low' | 'medium' | 'high' {
  if (taskCount < ENDING_TIER_THRESHOLDS.LOW) return 'low';
  if (taskCount < ENDING_TIER_THRESHOLDS.MEDIUM) return 'medium';
  return 'high';
}

/**
 * Get task count tier name
 */
export function getTaskTierName(taskCount: number): string {
  if (taskCount < 55) return 'Bureaucratic Initiate';
  if (taskCount < 65) return 'Workflow Prisoner';
  if (taskCount < 75) return 'Process Victim';
  if (taskCount < 85) return 'Compliance Martyr';
  if (taskCount < 100) return 'Task Graph Explorer';
  if (taskCount < 120) return 'Dependency Archaeologist';
  if (taskCount < 150) return 'Recursion Savant';
  return 'Ascendant of the Infinite Graph';
}
