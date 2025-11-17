import { useEffect, useState } from 'react';
import { Task } from '../types';

interface FallingCardProps {
  task: Task;
  onLanded: () => void;
}

export const FallingCard = ({ task, onLanded }: FallingCardProps) => {
  const [isHesitating, setIsHesitating] = useState(true);
  const [isFalling, setIsFalling] = useState(false);

  useEffect(() => {
    // Hesitation phase (elastic pull)
    const hesitateTimer = setTimeout(() => {
      setIsHesitating(false);
      setIsFalling(true);
    }, 300);

    // Land at the bottom after fall animation
    const landTimer = setTimeout(() => {
      onLanded();
    }, 2500);

    return () => {
      clearTimeout(hesitateTimer);
      clearTimeout(landTimer);
    };
  }, [onLanded]);

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-80 transition-all ${
        isHesitating
          ? 'top-[40%] scale-95'
          : isFalling
          ? 'top-[3000px]'
          : ''
      }`}
      style={{
        transitionDuration: isHesitating ? '0.3s' : '2.5s',
        transitionTimingFunction: isHesitating
          ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          : 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center gap-2">
            {task.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          {task.assignee && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">{task.assignee}</span>
            </div>
          )}
          {task.timestamp && (
            <span className="text-xs text-gray-400">{task.timestamp}</span>
          )}
        </div>
      </div>
    </div>
  );
};
