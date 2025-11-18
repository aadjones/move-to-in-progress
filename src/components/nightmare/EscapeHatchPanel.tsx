/**
 * Escape Hatch Panel
 *
 * Emergency exit options that appear when the player has too many tasks
 * Provides three satirical ending paths
 */

interface EscapeHatchPanelProps {
  visible: boolean;
  onBurnItDown: () => void;
  onDelegate: () => void;
  onAssimilate: () => void;
}

export const EscapeHatchPanel = ({
  visible,
  onBurnItDown,
  onDelegate,
  onAssimilate,
}: EscapeHatchPanelProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[70]">
      <div className="bg-red-600 rounded-lg shadow-2xl p-4 border-4 border-red-800 animate-pulse">
        <p className="text-white text-center font-bold mb-3 text-lg">
          🚨 EMERGENCY ESCAPE 🚨
        </p>
        <div className="space-y-2">
          <button
            onClick={onBurnItDown}
            className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm border-2 border-white"
          >
            🔥 BURN IT ALL DOWN
          </button>
          <button
            onClick={onDelegate}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm border-2 border-white"
          >
            👋 DELEGATE TO COWORKER
          </button>
          <button
            onClick={onAssimilate}
            className="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm border-2 border-white"
          >
            🤝 JOIN THE BUREAUCRACY
          </button>
        </div>
      </div>
    </div>
  );
};
