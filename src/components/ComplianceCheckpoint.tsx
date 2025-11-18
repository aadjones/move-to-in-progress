import { useState } from 'react';
import { TaskManager } from '../taskGraph/TaskManager';
import { InteractionModal } from '../interactions/InteractionModal';
import type { InteractionResult } from '../interactions/types';
import type { Task } from '../taskGraph/types';

interface ComplianceCheckpointProps {
  onComplete: () => void;
  audio: {
    playNightmarePing: (chaosLevel: number) => void;
  };
  children: React.ReactNode;
}

export const ComplianceCheckpoint = ({ onComplete, audio, children }: ComplianceCheckpointProps) => {
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<Task[]>(taskManager.getTasks());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string>('');
  const [discoveredBlockedTasks, setDiscoveredBlockedTasks] = useState<Set<string>>(new Set());

  const refreshTasks = () => {
    setTasks(taskManager.getTasks());
  };

  const totalTasks = tasks.filter((t) => t.id !== 'root_task' && t.status !== 'completed').length;
  const rootTask = taskManager.getRootTask();
  const isUnlocked = rootTask?.status === 'completed';

  // Generate absurd blocking reason
  const getBlockedReason = (task: Task) => {
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
      compliance: [
        "This compliance check references regulations that were replaced 18 months ago.",
        "Required audit trail documents are stored in a system we no longer have access to.",
        "Compliance verification requires a certificate from a vendor we no longer use.",
        "The compliance officer who created this workflow left, and nobody knows what it does.",
      ],
    };

    const genericReasons = [
      `This task requires sign-off from ${task.blockedBy.length} people who are all out this week.`,
      "The workflow is awaiting approval from a committee that meets quarterly. Next meeting: TBD.",
      "This depends on a system that's been 'sunset' but not yet replaced.",
      "The person responsible for this left the company. Their replacement starts next month.",
    ];

    const archetype = task.archetype || 'unknown';
    const reasons = reasonsByArchetype[archetype] || genericReasons;
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    if (task.status === 'completed') return;

    if (task.status === 'blocked' || !task.isCompletable) {
      audio.playNightmarePing(0.2);
      setSelectedTask(task);
      setBlockedReason(getBlockedReason(task));
      setShowBlockedModal(true);
      setDiscoveredBlockedTasks((prev) => new Set(prev).add(task.id));
      return;
    }

    setSelectedTask(task);
    setShowInteractionModal(true);
  };

  // Handle interaction completion
  const handleInteractionComplete = (_result: InteractionResult) => {
    if (!selectedTask) return;

    taskManager.completeTask(selectedTask.id);
    refreshTasks();
    setShowInteractionModal(false);
    setSelectedTask(null);
    audio.playNightmarePing(Math.min(totalTasks / 50, 1));

    // Check if all tasks are complete
    const updatedRootTask = taskManager.getRootTask();
    if (updatedRootTask?.status === 'completed') {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  // Render task
  const renderTask = (task: Task) => {
    if (task.id === 'root_task') return null;

    const isCompleted = task.status === 'completed';
    const isDiscoveredBlocked = discoveredBlockedTasks.has(task.id);

    let borderColor = 'border-blue-500';
    if (isCompleted) {
      borderColor = 'border-green-500 opacity-50';
    } else if (isDiscoveredBlocked) {
      borderColor = 'border-orange-400/60';
    }

    return (
      <div key={task.id} className="mb-2">
        <div className={`bg-gray-800 border ${borderColor} rounded p-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isCompleted && <span className="text-green-500">✓</span>}
                <div className="text-white text-sm font-medium">{task.title}</div>
              </div>
              <p className="text-xs mt-1 text-gray-400">{task.description}</p>
            </div>

            {!isCompleted && (
              <button
                onClick={() => handleTaskClick(task)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
              >
                Attempt
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Locked Board Overlay */}
      {!isUnlocked && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-start justify-center overflow-y-auto pt-8">
          <div className="max-w-3xl w-full p-8">
            {/* Lock Notice Card */}
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
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded p-4 border border-white/20">
                <p className="text-white text-sm mb-2">
                  <strong>Access Restricted:</strong> Your TaskFlow board has been temporarily locked.
                </p>
                <p className="text-red-100 text-xs">
                  As part of our Q4 compliance initiative, all employees must complete mandatory
                  training before accessing project management tools. This ensures alignment with
                  corporate policies and regulatory requirements.
                </p>
              </div>

              <div className="mt-4 text-center">
                <p className="text-white text-xs opacity-80">
                  Complete {totalTasks} required action{totalTasks !== 1 ? 's' : ''} below to unlock board access
                </p>
              </div>
            </div>

            {/* Required Actions - Two Column Layout */}
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
                    <h3 className="text-lg font-semibold text-gray-900">Unable to proceed</h3>
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
                    <p className="text-sm font-medium text-gray-700 mb-2">{selectedTask.title}</p>
                    <p className="text-sm text-gray-600">{blockedReason}</p>
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
          </div>
        </div>
      )}

      {/* Unlocked: Show the children (TaskBoard) */}
      {isUnlocked && children}
    </>
  );
};
