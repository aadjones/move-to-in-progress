import { useState } from 'react';
import { BoardTask } from '../types';
import { TaskCard } from './TaskCard';
import { useDrag } from '../hooks/useDrag';

interface TaskBoardProps {
  onTaskMovedToInProgress: (dropPosition: { x: number; y: number }, cardWidth: number) => void;
}

export const TaskBoard = ({ onTaskMovedToInProgress }: TaskBoardProps) => {
  const [tasks, setTasks] = useState<BoardTask[]>([
    {
      id: '1',
      title: 'Refactor Notifications System',
      column: 'todo',
      assignee: 'you',
      tags: ['backend', 'P1'],
      timestamp: '2 days ago',
      description: 'Refactor the push notification service to support real-time delivery requirements from the Q3 roadmap.',
    },
    // Static tasks for context
    {
      id: '2',
      title: 'Investigate Intermittent Production Error',
      column: 'inProgress',
      assignee: 'Sarah',
      tags: ['bug', 'P2'],
      timestamp: '417 days ago',
      description: 'Error occurs roughly once every 3 weeks. No repro steps. Stack trace points to deprecated library we removed 8 months ago.',
    },
    {
      id: '3',
      title: 'Fix Login Edge Case',
      column: 'inProgress',
      assignee: 'Mike',
      tags: ['bug', 'P0'],
      timestamp: '3 hours ago',
      description: 'Users with special characters in email addresses cannot log in. Reproduced in staging.',
    },
    {
      id: '4',
      title: 'Add Unit Tests for Auth',
      column: 'done',
      assignee: 'Alex',
      tags: ['testing'],
      timestamp: '5 days ago',
      description: 'Increase test coverage for authentication module from 62% to target 85%.',
    },
    {
      id: '5',
      title: 'Optimize Database Queries',
      column: 'done',
      assignee: 'Jordan',
      tags: ['backend', 'performance'],
      timestamp: '1 week ago',
      description: 'Dashboard loading time reduced from 4.2s to 0.8s by optimizing N+1 queries.',
    },
  ]);

  const handleDrop = (itemId: string, column: string, dropPosition: { x: number; y: number }, cardWidth: number) => {
    const task = tasks.find((t) => t.id === itemId);
    if (!task) return;

    // If dropped in "In Progress" or "Done", trigger the fall
    if ((column === 'inProgress' || column === 'done') && task.column === 'todo') {
      // Remove the task from the board
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== itemId));
      onTaskMovedToInProgress(dropPosition, cardWidth);
      return;
    }

    // Normal drag behavior for other cases
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === itemId ? { ...t, column: column as 'todo' | 'inProgress' | 'done' } : t
      )
    );
  };

  const { dragState, handleMouseDown, handleTouchStart, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd, cardOffset } =
    useDrag(handleDrop);

  const todoTasks = tasks.filter((t) => t.column === 'todo');
  const inProgressTasks = tasks.filter((t) => t.column === 'inProgress');
  const doneTasks = tasks.filter((t) => t.column === 'done');

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      style={{ userSelect: dragState.isDragging ? 'none' : 'auto' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-sm sm:text-base text-gray-600">Sprint 14 • Week of Nov 16</p>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* To Do Column */}
          <div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4"
            data-column="todo"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">To Do</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMouseDown={task.id === '1' ? (e) => handleMouseDown(e, task.id) : undefined}
                  onTouchStart={task.id === '1' ? (e) => handleTouchStart(e, task.id) : undefined}
                  isDragging={dragState.draggedItem === task.id}
                  isHighlighted={task.id === '1'}
                />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4"
            data-column="inProgress"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMouseDown={undefined}
                  isDragging={dragState.draggedItem === task.id}
                />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4"
            data-column="done"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Done</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMouseDown={undefined}
                  isDragging={dragState.draggedItem === task.id}
                />
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dragging Ghost Card */}
      {dragState.isDragging && dragState.draggedItem && (
        <div
          style={{
            position: 'fixed',
            left: dragState.position.x - cardOffset.x,
            top: dragState.position.y - cardOffset.y,
            pointerEvents: 'none',
            zIndex: 1000,
            width: `${dragState.cardDimensions.width}px`,
          }}
        >
          <TaskCard
            task={tasks.find((t) => t.id === dragState.draggedItem)!}
            onMouseDown={() => {}}
            isDragging={false}
          />
        </div>
      )}
    </div>
  );
};
