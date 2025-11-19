/**
 * Crisis Choice Interaction
 *
 * Final emergency exit task - presents three ending options disguised as corporate decisions
 */

import React from 'react';

interface CrisisChoiceOption {
  label: string;
  description: string;
  endingType: 'burn' | 'delegate' | 'assimilate';
}

interface CrisisChoiceInteractionProps {
  title: string;
  description: string;
  options: CrisisChoiceOption[];
  onComplete: (data?: Record<string, unknown>) => void;
}

export const CrisisChoiceInteraction: React.FC<CrisisChoiceInteractionProps> = ({
  title,
  description,
  options,
  onComplete,
}) => {
  const handleChoice = (endingType: 'burn' | 'delegate' | 'assimilate') => {
    onComplete({ endingType });
  };

  return (
    <div className="crisis-choice-interaction">
      <h3 className="crisis-title">{title}</h3>
      <p className="crisis-description">{description}</p>

      <div className="crisis-options">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleChoice(option.endingType)}
            className="crisis-option"
          >
            <div className="option-label">{option.label}</div>
            <div className="option-description">{option.description}</div>
          </button>
        ))}
      </div>

      <style>{`
        .crisis-choice-interaction {
          padding: 2rem;
        }

        .crisis-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .crisis-description {
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .crisis-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .crisis-option {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.25rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .crisis-option:hover {
          border-color: #3b82f6;
          background: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .option-label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .option-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};
