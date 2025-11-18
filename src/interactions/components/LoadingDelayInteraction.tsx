import React, { useState, useEffect } from 'react';

interface LoadingDelayInteractionProps {
  message: string;
  duration: number; // seconds
  showProgress: boolean;
  onComplete: () => void;
}

export const LoadingDelayInteraction: React.FC<LoadingDelayInteractionProps> = ({
  message,
  duration,
  showProgress,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / duration) / 10; // Update 10 times per second
        const newProgress = prev + increment;

        // Sometimes "slow down" to simulate realistic loading
        const jitter = Math.random() > 0.7 ? increment * 0.5 : 0;

        return Math.min(100, newProgress - jitter);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [progress, duration]);

  useEffect(() => {
    if (isComplete) {
      // Auto-complete after a brief moment
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isComplete, onComplete]);

  return (
    <div className="loading-delay-interaction">
      <div className="loading-content">
        <div className="loading-spinner" />

        <h3>{message}</h3>

        {showProgress && (
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="progress-text">{Math.floor(progress)}%</p>
          </div>
        )}

        {!showProgress && (
          <p className="loading-subtext">This may take a moment...</p>
        )}

        {isComplete && (
          <p className="complete-text">✓ Complete</p>
        )}
      </div>

      <style>{`
        .loading-delay-interaction {
          padding: 3rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .loading-content {
          text-align: center;
          max-width: 400px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-content h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .progress-section {
          margin-top: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #45a049);
          transition: width 0.1s linear;
          border-radius: 4px;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .loading-subtext {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
        }

        .complete-text {
          margin-top: 1rem;
          font-size: 1rem;
          color: #4CAF50;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
