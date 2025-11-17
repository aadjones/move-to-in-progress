import { useState, useEffect, useCallback } from 'react';
import { Subtask } from '../types';
import { subtaskTemplates, titleMutations, toastMessages } from '../data/subtasks';
import { countSubtasks, flattenUnexpanded, mutateTaskTitles, updateSubtaskById } from '../utils/subtaskTree';

const CHAOS_THRESHOLDS = {
  CURSOR_DRIFT: 3,
  ESCAPE_MESSAGE: 5,
  TITLE_MUTATIONS: 5,
  AUTO_EXPAND: 10,
  MAX_SUBTASKS: 20,
  TOAST_SPAM: 15,
  TIME_LIMIT: 60000, // 60 seconds
} as const;

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
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [cursorDrift, setCursorDrift] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [showEscapeMessage, setShowEscapeMessage] = useState(false);
  const [showEndingButtons, setShowEndingButtons] = useState(false);
  const [startTime] = useState(Date.now());

  // Generate random subtask
  const generateSubtask = useCallback((): Subtask => {
    const template =
      subtaskTemplates[Math.floor(Math.random() * subtaskTemplates.length)];
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: template.title,
      status: template.status,
      children: [],
      expanded: false,
    };
  }, []);

  // Spawn initial subtasks when clicking "Mark Complete"
  const handleMarkComplete = () => {
    if (subtasks.length === 0) {
      const newSubtasks = Array.from({ length: 3 }, generateSubtask);
      setSubtasks(newSubtasks);
    }
  };

  // Expand subtask (spawns more)
  const handleExpandSubtask = (subtaskId: string) => {
    const spawnCount = Math.random() > 0.5 ? 2 : 1;
    const newChildren = Array.from({ length: spawnCount }, generateSubtask);

    setSubtasks((prev) =>
      updateSubtaskById(prev, subtaskId, (task) => ({
        ...task,
        expanded: true,
        children: [...(task.children || []), ...newChildren],
      }))
    );
  };

  const totalSubtasks = countSubtasks(subtasks);

  // Chaos escalation effects
  useEffect(() => {
    if (totalSubtasks >= CHAOS_THRESHOLDS.CURSOR_DRIFT) {
      // Cursor drift
      const driftInterval = setInterval(() => {
        const drift = totalSubtasks >= CHAOS_THRESHOLDS.AUTO_EXPAND ? 20 : 5;
        setCursorDrift(drift);
      }, 100);
      return () => clearInterval(driftInterval);
    }
  }, [totalSubtasks]);

  // Show escape message at 5+ subtasks
  useEffect(() => {
    if (totalSubtasks >= CHAOS_THRESHOLDS.ESCAPE_MESSAGE) {
      setShowEscapeMessage(true);
    }
  }, [totalSubtasks]);

  // Title mutations at 5+ subtasks
  useEffect(() => {
    if (totalSubtasks < CHAOS_THRESHOLDS.TITLE_MUTATIONS) return;

    const mutationInterval = setInterval(() => {
      setSubtasks((prev) => mutateTaskTitles(prev, titleMutations));
    }, 3000);

    return () => clearInterval(mutationInterval);
  }, [totalSubtasks]);

  // Auto-expand random subtask at 10+ (but stop at 20 to prevent infinite growth)
  useEffect(() => {
    if (totalSubtasks < CHAOS_THRESHOLDS.AUTO_EXPAND || totalSubtasks >= CHAOS_THRESHOLDS.MAX_SUBTASKS) return;

    const autoExpandInterval = setInterval(() => {
      const unexpandedTasks = flattenUnexpanded(subtasks);
      const randomSubtask = unexpandedTasks[Math.floor(Math.random() * unexpandedTasks.length)];

      if (randomSubtask && !randomSubtask.expanded) {
        handleExpandSubtask(randomSubtask.id);
      }
    }, 8000);

    return () => clearInterval(autoExpandInterval);
  }, [totalSubtasks, subtasks]);

  // Toast notifications with synchronized pings
  useEffect(() => {
    if (totalSubtasks < CHAOS_THRESHOLDS.TOAST_SPAM) {
      // Before toast spam, play background pings
      if (totalSubtasks >= CHAOS_THRESHOLDS.CURSOR_DRIFT) {
        audio.startNightmarePings(totalSubtasks);
      }
      return () => audio.stopNightmarePings();
    }

    // At 15+ subtasks, stop background pings and only ping with toasts
    audio.stopNightmarePings();

    const toastInterval = setInterval(() => {
      const message =
        toastMessages[Math.floor(Math.random() * toastMessages.length)];
      const newToast = { id: Date.now(), message };
      setToasts((prev) => [...prev, newToast]);

      // Play Slack knock sound synchronized with toast appearance
      audio.playSlackKnock();

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    }, 3000);

    return () => {
      clearInterval(toastInterval);
      audio.stopNightmarePings();
    };
  }, [totalSubtasks]);

  // Show ending after 20+ subtasks or 60 seconds
  useEffect(() => {
    const elapsedTime = Date.now() - startTime;
    if (totalSubtasks >= CHAOS_THRESHOLDS.MAX_SUBTASKS || elapsedTime > CHAOS_THRESHOLDS.TIME_LIMIT) {
      setShowEndingButtons(true);
    }
  }, [totalSubtasks, startTime]);

  // Render subtasks recursively
  const renderSubtask = (subtask: Subtask, level: number = 0) => {
    const wiggle = totalSubtasks >= CHAOS_THRESHOLDS.CURSOR_DRIFT;
    const avoidCursor = totalSubtasks >= CHAOS_THRESHOLDS.AUTO_EXPAND;

    return (
      <div
        key={subtask.id}
        className={`ml-${level * 4} mb-2`}
        style={{
          transform: avoidCursor
            ? `translateX(${Math.sin(Date.now() / 1000) * 10}px)`
            : undefined,
        }}
      >
        <div
          className={`bg-gray-800 border border-red-500 rounded p-3 ${
            wiggle ? 'wiggle' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-1">
                {subtask.title}
              </p>
              <p className="text-red-400 text-xs">{subtask.status}</p>
            </div>
            {!subtask.expanded && !showEndingButtons && (
              <button
                onClick={() => handleExpandSubtask(subtask.id)}
                className="ml-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                style={{
                  transform: `translate(${Math.random() * cursorDrift - cursorDrift / 2}px, ${
                    Math.random() * cursorDrift - cursorDrift / 2
                  }px)`,
                }}
              >
                Expand
              </button>
            )}
          </div>
        </div>
        {subtask.children && subtask.children.length > 0 && (
          <div className="mt-2">
            {subtask.children.map((child) => renderSubtask(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-y-auto ${
        totalSubtasks >= CHAOS_THRESHOLDS.TOAST_SPAM ? 'flicker' : ''
      }`}
    >
      <div className="max-w-3xl w-full p-8">
        {/* Original Task Card */}
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Refactor Notifications System
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
              {totalSubtasks} subtasks
            </span>
          </div>

          {!showEndingButtons ? (
            <button
              onClick={handleMarkComplete}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg pulse-red"
            >
              ✓ Mark Complete
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onComplete}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                🚪 Mark Complete
              </button>
              <button
                onClick={onLeave}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                🪞 Leave Board
              </button>
            </div>
          )}
        </div>

        {/* Escape Message */}
        {showEscapeMessage && (
          <div className="text-center mb-6">
            <p className="text-red-500 text-lg font-bold glitch">
              You cannot escape this
            </p>
          </div>
        )}

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <div className="space-y-2">{subtasks.map((s) => renderSubtask(s))}</div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-[60]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
            >
              <p className="text-sm text-gray-800">{toast.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
