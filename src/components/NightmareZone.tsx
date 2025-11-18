import { useState, useEffect, useCallback } from 'react';
import { TaskManager } from '../taskGraph/TaskManager';
import type { Task } from '../taskGraph/types';
import { InteractionModal } from '../interactions/InteractionModal';
import type { InteractionResult } from '../interactions/types';
import { toastMessages } from '../data/subtasks';
import { CHAOS_THRESHOLDS } from '../config/gameConfig';
import { EscapeHatchPanel } from './nightmare/EscapeHatchPanel';

type GameStage = 'initial' | 'started' | 'blockers-revealed' | 'resolving' | 'multiplying' | 'mutating' | 'automation' | 'chaos' | 'ending';

interface NightmareZoneProps {
  onComplete?: () => void;
  onLeave?: () => void;
  onGameEnding: (endingType: 'burn' | 'delegate' | 'assimilate', tasksUnlocked: number, nightmareStage: number) => void;
  audio: {
    playNightmarePing: (chaosLevel: number) => void;
    startNightmarePings: (subtaskCount: number) => void;
    stopNightmarePings: () => void;
    playSlackKnock: () => void;
  };
}

export const NightmareZone = ({ onGameEnding, audio }: NightmareZoneProps) => {
  const [stage, setStage] = useState<GameStage>('initial');
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cursorDrift, setCursorDrift] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string>('');
  const [discoveredBlockedTasks, setDiscoveredBlockedTasks] = useState<Set<string>>(new Set());

  const totalTasks = tasks.filter((t) => t.id !== 'root_task' && t.status !== 'completed').length;
  const rootTask = taskManager.getRootTask();

  // Sync tasks from manager
  const refreshTasks = useCallback(() => {
    setTasks(taskManager.getTasks());
  }, [taskManager]);

  // Initialize tasks on mount
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // STAGE 0 → 1: Start Task
  const handleStartTask = () => {
    setStage('started');
    refreshTasks();
    audio.playNightmarePing(0.1);
  };

  // Generate absurd blocking reason based on task type
  const getBlockedReason = (task: Task) => {
    // Archetype-specific reasons for more variety
    const reasonsByArchetype: Record<string, string[]> = {
      training: [
        "The training video was recorded in 2015 and references a product we no longer sell.",
        "This course requires completion of Training Module XR-7, which was never created.",
        "The LMS system is undergoing maintenance scheduled to complete 'sometime in Q2'.",
        "Your training account was deactivated when you changed teams. Reactivation takes 2-3 weeks.",
      ],
      'approval-request': [
        "Your manager's manager's manager needs to sign off, but they're on a 6-month sabbatical.",
        "This requires VP approval. The VP position has been vacant since March.",
        "The approval workflow references a role that was eliminated in the last reorganization.",
        "Sarah from Finance needs to approve this, but Sarah left 8 months ago.",
      ],
      'form-submission': [
        "The form submission button has been disabled pending a security review.",
        "This form requires your employee ID from the old HR system we migrated from in 2019.",
        "The form must be reviewed by the Compliance Committee, which meets bi-annually.",
        "Required field 'Department Code' accepts values that no longer exist in the company.",
      ],
      documentation: [
        "The documentation is locked in Confluence. The space admin left the company.",
        "This links to the wiki page, which was deprecated and archived without replacement.",
        "The relevant documentation was deleted during a 'cleanup initiative' last year.",
        "These docs reference the old process. New process documentation is 'coming soon'.",
      ],
      'system-access': [
        "Access requests must be approved by the Security team, currently understaffed.",
        "The VPN certificate expired. IT says they'll get to it 'when resources allow'.",
        "This system uses SSO with a provider we stopped paying for 6 months ago.",
        "Your access was revoked when you changed roles. Re-provisioning takes 4-6 weeks.",
      ],
      meeting: [
        "The only available time slot conflicts with a company all-hands that hasn't been scheduled yet.",
        "All three required attendees are in different time zones and have no overlap.",
        "The conference room booking system has been down since the last server update.",
        "This meeting requires presence from a team that was dissolved in the reorganization.",
      ],
      attestation: [
        "You must attest that you've read the policy, but the policy link returns a 404.",
        "Attestation requires your digital signature, which expired in 2022.",
        "This attestation was already completed, but the system lost the record in a migration.",
        "The attestation form references compliance standards that were superseded.",
      ],
      compliance: [
        "This compliance check references regulations that were replaced 18 months ago.",
        "Required audit trail documents are stored in a system we no longer have access to.",
        "Compliance verification requires a certificate from a vendor we no longer use.",
        "The compliance officer who created this workflow left, and nobody knows what it does.",
      ],
    };

    // Generic reasons as fallback
    const genericReasons = [
      `This task requires sign-off from ${task.blockedBy.length} people who are all out this week.`,
      "The workflow is awaiting approval from a committee that meets quarterly. Next meeting: TBD.",
      "This depends on a system that's been 'sunset' but not yet replaced.",
      "The person responsible for this left the company. Their replacement starts next month.",
      "This task is blocked pending resolution of a ticket filed 3 years ago.",
      "Required credentials expired and the renewal process is 'being redesigned'.",
      "The project this relates to was cancelled, but the task wasn't removed from the workflow.",
      "This requires coordination with a partner team that was outsourced last quarter.",
    ];

    const archetype = task.archetype || 'unknown';
    const reasons = reasonsByArchetype[archetype] || genericReasons;

    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  // Handle task click - check if blocked or open interaction modal
  const handleTaskClick = (task: Task) => {
    if (task.status === 'completed') {
      return;
    }

    // If task is blocked, show the absurd reason
    if (task.status === 'blocked' || !task.isCompletable) {
      audio.playNightmarePing(0.2);
      setSelectedTask(task);
      setBlockedReason(getBlockedReason(task));
      setShowBlockedModal(true);
      // Mark this task as discovered
      setDiscoveredBlockedTasks((prev) => new Set(prev).add(task.id));
      return;
    }

    setSelectedTask(task);
    setShowInteractionModal(true);
  };

  // Handle interaction completion
  const handleInteractionComplete = (_result: InteractionResult) => {
    if (!selectedTask) return;

    // Complete the task in the task manager
    taskManager.completeTask(selectedTask.id);

    // Refresh task list
    refreshTasks();

    // Close modal
    setShowInteractionModal(false);
    setSelectedTask(null);

    // Play audio
    audio.playNightmarePing(Math.min(totalTasks / 50, 1));
  };

  // Update stage based on task count
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
  }, [totalTasks, stage]);

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

  // STAGE 6+: Auto-complete random tasks (automation chaos)
  useEffect(() => {
    if (stage !== 'automation' && stage !== 'chaos') return;
    if (totalTasks >= CHAOS_THRESHOLDS.ESCAPE_THRESHOLD) return;

    const autoCompleteInterval = setInterval(() => {
      const completableTasks = taskManager.getCompletableTasks();
      const randomTask = completableTasks[Math.floor(Math.random() * completableTasks.length)];

      if (randomTask) {
        taskManager.completeTask(randomTask.id);
        refreshTasks();
        audio.playNightmarePing(Math.random() * 0.5);
      }
    }, stage === 'chaos' ? 3000 : 5000); // Faster in chaos mode

    return () => clearInterval(autoCompleteInterval);
  }, [stage, totalTasks, taskManager, refreshTasks, audio]);

  // STAGE 6+: Background pings
  useEffect(() => {
    if (stage === 'automation' || stage === 'chaos') {
      audio.startNightmarePings(totalTasks);
      return () => audio.stopNightmarePings();
    }
  }, [stage, totalTasks, audio]);

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
  }, [stage, audio]);

  // Get button text based on task state
  const getTaskButtonText = (task: Task) => {
    if (stage === 'chaos') {
      const texts = ['Attempt?', 'Try it', 'Click here', 'DO IT'];
      return texts[task.depth % texts.length];
    }
    // Always show "Attempt" - don't reveal blocked status
    return 'Attempt';
  };

  // Render tasks
  const renderTask = (task: Task) => {
    const showWiggle = stage === 'chaos';
    const avoidCursor = stage === 'automation' || stage === 'chaos';
    const isCompleted = task.status === 'completed';
    const isDiscoveredBlocked = discoveredBlockedTasks.has(task.id);

    // Don't render the root task in the list
    if (task.id === 'root_task') return null;

    // Determine border color
    let borderColor = 'border-blue-500';
    if (isCompleted) {
      borderColor = 'border-green-500 opacity-50';
    } else if (isDiscoveredBlocked) {
      borderColor = 'border-orange-400/60'; // Subtle orange for discovered blocked tasks
    }

    return (
      <div
        key={task.id}
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
                onClick={() => handleTaskClick(task)}
                className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                  stage === 'chaos'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
                style={{
                  transform: cursorDrift > 0
                    ? `translate(${Math.random() * cursorDrift - cursorDrift / 2}px, ${
                        Math.random() * cursorDrift - cursorDrift / 2
                      }px)`
                    : undefined,
                }}
              >
                {getTaskButtonText(task)}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper to get current nightmare stage number
  const getNightmareStageNumber = (): number => {
    if (stage === 'chaos') return 7;
    if (stage === 'automation') return 6;
    if (stage === 'mutating') return 5;
    if (stage === 'multiplying') return 4;
    if (stage === 'resolving') return 3;
    if (stage === 'started') return 2;
    return 1;
  };

  // Escape hatch handlers
  const handleBurnItDown = () => {
    const count = taskManager.getTaskCount();
    const stage = getNightmareStageNumber();
    taskManager.executeBurnItDown();
    onGameEnding('burn', count, stage);
  };

  const handleDelegate = () => {
    const count = taskManager.getTaskCount();
    const stage = getNightmareStageNumber();
    taskManager.executeDelegate();
    onGameEnding('delegate', count, stage);
  };

  const handleAssimilate = () => {
    const count = taskManager.getTaskCount();
    const stage = getNightmareStageNumber();
    taskManager.executeAssimilate('Senior Bureaucracy Facilitator');
    onGameEnding('assimilate', count, stage);
  };

  // Check if we should show escape hatches
  const showEscapeHatches = taskManager.shouldShowEscapeHatches();

  // Main action button
  const getMainButton = () => {
    if (stage === 'initial') {
      return {
        text: 'Start Task',
        onClick: handleStartTask,
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

  const mainButton = getMainButton();

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto ${
        stage === 'chaos' ? 'flicker' : ''
      }`}
    >
      <div className="max-w-3xl w-full p-8">
        {/* Q4 Compliance Lock Notice Card */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-lg shadow-2xl p-6 mb-6 border-4 border-red-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">🔒</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                Q4 Compliance Training Due
              </h2>
              <p className="text-red-100 text-sm">
                Board access suspended until quarterly requirements are completed
              </p>
            </div>
            {stage !== 'initial' && (
              <div className="text-right">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-0.5 rounded border border-white/30">
                  BLOCKED
                </span>
                <p className="text-xs text-red-100 mt-1">
                  {totalTasks} action{totalTasks !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded p-4 border border-white/20 mb-4">
            <p className="text-white text-sm mb-2">
              <strong>Access Restricted:</strong> {rootTask?.description}
            </p>
            {rootTask?.flavorText && (
              <p className="text-red-100 text-xs">
                {rootTask.flavorText}
              </p>
            )}
          </div>

          {/* Main action button */}
          {mainButton && (
            <div>
              <button
                onClick={mainButton.onClick}
                disabled={mainButton.disabled}
                className={`w-full ${mainButton.color} text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg`}
              >
                {mainButton.text}
              </button>
              {mainButton.subtitle && (
                <p className="text-sm text-white/80 text-center mt-2">
                  {mainButton.subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Blocking Tasks Section - Two Column Layout */}
        {tasks.length > 1 && (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Required Actions */}
            <div>
              <div className="mb-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Required Actions:
                </h3>
                <p className="text-gray-400 text-sm">
                  Complete the following to proceed with your task
                </p>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status !== 'completed' && task.id !== 'root_task')
                  .map((task) => renderTask(task))}
              </div>
            </div>

            {/* Right Column: Completed */}
            <div>
              <div className="mb-4">
                <h3 className="text-white text-lg font-semibold mb-2">
                  Completed:
                </h3>
                <p className="text-gray-400 text-sm">
                  Successfully finished actions
                </p>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === 'completed' && task.id !== 'root_task')
                  .map((task) => renderTask(task))}
                {tasks.filter((task) => task.status === 'completed' && task.id !== 'root_task').length === 0 && (
                  <div className="text-gray-500 text-sm italic">
                    No tasks completed yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Escape Messages */}
        {stage === 'mutating' && (
          <div className="text-center mt-6 mb-4">
            <p className="text-red-500 text-sm opacity-70">
              You cannot escape until this is resolved
            </p>
          </div>
        )}

        {stage === 'automation' && (
          <div className="text-center mt-6 mb-4">
            <p className="text-red-500 text-base font-bold glitch">
              You cannot escape until this is resolved
            </p>
          </div>
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

        {/* Interaction Modal */}
        {selectedTask && showInteractionModal && taskManager.getTaskInteraction(selectedTask.id) && (
          <InteractionModal
            interaction={taskManager.getTaskInteraction(selectedTask.id)!}
            taskTitle={selectedTask.title}
            isOpen={showInteractionModal}
            onClose={() => {
              setShowInteractionModal(false);
              setSelectedTask(null);
            }}
            onComplete={handleInteractionComplete}
          />
        )}

        {/* Blocked Task Modal */}
        {showBlockedModal && selectedTask && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Unable to proceed
                </h3>
                <button
                  onClick={() => {
                    setShowBlockedModal(false);
                    setSelectedTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {selectedTask.title}
                </p>
                <p className="text-sm text-gray-600">
                  {blockedReason}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowBlockedModal(false);
                    setSelectedTask(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Emergency Escape Panel */}
        <EscapeHatchPanel
          visible={showEscapeHatches}
          onBurnItDown={handleBurnItDown}
          onDelegate={handleDelegate}
          onAssimilate={handleAssimilate}
        />
      </div>
    </div>
  );
};
