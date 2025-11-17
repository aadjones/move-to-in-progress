import { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { useDrag } from '../hooks/useDrag';

interface TaskBoardProps {
  onTaskMovedToInProgress: () => void;
}

export const TaskBoard = ({ onTaskMovedToInProgress }: TaskBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Refactor Notifications System',
      column: 'todo',
      assignee: 'you',
      tags: ['backend', 'P1'],
      timestamp: '2 days ago',
    },
  ]);

  const handleDrop = (itemId: string, column: string) => {
    const task = tasks.find((t) => t.id === itemId);
    if (!task) return;

    // If dropped in "In Progress", trigger the fall
    if (column === 'inProgress' && task.column === 'todo') {
      onTaskMovedToInProgress();
      return;
    }

    // Normal drag behavior for other cases
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === itemId ? { ...t, column: column as 'todo' | 'inProgress' } : t
      )
    );
  };

  const { dragState, handleMouseDown, handleMouseMove, handleMouseUp, cardOffset } =
    useDrag(handleDrop);

  const todoTasks = tasks.filter((t) => t.column === 'todo');
  const inProgressTasks = tasks.filter((t) => t.column === 'inProgress');

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Sprint 14 • Week of Nov 16</p>
        </div>

        {/* Board */}
        <div className="grid grid-cols-2 gap-6">
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
                  onMouseDown={(e) => handleMouseDown(e, task.id)}
                  isDragging={dragState.draggedItem === task.id}
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
                  onMouseDown={(e) => handleMouseDown(e, task.id)}
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
            width: '300px',
          }}
        >
          <TaskCard
            task={tasks.find((t) => t.id === dragState.draggedItem)!}
            onMouseDown={() => {}}
            isDragging={true}
          />
        </div>
      )}
    </div>
  );
};
