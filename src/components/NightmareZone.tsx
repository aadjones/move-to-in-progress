import { useState, useEffect, useCallback } from 'react';
import { Subtask } from '../types';
import { acceptanceCriteria, subtaskTemplates, titleMutations, toastMessages } from '../data/subtasks';
import { countSubtasks, flattenUnexpanded, mutateTaskTitles, updateSubtaskById } from '../utils/subtaskTree';
import { TaskDetailModal } from './TaskDetailModal';
import { acceptanceCriteriaContent, subtaskContent, TaskContent } from '../data/taskContent';
import { getRandomComment, getDemonicCharacter } from '../data/characters';

// Redesigned chaos thresholds for gradual 7-stage escalation
const CHAOS_THRESHOLDS = {
  STAGE_1_ACCEPTANCE_CRITERIA: 1, // Show acceptance criteria
  STAGE_2_REVEAL_BLOCKERS: 1,     // User clicks to see details
  STAGE_3_HELPFUL_SYSTEM: 3,      // System "helps" by creating subtasks
  STAGE_4_MULTIPLICATION: 5,      // Subtasks spawn more subtasks
  STAGE_5_MUTATION: 8,            // Titles start mutating, cursor drift begins
  STAGE_6_AUTOMATION: 12,         // Auto-expansion, AI "helping"
  STAGE_7_CHAOS: 18,              // Full chaos, toast spam
  MAX_SUBTASKS: 25,               // Exit condition
  CURSOR_DRIFT_SUBTLE: 3,         // Stage 5: 3px drift
  CURSOR_DRIFT_OBVIOUS: 10,       // Stage 6: 10px drift
  CURSOR_DRIFT_INSANE: 25,        // Stage 7: 25px drift
} as const;

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

interface NightmareZoneProps {
  onComplete: () => void;
  onLeave: () => void;
  audio: {
    playNightmarePing: (chaosLevel: number) => void;
    startNightmarePings: (subtaskCount: number) => void;
    stopNightmarePings: () => void;
    playSlackKnock: () => void;
  };
}

export const NightmareZone = ({ onComplete, onLeave, audio }: NightmareZoneProps) => {
  const [stage, setStage] = useState<GameStage>('initial');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [cursorDrift, setCursorDrift] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Subtask | null>(null);
  const [selectedTaskContent, setSelectedTaskContent] = useState<TaskContent | null>(null);

  const totalSubtasks = countSubtasks(subtasks);

  // Generate random subtask
  const generateSubtask = useCallback((isAcceptanceCriteria = false): Subtask => {
    if (isAcceptanceCriteria) {
      // Use predefined acceptance criteria for initial state
      const criteria = acceptanceCriteria[subtasks.length % acceptanceCriteria.length];
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: criteria.title,
        status: criteria.status,
        children: [],
        expanded: false,
        revealed: false,
        isAcceptanceCriteria: true,
        contentKey: criteria.title, // Link to content database
        comments: [],
      };
    } else {
      // Generate random subtask from templates
      const template = subtaskTemplates[Math.floor(Math.random() * subtaskTemplates.length)];
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: template.title,
        status: template.status,
        children: [],
        expanded: false,
        revealed: false,
        contentKey: template.title, // Link to content database
        comments: [],
      };
    }
  }, [subtasks.length]);

  // STAGE 0 → 1: Start Task (show acceptance criteria)
  const handleStartTask = () => {
    const criteria = acceptanceCriteria.map((c) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: c.title,
      status: c.status,
      children: [],
      expanded: false,
      revealed: false,
      isAcceptanceCriteria: true,
      contentKey: c.title, // Link to content database
      comments: [],
    }));
    setSubtasks(criteria);
    setStage('started');
    audio.playNightmarePing(0.1);
  };

  // STAGE 1 → 2: View Details (reveal blockers)
  const handleViewDetails = () => {
    setSubtasks((prev) =>
      prev.map((task) => ({
        ...task,
        revealed: true,
      }))
    );
    setStage('blockers-revealed');
    audio.playNightmarePing(0.2);
  };

  // STAGE 2 → 3: Resolve Blockers (spawn helpful subtasks)
  const handleResolveBlockers = () => {
    // Add 2 subtasks under each acceptance criteria, with blockers revealed
    setSubtasks((prev) =>
      prev.map((criteria) => ({
        ...criteria,
        expanded: true,
        children: [
          { ...generateSubtask(), revealed: true }, // Show blockers immediately for spawned tasks
          { ...generateSubtask(), revealed: true },
        ],
      }))
    );
    setStage('resolving');
    setShowAIHelper(true);

    // Hide AI helper message after 3 seconds
    setTimeout(() => setShowAIHelper(false), 3000);
  };

  // STAGE 3+: Click on a subtask to "resolve" it (spawns more children)
  const handleResolveSubtask = (subtaskId: string) => {
    const spawnCount = totalSubtasks >= CHAOS_THRESHOLDS.STAGE_6_AUTOMATION
      ? Math.random() > 0.5 ? 3 : 2  // Stage 6: spawn 2-3
      : Math.random() > 0.5 ? 2 : 1; // Earlier: spawn 1-2

    // All spawned children have blockers revealed immediately
    const newChildren = Array.from({ length: spawnCount }, () => ({
      ...generateSubtask(),
      revealed: true, // Blockers are always visible on nested subtasks
    }));

    setSubtasks((prev) =>
      updateSubtaskById(prev, subtaskId, (task) => ({
        ...task,
        expanded: true,
        resolved: true,
        children: [...(task.children || []), ...newChildren],
      }))
    );

    audio.playNightmarePing(Math.min(totalSubtasks / 25, 1));
  };

  // Update stage based on subtask count
  useEffect(() => {
    if (totalSubtasks >= CHAOS_THRESHOLDS.STAGE_7_CHAOS && stage !== 'ending') {
      setStage('chaos');
    } else if (totalSubtasks >= CHAOS_THRESHOLDS.STAGE_6_AUTOMATION && stage === 'mutating') {
      setStage('automation');
    } else if (totalSubtasks >= CHAOS_THRESHOLDS.STAGE_5_MUTATION && stage === 'resolving') {
      setStage('mutating');
    } else if (totalSubtasks >= CHAOS_THRESHOLDS.STAGE_4_MULTIPLICATION && stage === 'resolving') {
      setStage('multiplying');
    }
  }, [totalSubtasks, stage]);

  // STAGE 5+: Cursor drift
  useEffect(() => {
    if (stage === 'mutating') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_SUBTLE);
    } else if (stage === 'automation') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_OBVIOUS);
    } else if (stage === 'chaos') {
      setCursorDrift(CHAOS_THRESHOLDS.CURSOR_DRIFT_INSANE);
    }
  }, [stage]);

  // STAGE 5+: Title mutations
  useEffect(() => {
    if (stage !== 'mutating' && stage !== 'automation' && stage !== 'chaos') return;

    const mutationInterval = setInterval(() => {
      setSubtasks((prev) => mutateTaskTitles(prev, titleMutations));
    }, 4000);

    return () => clearInterval(mutationInterval);
  }, [stage]);

  // STAGE 6: Auto-expand random subtask
  useEffect(() => {
    if (stage !== 'automation' && stage !== 'chaos') return;
    if (totalSubtasks >= CHAOS_THRESHOLDS.MAX_SUBTASKS) return;

    const autoExpandInterval = setInterval(() => {
      const unexpandedTasks = flattenUnexpanded(subtasks);
      const randomSubtask = unexpandedTasks[Math.floor(Math.random() * unexpandedTasks.length)];

      if (randomSubtask && !randomSubtask.expanded) {
        handleResolveSubtask(randomSubtask.id);
      }
    }, 5000); // Auto-expand every 5 seconds

    return () => clearInterval(autoExpandInterval);
  }, [stage, totalSubtasks, subtasks]);

  // STAGE 6+: Background pings
  useEffect(() => {
    if (stage === 'automation' || stage === 'chaos') {
      audio.startNightmarePings(totalSubtasks);
      return () => audio.stopNightmarePings();
    }
  }, [stage, totalSubtasks]);

  // STAGE 7: Toast spam
  useEffect(() => {
    if (stage !== 'chaos') return;

    const toastInterval = setInterval(() => {
      const message = toastMessages[Math.floor(Math.random() * toastMessages.length)];
      const newToast = { id: Date.now(), message };
      setToasts((prev) => [...prev, newToast]);

      audio.playSlackKnock();

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    }, 2500);

    return () => clearInterval(toastInterval);
  }, [stage]);

  // Exit condition: 25+ subtasks
  useEffect(() => {
    if (totalSubtasks >= CHAOS_THRESHOLDS.MAX_SUBTASKS) {
      setStage('ending');
      audio.stopNightmarePings();
    }
  }, [totalSubtasks]);

  // CHAOS FEATURE: Spawn random comments during automation/chaos stages
  useEffect(() => {
    if (stage !== 'automation' && stage !== 'chaos') return;

    const commentInterval = setInterval(() => {
      // Pick a random subtask and add a cursed comment
      const allTasks = flattenUnexpanded(subtasks);
      if (allTasks.length === 0) return;

      const randomTask = allTasks[Math.floor(Math.random() * allTasks.length)];
      const isDemonic = stage === 'chaos';
      const characterKey = isDemonic
        ? getDemonicCharacter(Math.random() > 0.5 ? 'sarah' : 'jerry')
        : Math.random() > 0.5 ? 'sarah' : 'bot';

      const newComment = {
        author: characterKey,
        text: getRandomComment(characterKey),
        timestamp: 'just now',
        isAuto: true,
      };

      setSubtasks((prev) =>
        updateSubtaskById(prev, randomTask.id, (task) => ({
          ...task,
          comments: [...(task.comments || []), newComment],
        }))
      );
    }, stage === 'chaos' ? 4000 : 8000); // Faster in chaos mode

    return () => clearInterval(commentInterval);
  }, [stage, subtasks]);

  // Handle task click to open modal
  const handleTaskClick = (task: Subtask) => {
    setSelectedTask(task);

    // Look up content from the database
    if (task.contentKey) {
      const content = acceptanceCriteriaContent[task.contentKey] ||
                      subtaskContent[task.contentKey];
      if (content) {
        // Merge dynamic comments with initial comments
        const mergedContent = {
          ...content,
          initialComments: [...content.initialComments, ...(task.comments || [])],
        };
        setSelectedTaskContent(mergedContent);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setSelectedTaskContent(null);
  };

  // Get button text based on chaos level and depth
  const getWorkaroundButtonText = (level: number) => {
    if (stage === 'chaos') {
      return ['Give up', 'Just... try something', 'Why', 'HELP'][Math.min(level, 3)];
    }
    if (stage === 'automation' || stage === 'mutating') {
      return level > 2 ? 'Try anyway' : 'Find workaround';
    }
    return 'Find workaround';
  };

  // Render subtasks recursively
  const renderSubtask = (subtask: Subtask, level: number = 0) => {
    const showWiggle = stage === 'chaos';
    const avoidCursor = stage === 'automation' || stage === 'chaos';
    const isRevealed = subtask.revealed;
    const canResolve = !subtask.expanded && stage !== 'ending';

    return (
      <div
        key={subtask.id}
        className={`ml-${level * 4} mb-2`}
        style={{
          transform: avoidCursor
            ? `translateX(${Math.sin(Date.now() / 1000 + level) * 8}px)`
            : undefined,
          transition: 'transform 0.3s ease',
        }}
      >
        <div
          className={`bg-gray-800 border ${
            subtask.isAcceptanceCriteria ? 'border-blue-500' : 'border-red-500'
          } rounded p-3 ${showWiggle ? 'wiggle' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {/* Show warning icon if workaround was attempted (spawned children) */}
                {subtask.resolved && <span className="text-yellow-500">⚠</span>}
                <button
                  onClick={() => handleTaskClick(subtask)}
                  className="text-white text-sm font-medium hover:text-blue-300 transition-colors text-left underline decoration-dotted"
                >
                  {subtask.title}
                </button>
                {/* Show comment count badge if comments exist */}
                {subtask.comments && subtask.comments.length > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 animate-pulse">
                    {subtask.comments.length}
                  </span>
                )}
              </div>

              {/* Show blocker text only if revealed */}
              {isRevealed && (
                <p className="text-red-400 text-xs mt-1">
                  BLOCKED: {subtask.status}
                </p>
              )}
            </div>

            {/* Workaround button (only show after blockers are revealed) */}
            {canResolve && stage !== 'initial' && stage !== 'started' && isRevealed && (
              <button
                onClick={() => handleResolveSubtask(subtask.id)}
                className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                  stage === 'chaos'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-yellow-600 hover:bg-yellow-500'
                }`}
                style={{
                  transform: cursorDrift > 0
                    ? `translate(${Math.random() * cursorDrift - cursorDrift / 2}px, ${
                        Math.random() * cursorDrift - cursorDrift / 2
                      }px)`
                    : undefined,
                }}
              >
                {getWorkaroundButtonText(level)}
              </button>
            )}
          </div>
        </div>

        {/* Render children */}
        {subtask.children && subtask.children.length > 0 && (
          <div className="mt-2">
            {subtask.children.map((child) => renderSubtask(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Main action button text and handler
  const getMainButton = () => {
    if (stage === 'ending') {
      return null; // Show ending buttons instead
    }

    if (stage === 'initial') {
      return {
        text: 'Start Task',
        onClick: handleStartTask,
        color: 'bg-blue-600 hover:bg-blue-500',
      };
    }

    if (stage === 'started') {
      return {
        text: 'View Details',
        onClick: handleViewDetails,
        color: 'bg-blue-600 hover:bg-blue-500',
      };
    }

    if (stage === 'blockers-revealed') {
      return {
        text: 'Resolve Blockers',
        onClick: handleResolveBlockers,
        color: 'bg-green-600 hover:bg-green-500',
      };
    }

    // Stage 3+: Show disabled "Mark Complete" button
    return {
      text: 'Mark Complete',
      onClick: () => {},
      color: 'bg-gray-500 cursor-not-allowed',
      disabled: true,
      subtitle: 'Complete all subtasks first',
    };
  };

  const mainButton = getMainButton();

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto ${
        stage === 'chaos' ? 'flicker' : ''
      }`}
    >
      <div className="max-w-3xl w-full p-8">
        {/* Original Task Card */}
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Refactor Notifications System
            </h2>
            {stage !== 'initial' && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                {totalSubtasks} subtask{totalSubtasks !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Status badge */}
          {stage === 'initial' && (
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Ready to Start
              </span>
            </div>
          )}

          {/* AI Helper Message */}
          {showAIHelper && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <p className="text-sm text-blue-900">
                I've created subtasks to help you resolve these blockers!
              </p>
            </div>
          )}

          {/* Main action button */}
          {mainButton && (
            <div>
              <button
                onClick={mainButton.onClick}
                disabled={mainButton.disabled}
                className={`w-full ${mainButton.color} text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
              >
                {mainButton.text}
              </button>
              {mainButton.subtitle && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  {mainButton.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Ending buttons */}
          {stage === 'ending' && (
            <div className="space-y-3">
              <button
                onClick={onComplete}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Burn it all down and mark complete anyway
              </button>
              <button
                onClick={onLeave}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Abandon this task
              </button>
            </div>
          )}
        </div>

        {/* Escape Messages */}
        {stage === 'mutating' && (
          <div className="text-center mb-4">
            <p className="text-red-500 text-sm opacity-70">
              You cannot escape until this is resolved
            </p>
          </div>
        )}

        {stage === 'automation' && (
          <div className="text-center mb-4">
            <p className="text-red-500 text-base font-bold glitch">
              You cannot escape until this is resolved
            </p>
          </div>
        )}

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <div className="space-y-2">{subtasks.map((s) => renderSubtask(s))}</div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-[60] max-w-sm">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-white rounded-lg shadow-lg p-4 animate-slide-in border-l-4 border-blue-500"
            >
              <p className="text-sm text-gray-800">{toast.message}</p>
            </div>
          ))}
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            content={selectedTaskContent}
            onClose={handleCloseModal}
            stage={stage}
          />
        )}
      </div>
    </div>
  );
};
