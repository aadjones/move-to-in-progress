import { useEffect, useState } from 'react';

interface EndingModalProps {
  variant: 'complete' | 'leave';
  onRestart: () => void;
}

export const EndingModal = ({ variant, onRestart }: EndingModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    // Fade in modal
    setTimeout(() => setShowModal(true), 500);

    // Show board again after delay
    if (variant === 'complete') {
      setTimeout(() => {
        setShowBoard(true);
      }, 3000);
    }
  }, [variant]);

  if (variant === 'complete') {
    return (
      <>
        {/* Dimming overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-1000 z-[60] ${
            showModal ? 'opacity-80' : 'opacity-0'
          }`}
        />

        {/* Modal */}
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-1000 ${
            showModal ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Task Completed
            </h2>
            <p className="text-gray-700 mb-6">
              Project cloned to Q3 Sprint. Assigned to you.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-sm text-yellow-800">
                New task created: <strong>Refactor Notifications System v2</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Reappearing board */}
        {showBoard && (
          <div
            className="fixed inset-0 z-[80] animate-fade-in"
            onClick={onRestart}
          >
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
              <div className="text-center cursor-pointer">
                <p className="text-gray-600 mb-4">Click anywhere to continue</p>
                <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Refactor Notifications System v2
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                        Y
                      </div>
                      <span className="text-xs text-gray-600">you</span>
                    </div>
                    <span className="text-xs text-gray-400">just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // "Leave Board" ending
  return (
    <>
      {/* Dimming overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-1000 z-[60] ${
          showModal ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-1000 ${
          showModal ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You've been removed as assignee
          </h2>
          <p className="text-gray-700 mb-6">You're now a watcher.</p>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                S
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Steve (new assignee)
                </p>
                <p className="text-xs text-gray-500">just now</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              "I'll take a look at this..."
            </p>
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Return to board
          </button>
        </div>
      </div>
    </>
  );
};
