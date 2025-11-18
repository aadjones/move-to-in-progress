/**
 * Task Automation Hook
 *
 * Manages automatic task completion and background audio during chaos stages
 */

import { useEffect } from 'react';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';
import type { TaskManager } from '../taskGraph/TaskManager';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

interface TaskAutomationOptions {
  stage: GameStage;
  totalTasks: number;
  taskManager: TaskManager;
  onTaskComplete: () => void;
  audio: {
    playNightmarePing: (level: number) => void;
    startNightmarePings: (count: number) => void;
    stopNightmarePings: () => void;
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
  // Auto-complete random tasks in automation/chaos stages
  useEffect(() => {
    if (stage !== 'automation' && stage !== 'chaos') return;
    if (totalTasks >= CHAOS_THRESHOLDS.ESCAPE_THRESHOLD) return;

    const autoCompleteInterval = setInterval(() => {
      const completableTasks = taskManager.getCompletableTasks();
      const randomTask = completableTasks[Math.floor(Math.random() * completableTasks.length)];

      if (randomTask) {
        taskManager.completeTask(randomTask.id);
        onTaskComplete();
        audio.playNightmarePing(Math.random() * 0.5);
      }
    }, stage === 'chaos' ? 3000 : 5000); // Faster in chaos mode

    return () => clearInterval(autoCompleteInterval);
  }, [stage, totalTasks, taskManager, onTaskComplete, audio]);

  // Background pings during automation/chaos
  useEffect(() => {
    if (stage === 'automation' || stage === 'chaos') {
      audio.startNightmarePings(totalTasks);
      return () => audio.stopNightmarePings();
    }
  }, [stage, totalTasks, audio]);
};
