import React, { useState, useEffect } from 'react';

interface VideoInteractionProps {
  title: string;
  duration: number; // seconds
  onComplete: () => void;
}

// Corporate messages to display during video
const corporateMessages = [
  "Don't harass people, okay?",
  "Remember: We're all one big family here.",
  "Workplace integrity is everyone's responsibility.",
  "Think before you speak. Then think again.",
  "Diversity and inclusion matter. Really.",
  "Report suspicious activity to your manager.",
  "Your feedback is important to us.",
  "Together, we can achieve our quarterly targets.",
  "Excellence is not just a goal—it's a requirement.",
  "This training is mandatory for your continued employment.",
];

export const VideoInteraction: React.FC<VideoInteractionProps> = ({
  title,
  duration,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    corporateMessages[Math.floor(Math.random() * corporateMessages.length)]
  );

  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / duration) / 10; // Update 10 times per second
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [progress, duration]);

  // Change message every 3 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(
        corporateMessages[Math.floor(Math.random() * corporateMessages.length)]
      );
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="video-interaction">
      <h3>{title}</h3>

      <div className="video-player">
        <div className="video-placeholder">
          <div className="play-icon">▶</div>
          <p className="corporate-message">{currentMessage}</p>
          <p className="video-timestamp">
            {Math.floor((progress / 100) * duration)}s / {duration}s
          </p>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="video-controls">
        <p className="helper-text">
          Please watch the entire video. You cannot skip this training material.
        </p>
        <button
          onClick={onComplete}
          disabled={!isComplete}
          className={isComplete ? 'complete-btn' : 'complete-btn disabled'}
        >
          {isComplete ? 'Continue' : 'Please wait...'}
        </button>
      </div>

      <style>{`
        .video-interaction {
          padding: 1.5rem;
        }

        .video-interaction h3 {
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .video-player {
          background: #000;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .video-placeholder {
          aspect-ratio: 16/9;
          background: #1a1a1a;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .play-icon {
          font-size: 3rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .corporate-message {
          color: #fff;
          font-size: 1rem;
          text-align: center;
          padding: 1rem;
          max-width: 80%;
          line-height: 1.4;
          font-weight: 500;
          margin-bottom: 1rem;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .video-timestamp {
          color: #999;
          font-size: 0.9rem;
        }

        .progress-bar {
          height: 4px;
          background: #333;
          border-radius: 2px;
          margin-top: 0.5rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #ff0000;
          transition: width 0.1s linear;
        }

        .video-controls {
          text-align: center;
        }

        .helper-text {
          color: #666;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .complete-btn {
          padding: 0.5rem 1.5rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .complete-btn.disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .complete-btn:not(.disabled):hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};
