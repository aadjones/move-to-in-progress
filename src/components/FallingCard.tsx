import { useEffect, useState } from 'react';
import { Task } from '../types';
import { ANIMATION_CONFIG } from '../config/animations';

interface FallingCardProps {
  task: Task;
  onLanded: () => void;
  initialPosition: { x: number; y: number };
  cardWidth: number;
}

export const FallingCard = ({ task, onLanded, initialPosition, cardWidth }: FallingCardProps) => {
  const [isHesitating, setIsHesitating] = useState(true);
  const [isFalling, setIsFalling] = useState(false);

  useEffect(() => {
    // Hesitation phase (elastic pull)
    const hesitateTimer = setTimeout(() => {
      setIsHesitating(false);
      setIsFalling(true);
    }, ANIMATION_CONFIG.falling.hesitationDuration);

    // Land at the bottom after fall animation
    const landTimer = setTimeout(() => {
      onLanded();
    }, ANIMATION_CONFIG.falling.cardFallDuration * 1000);

    return () => {
      clearTimeout(hesitateTimer);
      clearTimeout(landTimer);
    };
  }, [onLanded]);

  return (
    <div
      className="fixed z-50 transition-all"
      style={{
        left: isHesitating ? initialPosition.x : initialPosition.x,
        top: isHesitating ? initialPosition.y : isFalling ? `${ANIMATION_CONFIG.falling.cardFallDistance}px` : initialPosition.y,
        width: `${cardWidth}px`,
        transform: isHesitating ? 'scale(0.95)' : 'scale(1)',
        transitionDuration: isHesitating ? `${ANIMATION_CONFIG.falling.hesitationDuration / 1000}s` : `${ANIMATION_CONFIG.falling.cardFallDuration}s`,
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

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mt-2 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

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
