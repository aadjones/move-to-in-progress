/**
 * Main Button Hook
 *
 * Returns props for the main action button based on game stage and task status
 */

import type { Task } from '../taskGraph/types';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

interface MainButtonProps {
  text: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
  subtitle?: string;
}

interface UseMainButtonOptions {
  stage: GameStage;
  rootTask: Task | null;
  totalTasks: number;
  onStartTask: () => void;
}

/**
 * Hook to generate main action button props
 */
export const useMainButton = ({
  stage,
  rootTask,
  totalTasks,
  onStartTask,
}: UseMainButtonOptions): MainButtonProps => {
  if (stage === 'initial') {
    return {
      text: 'Start Task',
      onClick: onStartTask,
      color: 'bg-blue-600 hover:bg-blue-500',
    };
  }

  // After started, show disabled button
  return {
    text: rootTask?.status === 'completed' ? 'Task Complete!' : 'Attempt Task',
    onClick: () => {},
    color: rootTask?.status === 'completed'
      ? 'bg-green-600'
      : 'bg-gray-500 cursor-not-allowed',
    disabled: rootTask?.status !== 'completed',
    subtitle: rootTask?.status !== 'completed'
      ? `${totalTasks} action${totalTasks !== 1 ? 's' : ''} required first`
      : undefined,
  };
};
