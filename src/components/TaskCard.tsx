import { BoardTask } from '../types';

interface TaskCardProps {
  task: BoardTask;
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
  isHighlighted?: boolean;
}

export const TaskCard = ({ task, onMouseDown, isDragging, style, isHighlighted }: TaskCardProps) => {
  const isDraggable = onMouseDown !== undefined;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 transition-all ${
        isDragging ? 'invisible' : 'hover:shadow-lg'
      } ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default opacity-60'
      } ${
        isHighlighted ? 'ring-2 ring-purple-400 ring-opacity-50 shadow-lg' : ''
      }`}
      onMouseDown={onMouseDown}
      style={style}
    >
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
  );
};
