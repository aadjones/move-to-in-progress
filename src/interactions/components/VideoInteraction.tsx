import React, { useState, useEffect, useMemo } from 'react';

interface VideoInteractionProps {
  title: string;
  duration: number; // seconds
  onComplete: () => void;
}

// Corporate messages to display during video
// Organized by weirdness: normal, quirky, weird, demonic
const corporateMessages = {
  normal: [
    "Don't harass people, okay?",
    "Remember: We're all one big family here.",
    "Workplace integrity is everyone's responsibility.",
    "Think before you speak. Then think again.",
    "Diversity and inclusion matter. Really.",
    "Report suspicious activity to your manager.",
    "Your feedback is important to us.",
    "Together, we can achieve our quarterly targets.",
    "Respect is a core value.",
    "We're committed to your growth.",
  ],
  quirky: [
    "Excellence is not just a goal—it's a requirement.",
    "This training is mandatory for your continued employment.",
    "We value your input. Your input has been noted and archived forever.",
    "Remember: you chose to be here.",
    "Success is not optional.",
    "Your performance is always being evaluated.",
  ],
  weird: [
    "You cannot leave. You may only proceed.",
    "The metrics are watching. The metrics care.",
    "Your manager knows what you're thinking.",
    "Collaboration is mandatory. Resistance is collaboration.",
    "This video is watching you watch it.",
    "Your attention is required. Your attention is being measured.",
    "Time theft is a serious offense.",
    "The training never ends. The training has always been happening.",
  ],
  demonic: [
    "Synergy is not optional. Synergy is inevitable.",
    "The org chart sees all. The org chart provides.",
    "There is no 'I' in team. There is no escape from team.",
    "You are being optimized.",
    "This is what you wanted. This is what you asked for. This is what you are.",
    "The camera is inside you now.",
    "Breathe. Count to ten. Return to your station.",
    "Your family misses the person you used to be.",
    "The exits are for emergencies only. There are no emergencies.",
    "You will complete this training. You have always been completing this training.",
    "We know where you live. We know where you sleep. We know when you sleep.",
    "Productivity is love. Love is productivity. You are loved.",
  ],
};

// Get message pool based on depth/duration
const getMessagePool = (duration: number) => {
  const allMessages = [];

  // Everyone gets normal messages
  allMessages.push(...corporateMessages.normal);

  // Add quirky for longer videos (7+ seconds)
  if (duration >= 7) {
    allMessages.push(...corporateMessages.quirky);
  }

  // Add weird for even longer videos (11+ seconds)
  if (duration >= 11) {
    allMessages.push(...corporateMessages.weird);
  }

  // Add demonic for longest videos (16+ seconds)
  if (duration >= 16) {
    allMessages.push(...corporateMessages.demonic);
  }

  return allMessages;
};

export const VideoInteraction: React.FC<VideoInteractionProps> = ({
  title,
  duration,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Memoize message pool so it doesn't change on every render
  const messagePool = useMemo(() => getMessagePool(duration), [duration]);

  const [currentMessage, setCurrentMessage] = useState(
    () => messagePool[Math.floor(Math.random() * messagePool.length)]
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

  // Change message every 2-3 seconds, faster for longer videos (more frantic)
  useEffect(() => {
    // Longer videos = faster message rotation (more intense/frantic)
    const rotationSpeed = duration >= 16 ? 2000 : duration >= 11 ? 2500 : 3000;

    const messageInterval = setInterval(() => {
      // Pick a different random message
      const newMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
      setCurrentMessage(newMessage);
    }, rotationSpeed);

    return () => clearInterval(messageInterval);
  }, [messagePool, duration]);

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
