import { useState, useEffect } from 'react';
import { GameStage, getStageNumber } from '../hooks/useStageProgression';

interface DebugPanelProps {
  onSetTasks: (count: number) => void;
  onSetStage: (stage: GameStage) => void;
  onTriggerEnding: (endingType: 'burn' | 'delegate' | 'assimilate') => void;
  currentTasks: number;
  currentStage: GameStage;
}

export const DebugPanel = ({
  onSetTasks,
  onSetStage,
  onTriggerEnding,
  currentTasks,
  currentStage,
}: DebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskInput, setTaskInput] = useState(currentTasks.toString());

  // Toggle with backtick key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Update input when currentTasks changes
  useEffect(() => {
    setTaskInput(currentTasks.toString());
  }, [currentTasks]);

  if (!isOpen) return null;

  const stages: GameStage[] = [
    'initial',
    'started',
    'resolving',
    'multiplying',
    'mutating',
    'automation',
    'chaos',
    'breakdown',
    'annihilation',
    'singularity',
  ];

  const handleSetTasks = () => {
    const num = parseInt(taskInput);
    if (!isNaN(num) && num >= 0) {
      onSetTasks(num);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-2xl z-[9999] max-w-sm border border-green-500">
      <div className="mb-3 pb-2 border-b border-green-500">
        <h3 className="text-green-400 font-bold text-lg mb-1">🐛 DEBUG PANEL</h3>
        <p className="text-xs text-gray-400">Press ` to toggle</p>
      </div>

      {/* Task Count */}
      <div className="mb-4">
        <label className="block text-xs text-green-400 mb-1">Tasks Unlocked</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 bg-gray-900 border border-green-500 rounded px-2 py-1 text-sm"
            min="0"
          />
          <button
            onClick={handleSetTasks}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-bold"
          >
            SET
          </button>
        </div>
        <div className="flex gap-1 mt-2">
          {[50, 70, 90, 100, 150].map((count) => (
            <button
              key={count}
              onClick={() => {
                setTaskInput(count.toString());
                onSetTasks(count);
              }}
              className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs"
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Selection */}
      <div className="mb-4">
        <label className="block text-xs text-green-400 mb-1">
          Nightmare Stage (Current: Stage {getStageNumber(currentStage)})
        </label>
        <div className="grid grid-cols-2 gap-1">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => onSetStage(stage)}
              className={`px-2 py-1 rounded text-xs ${
                currentStage === stage
                  ? 'bg-green-600 font-bold'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {getStageNumber(stage)}: {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Ending Triggers */}
      <div className="mb-2">
        <label className="block text-xs text-green-400 mb-1">Trigger Ending</label>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onTriggerEnding('burn')}
            className="bg-red-700 hover:bg-red-600 px-2 py-2 rounded text-xs font-bold"
          >
            🔥 BURN
          </button>
          <button
            onClick={() => onTriggerEnding('delegate')}
            className="bg-blue-700 hover:bg-blue-600 px-2 py-2 rounded text-xs font-bold"
          >
            👋 DELEGATE
          </button>
          <button
            onClick={() => onTriggerEnding('assimilate')}
            className="bg-purple-700 hover:bg-purple-600 px-2 py-2 rounded text-xs font-bold"
          >
            🤝 ASSIMILATE
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-700">
        Current: {currentTasks} tasks, Stage {getStageNumber(currentStage)} ({currentStage})
      </div>
    </div>
  );
};
