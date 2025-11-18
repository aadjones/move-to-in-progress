import React, { useState } from 'react';

interface TypingPromptInteractionProps {
  prompt: string;
  expected: string;
  caseSensitive?: boolean;
  placeholder?: string;
  onComplete: () => void;
}

export const TypingPromptInteraction: React.FC<TypingPromptInteractionProps> = ({
  prompt,
  expected,
  caseSensitive = true,
  placeholder = '',
  onComplete,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttempted(true);

    // Easter egg: if they literally type the phrase with quotes
    if (value === `"${expected}"` || value === `'${expected}'`) {
      setError('Very literal. The quotes are implied. Please type the text without adding your own quotes.');
      return;
    }

    const userInput = caseSensitive ? value : value.toLowerCase();
    const expectedInput = caseSensitive ? expected : expected.toLowerCase();

    if (userInput === expectedInput) {
      onComplete();
    } else {
      setAttempts((prev) => prev + 1);

      // Progressively more helpful error messages
      if (attempts === 0) {
        setError('Incorrect. Please try again.');
      } else if (attempts === 1) {
        setError(caseSensitive
          ? 'Incorrect. Remember: this is case-sensitive.'
          : 'Incorrect. Please check your spelling.');
      } else {
        setError('Incorrect. Please type exactly what is shown above.');
      }
    }
  };

  return (
    <div className="typing-prompt-interaction">
      <div className="prompt-section">
        <p className="prompt-label">Please type the following exactly as shown:</p>
        <div className="expected-text">"{expected}"</div>
        {caseSensitive && (
          <p className="case-warning">⚠️ Case-sensitive</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-section">
          <label htmlFor="typing-input">{prompt}</label>
          <input
            id="typing-input"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // Only clear error if they've already attempted and are now correcting
              if (hasAttempted) {
                setError(null);
              }
            }}
            placeholder={placeholder}
            autoFocus
            className={error ? 'error' : ''}
          />

          {error && <p className="error-message">{error}</p>}

          {/* Character count for long phrases */}
          {expected.length > 30 && (
            <p className="char-count">
              {value.length} / {expected.length} characters
            </p>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      <style>{`
        .typing-prompt-interaction {
          padding: 1.5rem;
        }

        .prompt-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 4px;
          border-left: 4px solid #4CAF50;
        }

        .prompt-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .expected-text {
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
          margin: 0.5rem 0;
          word-wrap: break-word;
          white-space: normal;
          line-height: 1.5;
        }

        .case-warning {
          font-size: 0.85rem;
          color: #ff6600;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .input-section {
          margin-bottom: 1rem;
        }

        .input-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .input-section input {
          width: 100%;
          padding: 0.7rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: 'Courier New', monospace;
          transition: border-color 0.2s;
        }

        .input-section input:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .input-section input.error {
          border-color: #ff4444;
        }

        .error-message {
          margin-top: 0.5rem;
          color: #ff4444;
          font-size: 0.85rem;
        }

        .char-count {
          margin-top: 0.5rem;
          color: #666;
          font-size: 0.75rem;
          text-align: right;
        }

        .submit-btn {
          width: 100%;
          padding: 0.7rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 500;
        }

        .submit-btn:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};
