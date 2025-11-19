import { useState, useEffect, useCallback } from 'react';
import { TaskManager } from '../taskGraph/TaskManager';
import type { Task } from '../taskGraph/types';
import { InteractionModal } from '../interactions/InteractionModal';
import type { InteractionResult } from '../interactions/types';
import { toastMessages, breakdownToastMessages, annihilationToastMessages } from '../data/subtasks';
import { EscapeHatchPanel } from './nightmare/EscapeHatchPanel';
import { ToastManager } from './nightmare/ToastManager';
import { BlockedTaskModal } from './nightmare/BlockedTaskModal';
import { TaskItem } from './nightmare/TaskItem';
import { DebugPanel } from './DebugPanel';
import { useCursorDrift } from '../hooks/useCursorDrift';
import { useStageProgression, getStageNumber, type GameStage } from '../hooks/useStageProgression';
import { useTaskAutomation } from '../hooks/useTaskAutomation';
import { useEscapeHatches } from '../hooks/useEscapeHatches';
import { useMainButton } from '../hooks/useMainButton';
import { useAudio } from '../hooks/useAudio';
import { getBlockedReason } from '../taskGraph/blockedReasons';

interface NightmareZoneProps {
  onComplete?: () => void;
  onLeave?: () => void;
  onGameEnding: (endingType: 'burn' | 'delegate' | 'assimilate', tasksUnlocked: number, nightmareStage: number) => void;
}

export const NightmareZone = ({ onGameEnding }: NightmareZoneProps) => {
  const audio = useAudio();
  const [taskManager] = useState(() => new TaskManager());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string>('');
  const [discoveredBlockedTasks, setDiscoveredBlockedTasks] = useState<Set<string>>(new Set());

  // Debug overrides
  const [debugTaskOverride, setDebugTaskOverride] = useState<number | null>(null);
  const [debugStageOverride, setDebugStageOverride] = useState<GameStage | null>(null);

  const totalTasks = debugTaskOverride !== null
    ? debugTaskOverride
    : tasks.filter((t) => t.id !== 'root_task' && t.status !== 'completed').length;
  const rootTask = taskManager.getRootTask();

  // Use custom hooks for stage progression and automation
  const actualStage = useStageProgression(totalTasks);
  const stage = debugStageOverride !== null ? debugStageOverride : actualStage;
  const cursorDrift = useCursorDrift(stage);

  // Sync tasks from manager
  const refreshTasks = useCallback(() => {
    // Check for deadlocks before rendering
    taskManager.checkForDeadlock();
    setTasks(taskManager.getTasks());
  }, [taskManager]);

  // Initialize tasks on mount
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // STAGE 0 → 1: Start Task
  const handleStartTask = () => {
    // Stage progression is now automatic via useStageProgression hook
    refreshTasks();
    audio.playNightmarePing(0.1);
  };

  // Handle task click - check if blocked or open interaction modal
  const handleTaskClick = (task: Task) => {
    if (task.status === 'completed') {
      return;
    }

    // If task is blocked, show the absurd reason
    if (task.status === 'blocked' || !task.isCompletable) {
      audio.playBlockedSound();
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

  // Stage progression is now handled by useStageProgression hook
  // Auto-completion and background audio handled by useTaskAutomation hook
  useTaskAutomation({
    stage,
    totalTasks,
    taskManager,
    onTaskComplete: refreshTasks,
    audio: {
      playNightmarePing: audio.playNightmarePing,
      startNightmarePings: audio.startNightmarePings,
      stopNightmarePings: audio.stopNightmarePings,
      playBreakdownPing: audio.playBreakdownPing,
      startBreakdownPings: audio.startBreakdownPings,
      stopBreakdownPings: audio.stopBreakdownPings,
    },
  });

  // Safety net: periodically check for deadlocks and ensure at least one task is completable
  useEffect(() => {
    const safetyInterval = setInterval(() => {
      const completableTasks = taskManager.getCompletableTasks();
      if (completableTasks.length === 0) {
        console.warn('[Safety] No completable tasks found - triggering deadlock prevention');
        taskManager.checkForDeadlock();
        refreshTasks();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(safetyInterval);
  }, [taskManager, refreshTasks]);

  // Compliance team prelude toast (single toast at stage 5)
  const [showPreludeToast, setShowPreludeToast] = useState(false);
  useEffect(() => {
    if (stage === 'mutating' && !showPreludeToast) {
      // Show a single prelude toast when entering stage 5 (mutation)
      setShowPreludeToast(true);
      audio.playSlackKnock();

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowPreludeToast(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [stage, showPreludeToast, audio]);

  // Escape hatch handlers
  const { handleBurnItDown, handleDelegate, handleAssimilate } = useEscapeHatches({
    taskManager,
    stage,
    onGameEnding,
  });

  // Check if we should show escape hatches
  const showEscapeHatches = taskManager.shouldShowEscapeHatches();

  // Main action button
  const mainButton = useMainButton({
    stage,
    rootTask: rootTask || null,
    totalTasks,
    onStartTask: handleStartTask,
  });

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto ${
        stage === 'singularity' ? 'animate-pulse opacity-70' :
        stage === 'annihilation' ? 'flicker animate-pulse opacity-90' :
        stage === 'breakdown' ? 'flicker animate-pulse' :
        stage === 'chaos' ? 'flicker' : ''
      }`}
      style={{
        animation: stage === 'singularity' ? 'shake 0.2s infinite, colorShift 1s infinite' : undefined,
      }}
    >
      <div className="max-w-3xl w-full p-4 sm:p-8">
        {/* Q4 Compliance Lock Notice Card */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-lg shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-4 border-red-700">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            <div className="text-4xl sm:text-6xl">🔒</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1">
                Q4 Compliance Training Due
              </h2>
              <p className="text-red-100 text-xs sm:text-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left Column: Required Actions */}
            <div>
              <div className="mb-4">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
                  Required Actions:
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Complete the following to proceed with your task
                </p>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status !== 'completed' && task.id !== 'root_task')
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      stage={stage}
                      cursorDrift={cursorDrift}
                      isDiscoveredBlocked={discoveredBlockedTasks.has(task.id)}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
              </div>
            </div>

            {/* Right Column: Completed */}
            <div>
              <div className="mb-4">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
                  Completed:
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Successfully finished actions
                </p>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === 'completed' && task.id !== 'root_task')
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      stage={stage}
                      cursorDrift={cursorDrift}
                      isDiscoveredBlocked={discoveredBlockedTasks.has(task.id)}
                      onTaskClick={handleTaskClick}
                    />
                  ))}
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

        {/* Compliance Team Prelude Toast (Stage 5) */}
        {showPreludeToast && (
          <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[60] sm:max-w-sm">
            <div
              className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-yellow-500"
              style={{
                animation: 'slideInFade 0.3s ease-out, fadeOut 0.5s ease-in 4.5s forwards',
              }}
            >
              <p className="text-xs sm:text-sm text-gray-800">
                💼 <strong>Compliance Team:</strong> We noticed you're working on something. Quick check-in needed!
              </p>
            </div>

            <style>{`
              @keyframes slideInFade {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }

              @keyframes fadeOut {
                from {
                  opacity: 1;
                }
                to {
                  opacity: 0;
                  transform: translateX(20px);
                }
              }
            `}</style>
          </div>
        )}

        {/* Toast Notifications (Chaos, Breakdown, Annihilation, & Singularity stages) */}
        <ToastManager
          active={stage === 'chaos' || stage === 'breakdown' || stage === 'annihilation' || stage === 'singularity'}
          messages={
            stage === 'singularity' ? annihilationToastMessages :
            stage === 'annihilation' ? annihilationToastMessages :
            stage === 'breakdown' ? breakdownToastMessages :
            toastMessages
          }
          spawnInterval={stage === 'singularity' ? 2000 : stage === 'annihilation' ? 800 : stage === 'breakdown' ? 1500 : 2500}
          onToastAppear={audio.playSlackKnock}
          singularityMode={stage === 'singularity'}
          onSingularityToastAppear={audio.playSingularityKnock}
        />

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
        <BlockedTaskModal
          visible={showBlockedModal && selectedTask !== null}
          taskTitle={selectedTask?.title || ''}
          blockedReason={blockedReason}
          onClose={() => {
            setShowBlockedModal(false);
            setSelectedTask(null);
          }}
        />

        {/* Fixed Emergency Escape Panel */}
        <EscapeHatchPanel
          visible={showEscapeHatches}
          onBurnItDown={handleBurnItDown}
          onDelegate={handleDelegate}
          onAssimilate={handleAssimilate}
        />

        {/* Debug Panel */}
        <DebugPanel
          onSetTasks={setDebugTaskOverride}
          onSetStage={setDebugStageOverride}
          onTriggerEnding={(endingType) => {
            onGameEnding(endingType, totalTasks, getStageNumber(stage));
          }}
          currentTasks={totalTasks}
          currentStage={stage}
        />
      </div>
    </div>
  );
};
