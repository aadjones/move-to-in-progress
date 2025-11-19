import React from 'react';

interface TitleScreenProps {
  onBegin: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onBegin }) => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="text-center space-y-8 px-4">
        {/* Title */}
        <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight animate-fadeIn">
          In Progress
        </h1>

        {/* Warnings */}
        <div className="space-y-3 text-gray-400 text-sm max-w-md mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <p>🎧 Audio recommended</p>
          <p>💻 Best experienced on desktop</p>
        </div>

        {/* Begin Button */}
        <div className="animate-fadeIn" style={{ animationDelay: '1s' }}>
          <button
            onClick={onBegin}
            className="px-12 py-4 bg-white text-black text-lg font-semibold rounded hover:bg-gray-200 transition-colors"
          >
            Begin
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
