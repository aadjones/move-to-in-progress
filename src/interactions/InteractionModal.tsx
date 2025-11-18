import React, { useState } from 'react';
import type { InteractionType, InteractionResult } from './types';
import { VideoInteraction } from './components/VideoInteraction';
import { FormInteraction } from './components/FormInteraction';
import { TypingPromptInteraction } from './components/TypingPromptInteraction';
import { CheckboxesInteraction } from './components/CheckboxesInteraction';
import { ScrollDocumentInteraction } from './components/ScrollDocumentInteraction';
import { LoadingDelayInteraction } from './components/LoadingDelayInteraction';

interface InteractionModalProps {
  interaction: InteractionType;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: InteractionResult) => void;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  interaction,
  taskTitle,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [startTime] = useState(Date.now());
  const [currentStep] = useState(0);

  if (!isOpen) return null;

  const handleComplete = (data?: Record<string, unknown>) => {
    const duration = (Date.now() - startTime) / 1000;

    onComplete({
      completed: true,
      duration,
      data,
    });
  };

  const renderInteraction = (interactionData: InteractionType): React.ReactNode => {
    switch (interactionData.type) {
      case 'video':
        return (
          <VideoInteraction
            title={interactionData.title}
            duration={interactionData.duration}
            onComplete={handleComplete}
          />
        );

      case 'form':
        return (
          <FormInteraction
            title={interactionData.title}
            fields={interactionData.fields}
            submitText={interactionData.submitText}
            vagueValidation={interactionData.vagueValidation}
            onComplete={(formData) => handleComplete(formData)}
          />
        );

      case 'typing-prompt':
        return (
          <TypingPromptInteraction
            prompt={interactionData.prompt}
            expected={interactionData.expected}
            caseSensitive={interactionData.caseSensitive}
            placeholder={interactionData.placeholder}
            onComplete={handleComplete}
          />
        );

      case 'checkboxes':
        return (
          <CheckboxesInteraction
            title={interactionData.title}
            items={interactionData.items}
            continueText={interactionData.continueText}
            onComplete={handleComplete}
          />
        );

      case 'scroll-document':
        return (
          <ScrollDocumentInteraction
            title={interactionData.title}
            pages={interactionData.pages}
            content={interactionData.content}
            onComplete={handleComplete}
          />
        );

      case 'loading-delay':
        return (
          <LoadingDelayInteraction
            message={interactionData.message}
            duration={interactionData.duration}
            showProgress={interactionData.showProgress}
            onComplete={handleComplete}
          />
        );

      case 'multi-step': {
        const currentStepData = interactionData.steps[currentStep];

        if (!currentStepData) {
          // All steps complete
          handleComplete();
          return null;
        }

        return (
          <div className="multi-step-container">
            {interactionData.showStepIndicator && (
              <div className="step-indicator">
                Step {currentStep + 1} of {interactionData.steps.length}
              </div>
            )}

            <h3 className="multi-step-title">{interactionData.title}</h3>

            {renderInteraction(currentStepData)}
          </div>
        );
      }

      case 'calendar-select':
        // Simple implementation for calendar select
        return (
          <div className="calendar-select-interaction">
            <h3>{interactionData.prompt}</h3>
            <div className="calendar-slots">
              {interactionData.slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleComplete()}
                  className="calendar-slot"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        );

      case 'dropdown-hierarchy':
        // Simple implementation for dropdown hierarchy
        return (
          <div className="dropdown-hierarchy-interaction">
            <h3>{interactionData.prompt}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleComplete(); }}>
              {interactionData.hierarchy.map((level, index) => (
                <div key={index} className="hierarchy-level">
                  <label>{level.label}</label>
                  <select required>
                    <option value="">Select...</option>
                    {level.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="submit">Submit</button>
            </form>
          </div>
        );

      default:
        return <div>Unknown interaction type</div>;
    }
  };


  return (
    <div className="interaction-modal-overlay" onClick={onClose}>
      <div className="interaction-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskTitle}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {interaction.type === 'multi-step' ? (
            <div className="multi-step-wrapper">
              {renderInteraction(interaction.steps[currentStep])}
            </div>
          ) : (
            renderInteraction(interaction)
          )}
        </div>
      </div>

      <style>{`
        .interaction-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .interaction-modal-content {
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
        }

        /* Multi-step specific styles */
        .multi-step-container {
          padding: 1.5rem;
        }

        .step-indicator {
          text-align: center;
          font-size: 0.85rem;
          color: #666;
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .multi-step-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        /* Calendar select styles */
        .calendar-select-interaction {
          padding: 1.5rem;
        }

        .calendar-select-interaction h3 {
          margin-bottom: 1rem;
        }

        .calendar-slots {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .calendar-slot {
          padding: 0.75rem;
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .calendar-slot:hover {
          background: #e8f5e9;
          border-color: #4CAF50;
        }

        /* Dropdown hierarchy styles */
        .dropdown-hierarchy-interaction {
          padding: 1.5rem;
        }

        .dropdown-hierarchy-interaction h3 {
          margin-bottom: 1.5rem;
        }

        .hierarchy-level {
          margin-bottom: 1rem;
        }

        .hierarchy-level label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .hierarchy-level select {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .dropdown-hierarchy-interaction button[type="submit"] {
          width: 100%;
          padding: 0.7rem;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }

        .dropdown-hierarchy-interaction button[type="submit"]:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};
