/**
 * Stage Progression Hook
 *
 * Manages automatic stage transitions based on task count and time
 */

import { useEffect, useState, useRef } from 'react';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';

export type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'breakdown' | 'annihilation' | 'singularity' | 'ending';

/**
 * Hook to automatically progress through game stages based on task count and time in chaos
 */
export const useStageProgression = (totalTasks: number): GameStage => {
  const [stage, setStage] = useState<GameStage>('initial');
  const chaosStartTimeRef = useRef<number | null>(null);
  const stage8TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stage9TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Task-based stage progression
    // Don't override timer-based stages (breakdown, annihilation)
    // But allow singularity since it's task-count based
    if (stage === 'breakdown' || stage === 'annihilation') {
      // Still check for singularity transition even from these stages
      if (totalTasks >= CHAOS_THRESHOLDS.STAGE_10_SINGULARITY) {
        setStage('singularity');
      }
      return;
    }

    if (totalTasks >= CHAOS_THRESHOLDS.STAGE_10_SINGULARITY) {
      // Enter singularity stage - notification explosion
      if (stage !== 'singularity') {
        setStage('singularity');
      }
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_7_CHAOS) {
      // Enter chaos stage
      if (stage !== 'chaos') {
        setStage('chaos');
      }
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_6_AUTOMATION) {
      if (stage !== 'automation') {
        setStage('automation');
        // Clear chaos timers if we drop back below chaos
        if (stage8TimerRef.current) {
          clearTimeout(stage8TimerRef.current);
          stage8TimerRef.current = null;
        }
        if (stage9TimerRef.current) {
          clearTimeout(stage9TimerRef.current);
          stage9TimerRef.current = null;
        }
        chaosStartTimeRef.current = null;
      }
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_5_MUTATION) {
      if (stage !== 'mutating') setStage('mutating');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_4_MULTIPLICATION) {
      if (stage !== 'multiplying') setStage('multiplying');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_3_INTERACTIONS_BEGIN) {
      if (stage !== 'resolving') setStage('resolving');
    } else if (totalTasks >= CHAOS_THRESHOLDS.STAGE_2_TASKS_APPEAR) {
      if (stage !== 'started') setStage('started');
    }
  }, [totalTasks, stage]);

  // Separate effect for Stage 8 timer - only runs when entering chaos stage
  useEffect(() => {
    if (stage === 'chaos' && !stage8TimerRef.current) {
      // Start timer for Stage 8 breakdown
      chaosStartTimeRef.current = Date.now();

      console.log('[Stage] Starting 10-second timer for Stage 8 breakdown');
      stage8TimerRef.current = setTimeout(() => {
        console.log('[Stage] Timer elapsed - transitioning to Stage 8 breakdown');
        setStage('breakdown');
      }, CHAOS_THRESHOLDS.STAGE_8_TIME_THRESHOLD);
    }
  }, [stage]);

  // Separate effect for Stage 9 timer - only runs when entering breakdown stage
  useEffect(() => {
    if (stage === 'breakdown' && !stage9TimerRef.current) {
      console.log('[Stage] Starting 60-second timer for Stage 9 annihilation');
      stage9TimerRef.current = setTimeout(() => {
        console.log('[Stage] Timer elapsed - transitioning to Stage 9 annihilation');
        setStage('annihilation');
      }, CHAOS_THRESHOLDS.STAGE_9_TIME_THRESHOLD);
    }
  }, [stage]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (stage8TimerRef.current) {
        clearTimeout(stage8TimerRef.current);
      }
      if (stage9TimerRef.current) {
        clearTimeout(stage9TimerRef.current);
      }
    };
  }, []);

  return stage;
};

/**
 * Helper to get numeric stage number
 */
export const getStageNumber = (stage: GameStage): number => {
  if (stage === 'singularity') return 9;
  if (stage === 'annihilation') return 8;
  if (stage === 'breakdown') return 7;
  if (stage === 'chaos') return 6;
  if (stage === 'automation') return 5;
  if (stage === 'mutating') return 4;
  if (stage === 'multiplying') return 3;
  if (stage === 'resolving') return 2;
  if (stage === 'started') return 1;
  return 0;
};

/**
 * Helper to get stage name (Dante's Inferno meets corporate hell)
 */
export const getStageName = (stageNumber: number): string => {
  switch (stageNumber) {
    case 0: return 'Vestibule (Innocence)';
    case 1: return 'First Circle (Limbo)';
    case 2: return 'Second Circle (The Blockers)';
    case 3: return 'Third Circle (Multiplication)';
    case 4: return 'Fourth Circle (Mutation)';
    case 5: return 'Fifth Circle (The Automated)';
    case 6: return 'Sixth Circle (Full Chaos)';
    case 7: return 'Seventh Circle (Breakdown)';
    case 8: return 'Eighth Circle (Annihilation)';
    case 9: return 'Ninth Circle (Singularity)';
    default: return 'Unknown';
  }
};
