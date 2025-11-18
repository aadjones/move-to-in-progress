import React, { useState } from 'react';

interface CheckboxesInteractionProps {
  title: string;
  items: string[];
  continueText?: string;
  onComplete: () => void;
}

export const CheckboxesInteraction: React.FC<CheckboxesInteractionProps> = ({
  title,
  items,
  continueText = 'Continue',
  onComplete,
}) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const allChecked = items.every((_, index) => checked[index]);

  const handleToggle = (index: number) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="checkboxes-interaction">
      <h3>{title}</h3>

      <div className="checkboxes-list">
        {items.map((item, index) => (
          <label key={index} className="checkbox-item">
            <input
              type="checkbox"
              checked={checked[index] || false}
              onChange={() => handleToggle(index)}
            />
            <span className="checkbox-label">{item}</span>
          </label>
        ))}
      </div>

      <p className="requirement-text">
        All items must be acknowledged to continue.
      </p>

      <button
        onClick={onComplete}
        disabled={!allChecked}
        className={`continue-btn ${allChecked ? '' : 'disabled'}`}
      >
        {continueText}
      </button>

      <style>{`
        .checkboxes-interaction {
          padding: 1.5rem;
        }

        .checkboxes-interaction h3 {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .checkboxes-list {
          margin-bottom: 1.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #f9f9f9;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .checkbox-item:hover {
          background: #f0f0f0;
        }

        .checkbox-item input[type="checkbox"] {
          margin-top: 0.2rem;
          cursor: pointer;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .checkbox-label {
          flex: 1;
          line-height: 1.4;
          font-size: 0.95rem;
        }

        .requirement-text {
          font-size: 0.85rem;
          color: #666;
          font-style: italic;
          margin-bottom: 1rem;
          text-align: center;
        }

        .continue-btn {
          width: 100%;
          padding: 0.7rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .continue-btn:not(.disabled):hover {
          background: #45a049;
        }

        .continue-btn.disabled {
          background: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};
