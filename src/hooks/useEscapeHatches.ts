/**
 * Escape Hatch Handlers Hook
 *
 * Provides handlers for the three escape hatch endings
 */

import { getStageNumber } from './useStageProgression';
import type { TaskManager } from '../taskGraph/TaskManager';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';
type GameEndingType = 'burn' | 'delegate' | 'assimilate';

interface EscapeHatchHandlers {
  handleBurnItDown: () => void;
  handleDelegate: () => void;
  handleAssimilate: () => void;
}

interface UseEscapeHatchesOptions {
  taskManager: TaskManager;
  stage: GameStage;
  onGameEnding: (endingType: GameEndingType, tasksUnlocked: number, nightmareStage: number) => void;
}

/**
 * Hook to generate escape hatch handlers for game endings
 */
export const useEscapeHatches = ({
  taskManager,
  stage,
  onGameEnding,
}: UseEscapeHatchesOptions): EscapeHatchHandlers => {
  const handleBurnItDown = () => {
    const count = taskManager.getTaskCount();
    const stageNumber = getStageNumber(stage);
    taskManager.executeBurnItDown();
    onGameEnding('burn', count, stageNumber);
  };

  const handleDelegate = () => {
    const count = taskManager.getTaskCount();
    const stageNumber = getStageNumber(stage);
    taskManager.executeDelegate();
    onGameEnding('delegate', count, stageNumber);
  };

  const handleAssimilate = () => {
    const count = taskManager.getTaskCount();
    const stageNumber = getStageNumber(stage);
    taskManager.executeAssimilate('Senior Bureaucracy Facilitator');
    onGameEnding('assimilate', count, stageNumber);
  };

  return {
    handleBurnItDown,
    handleDelegate,
    handleAssimilate,
  };
};
