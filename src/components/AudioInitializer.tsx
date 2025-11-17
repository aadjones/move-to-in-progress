import { useState } from 'react';

interface AudioInitializerProps {
  onInitialize: () => Promise<void>;
}

export const AudioInitializer = ({ onInitialize }: AudioInitializerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = async () => {
    await onInitialize();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Move to In Progress
        </h2>
        <p className="text-gray-600 mb-6">
          An interactive experience about modern project management.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition">
          Click to Start
        </button>
        <p className="text-xs text-gray-400 mt-4">Audio enabled</p>
      </div>
    </div>
  );
};
