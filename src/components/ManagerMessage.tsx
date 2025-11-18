import React from 'react';
import '../styles/ManagerMessage.css';

interface ManagerMessageProps {
  onDismiss: () => void;
  onAudioInit: () => Promise<void>;
}

export const ManagerMessage: React.FC<ManagerMessageProps> = ({ onDismiss, onAudioInit }) => {
  const handleClick = async () => {
    await onAudioInit();
    onDismiss();
  };

  return (
    <div className="manager-message-overlay">
      <div className="manager-message-container">
        <div className="message-header">
          <div className="message-from">From: Your Manager</div>
          <div className="message-subject">Re: Dashboard Accuracy</div>
        </div>
        <div className="message-body">
          <p>
            Hey - the engineering dashboard is showing incorrect metrics because
            that "Refactor Notification System" card is still in To Do, but you
            started it yesterday.
          </p>
          <p>
            Can you just drag it to In Progress so the team velocity numbers are
            accurate for the stakeholder report?
          </p>
          <p>Should take like 5 seconds.</p>
        </div>
        <button className="message-button" onClick={handleClick}>
          Sure, no problem
        </button>
      </div>
    </div>
  );
};
