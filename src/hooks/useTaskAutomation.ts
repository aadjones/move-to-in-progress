/**
 * Task Automation Hook
 *
 * Manages automatic task completion and background audio during chaos stages
 */

import { useEffect } from 'react';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';
import type { TaskManager } from '../taskGraph/TaskManager';
import type { GameStage } from './useStageProgression';

interface TaskAutomationOptions {
  stage: GameStage;
  totalTasks: number;
  taskManager: TaskManager;
  onTaskComplete: () => void;
  audio: {
    playNightmarePing: (level: number) => void;
    startNightmarePings: (count: number) => void;
    stopNightmarePings: () => void;
    playBreakdownPing: (level: number) => void;
    startBreakdownPings: (count: number) => void;
    stopBreakdownPings: () => void;
  };
}

/**
 * Hook to handle automatic task completion during automation/chaos stages
 */
export const useTaskAutomation = ({
  stage,
  totalTasks,
  taskManager,
  onTaskComplete,
  audio,
}: TaskAutomationOptions): void => {
  // Auto-complete random tasks in automation/chaos/breakdown/annihilation stages
  useEffect(() => {
    if (stage !== 'automation' && stage !== 'chaos' && stage !== 'breakdown' && stage !== 'annihilation') return;
    if (totalTasks >= CHAOS_THRESHOLDS.ESCAPE_THRESHOLD) return;

    const autoCompleteInterval = setInterval(() => {
      const completableTasks = taskManager.getCompletableTasks();
      const randomTask = completableTasks[Math.floor(Math.random() * completableTasks.length)];

      if (randomTask) {
        taskManager.completeTask(randomTask.id);
        onTaskComplete();
        // Use breakdown ping in Stage 8+, nightmare ping in earlier stages
        if (stage === 'breakdown' || stage === 'annihilation') {
          audio.playBreakdownPing(Math.random() * 0.5);
        } else {
          audio.playNightmarePing(Math.random() * 0.5);
        }
      }
    }, stage === 'annihilation' ? 1000 : stage === 'breakdown' ? 2000 : stage === 'chaos' ? 3000 : 5000); // Accelerating chaos

    return () => clearInterval(autoCompleteInterval);
  }, [stage, totalTasks, taskManager, onTaskComplete, audio]);

  // Background pings during automation/chaos/breakdown/annihilation
  useEffect(() => {
    if (stage === 'breakdown' || stage === 'annihilation') {
      // Stage 8-9: Breakdown audio (dual voices, polyrhythm, accelerating in Stage 9)
      audio.stopNightmarePings(); // Stop normal pings
      audio.startBreakdownPings(totalTasks);
      return () => audio.stopBreakdownPings();
    } else if (stage === 'automation' || stage === 'chaos') {
      // Stage 6-7: Normal nightmare pings
      audio.startNightmarePings(totalTasks);
      return () => audio.stopNightmarePings();
    }
  }, [stage, totalTasks, audio]);
};
