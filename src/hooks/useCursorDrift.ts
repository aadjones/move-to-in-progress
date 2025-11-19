/**
 * Cursor Drift Hook
 *
 * Manages cursor drift effects based on game stage
 * Returns drift amount that can be applied to button transforms
 */

import { useEffect, useState } from 'react';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';
import type { GameStage } from './useStageProgression';

/**
 * Hook to calculate cursor drift based on game stage
 */
export const useCursorDrift = (stage: GameStage): number => {
  const [cursorDrift, setCursorDrift] = useState(0);

  useEffect(() => {
    if (stage === 'mutating') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_SUBTLE);
    } else if (stage === 'automation') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_OBVIOUS);
    } else if (stage === 'chaos') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_INSANE);
    } else {
      setCursorDrift(0);
    }
  }, [stage]);

  return cursorDrift;
};

/**
 * Helper to generate random drift transform
 */
export const getDriftTransform = (drift: number): string => {
  if (drift === 0) return '';

  const x = Math.random() * drift - drift / 2;
  const y = Math.random() * drift - drift / 2;

  return `translate(${x}px, ${y}px)`;
};
