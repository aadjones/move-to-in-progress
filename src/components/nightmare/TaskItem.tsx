/**
 * Task Item
 *
 * Individual task card rendering for nightmare zone task list
 */

import type { Task } from '../../taskGraph/types';
import { getDriftTransform } from '../../hooks/useCursorDrift';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

interface TaskItemProps {
  task: Task;
  stage: GameStage;
  cursorDrift: number;
  isDiscoveredBlocked: boolean;
  onTaskClick: (task: Task) => void;
}

export const TaskItem = ({
  task,
  stage,
  cursorDrift,
  isDiscoveredBlocked,
  onTaskClick,
}: TaskItemProps) => {
  const showWiggle = stage === 'chaos';
  const avoidCursor = stage === 'automation' || stage === 'chaos';
  const isCompleted = task.status === 'completed';

  // Don't render the root task in the list
  if (task.id === 'root_task') return null;

  // Determine border color
  let borderColor = 'border-blue-500';
  if (isCompleted) {
    borderColor = 'border-green-500 opacity-50';
  } else if (isDiscoveredBlocked) {
    borderColor = 'border-orange-400/60'; // Subtle orange for discovered blocked tasks
  }

  // Get button text based on stage
  const getButtonText = () => {
    if (stage === 'chaos') {
      const texts = ['Attempt?', 'Try it', 'Click here', 'DO IT'];
      return texts[task.depth % texts.length];
    }
    return 'Attempt';
  };

  return (
    <div
      className="mb-2"
      style={{
        transform: avoidCursor
          ? `translateX(${Math.sin(Date.now() / 1000 + task.depth) * 8}px)`
          : undefined,
        transition: 'transform 0.3s ease',
      }}
    >
      <div
        className={`bg-gray-800 border ${borderColor} rounded p-3 ${showWiggle ? 'wiggle' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {/* Status icon - only show completed */}
              {isCompleted && <span className="text-green-500">✓</span>}

              <div className="text-white text-sm font-medium">
                {task.title}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs mt-1 text-gray-400">
              {task.description}
            </p>
          </div>

          {/* Action button - always show for non-completed tasks */}
          {!isCompleted && (
            <button
              onClick={() => onTaskClick(task)}
              className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                stage === 'chaos'
                  ? 'bg-red-600 hover:bg-red-500'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
              style={{
                transform: getDriftTransform(cursorDrift) || undefined,
              }}
            >
              {getButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
