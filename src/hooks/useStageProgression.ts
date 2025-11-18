/**
 * Stage Progression Hook
 *
 * Manages automatic stage transitions based on task count
 */

import { useEffect, useState } from 'react';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

/**
 * Hook to automatically progress through game stages based on task count
 */
export const useStageProgression = (totalTasks: number): GameStage => {
  const [stage, setStage] = useState<GameStage>('initial');

  useEffect(() => {
    if (totalTasks >= CHAOS_THRESHOLDS.STAGE_7_CHAOS) {
      setStage('chaos');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_6_AUTOMATION) {
      setStage('automation');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_5_MUTATION) {
      setStage('mutating');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_4_MULTIPLICATION) {
      setStage('multiplying');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_3_INTERACTIONS_BEGIN) {
      setStage('resolving');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_2_TASKS_APPEAR) {
      setStage('started');
    }
  }, [totalTasks]);

  return stage;
};

/**
 * Helper to get numeric stage number
 */
export const getStageNumber = (stage: GameStage): number => {
  if (stage === 'chaos') return 7;
  if (stage === 'automation') return 6;
  if (stage === 'mutating') return 5;
  if (stage === 'multiplying') return 4;
  if (stage === 'resolving') return 3;
  if (stage === 'started') return 2;
  return 1;
};
