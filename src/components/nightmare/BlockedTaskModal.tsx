/**
 * Blocked Task Modal
 *
 * Shows why a task cannot be completed with satirical bureaucratic reasons
 */

interface BlockedTaskModalProps {
  visible: boolean;
  taskTitle: string;
  blockedReason: string;
  onClose: () => void;
}

export const BlockedTaskModal = ({
  visible,
  taskTitle,
  blockedReason,
  onClose,
}: BlockedTaskModalProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Unable to proceed
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {taskTitle}
          </p>
          <p className="text-sm text-gray-600">
            {blockedReason}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
