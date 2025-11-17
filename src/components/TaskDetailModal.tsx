import { useEffect, useState } from 'react';
import { Subtask } from '../types';
import { TaskContent, TaskComment } from '../data/taskContent';
import { characters } from '../data/characters';

interface TaskDetailModalProps {
  task: Subtask | null;
  content: TaskContent | null;
  onClose: () => void;
  stage: string;
  onAddComment?: (comment: TaskComment) => void;
}

export const TaskDetailModal = ({
  task,
  content,
  onClose,
  stage,
}: TaskDetailModalProps) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [descriptionIndex, setDescriptionIndex] = useState(0);

  // Initialize comments when content loads
  useEffect(() => {
    if (content) {
      setComments(content.initialComments || []);
      setDescriptionIndex(0);
    }
  }, [content]);

  // Mutate description based on chaos stage
  useEffect(() => {
    if (!content?.descriptionMutations) return;

    if (stage === 'mutating' || stage === 'multiplying') {
      setDescriptionIndex(1);
    } else if (stage === 'automation') {
      setDescriptionIndex(Math.min(2, content.descriptionMutations.length - 1));
    } else if (stage === 'chaos') {
      setDescriptionIndex(content.descriptionMutations.length - 1);
    }
  }, [stage, content]);

  if (!task || !content) return null;

  const currentDescription = content.descriptionMutations
    ? (content.descriptionMutations[descriptionIndex] || content.description)
    : content.description;

  const isChaotic = stage === 'automation' || stage === 'chaos';
  const isDemonic = stage === 'chaos';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
          isDemonic ? 'animate-pulse' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                TASK-{task.id.slice(0, 4).toUpperCase()}
              </span>
              {task.isAcceptanceCriteria && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Acceptance Criteria
                </span>
              )}
            </div>
            <h2 className={`text-2xl font-semibold text-gray-900 ${
              isDemonic ? 'glitch' : ''
            }`}>
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Description
            </h3>
            <div className={`text-gray-800 whitespace-pre-wrap ${
              isDemonic ? 'font-mono text-red-900' : ''
            }`}>
              {currentDescription}
            </div>
          </div>

          {/* Blocker Status */}
          {task.revealed && task.status && (
            <div className={`p-4 rounded-lg ${
              isDemonic
                ? 'bg-red-900 border-2 border-red-500 animate-pulse'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    BLOCKED
                  </p>
                  <p className={`text-sm ${
                    isDemonic ? 'text-red-100 font-bold' : 'text-red-700'
                  }`}>
                    {task.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Linked Issues */}
          {content.linkedIssues && content.linkedIssues.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Linked Issues
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.linkedIssues.map((issue) => (
                  <span
                    key={issue}
                    className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 cursor-pointer"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Activity ({comments.length})
            </h3>
            <div className="space-y-4">
              {comments.map((comment, index) => {
                const author = characters[comment.author];
                const isDemonicComment = comment.author.includes('cursed') || comment.author === 'void';

                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      isDemonicComment ? 'animate-pulse' : ''
                    }`}
                  >
                    <div className={`text-2xl flex-shrink-0 ${
                      isDemonicComment ? 'animate-bounce' : ''
                    }`}>
                      {author?.avatar || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-semibold text-sm ${
                          isDemonicComment ? 'text-red-600 font-mono' : 'text-gray-900'
                        }`}>
                          {author?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {author?.role || ''}
                        </span>
                        <span className="text-xs text-gray-400">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        isDemonicComment
                          ? 'text-red-900 font-bold'
                          : comment.isAuto
                            ? 'text-gray-600 italic'
                            : 'text-gray-700'
                      }`}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              })}

              {comments.length === 0 && (
                <p className="text-sm text-gray-500 italic">No activity yet</p>
              )}
            </div>
          </div>

          {/* Chaos indicators */}
          {isChaotic && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <span className="animate-pulse">⚠️</span>
                <span className={isDemonic ? 'font-bold glitch' : ''}>
                  {isDemonic
                    ? 'T̸H̶I̷S̴ ̶T̸A̵S̸K̷ ̵C̶A̸N̴N̶O̵T̸ ̷B̵E̶ ̴C̶O̵M̷P̸L̶E̴T̸E̵D̷'
                    : 'This task is experiencing issues'
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
