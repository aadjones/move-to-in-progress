import React, { useState } from 'react';
import type { InteractionType } from '../types';

interface DropdownHierarchyInteractionProps {
  interactionData: Extract<InteractionType, { type: 'dropdown-hierarchy' }>;
  onComplete: (data?: Record<string, unknown>) => void;
}

export const DropdownHierarchyInteraction: React.FC<DropdownHierarchyInteractionProps> = ({
  interactionData,
  onComplete,
}) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [extraLevels, setExtraLevels] = useState<Array<{ label: string; options: string[] }>>([]);
  const [showingInception, setShowingInception] = useState(false);

  // Check if all current hierarchy items are selected
  const currentHierarchy = [...interactionData.hierarchy, ...extraLevels];
  const allSelected = currentHierarchy.every((level) => selections[level.label]);

  const handleSelectionChange = (label: string, value: string) => {
    setSelections((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allSelected) return;

    // Inception mode: Add more dropdowns instead of completing
    if (interactionData.inceptionMode && !showingInception) {
      // First inception wave: verification dropdowns
      setExtraLevels([
        {
          label: 'Approval Chain Verification Level',
          options: [
            'Primary Verification',
            'Secondary Verification',
            'Tertiary Verification',
            'Quaternary Verification',
            'Final Verification',
          ],
        },
      ]);
      setShowingInception(true);
      return;
    }

    if (interactionData.inceptionMode && showingInception && extraLevels.length === 1) {
      // Second inception wave: meta-approval
      setExtraLevels((prev) => [
        ...prev,
        {
          label: 'Meta-Approval Oversight',
          options: [
            'Oversight Committee A',
            'Oversight Committee B',
            'Oversight Committee C',
            'Joint Oversight Committee A-B',
            'Joint Oversight Committee B-C',
            'Joint Oversight Committee A-C',
            'Tri-Committee Oversight Panel',
          ],
        },
      ]);
      return;
    }

    if (interactionData.inceptionMode && showingInception && extraLevels.length === 2) {
      // Third inception wave: approval escalation matrix
      const escalationOptions: string[] = [];
      for (let tier = 1; tier <= 5; tier++) {
        for (let level = 1; level <= 3; level++) {
          escalationOptions.push(`Tier ${tier} - Level ${level} Escalation`);
        }
      }

      setExtraLevels((prev) => [
        ...prev,
        {
          label: 'Approval Escalation Matrix',
          options: escalationOptions,
        },
      ]);
      return;
    }

    // Finally complete after all inception levels
    onComplete({ selections });
  };

  return (
    <div className="dropdown-hierarchy-interaction">
      <h3>{interactionData.prompt}</h3>
      <form onSubmit={handleSubmit}>
        {currentHierarchy.map((level, index) => {
          const isNew = index >= interactionData.hierarchy.length;
          return (
            <div
              key={`${level.label}-${index}`}
              className={`hierarchy-level ${isNew ? 'inception-level' : ''}`}
              style={{
                maxHeight: isNew ? '120px' : undefined,
                animation: isNew ? 'slideIn 0.3s ease-out' : undefined,
              }}
            >
              <label>{level.label}</label>
              <select
                required
                value={selections[level.label] || ''}
                onChange={(e) => handleSelectionChange(level.label, e.target.value)}
                className={level.options.length > 20 ? 'tiny-scrolling-dropdown' : ''}
                style={{
                  maxHeight: level.options.length > 20 ? '100px' : undefined,
                }}
              >
                <option value="">Select...</option>
                {level.options.map((option, optIndex) => (
                  <option key={`${option}-${optIndex}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {level.options.length > 20 && (
                <div className="option-count">{level.options.length} options</div>
              )}
            </div>
          );
        })}
        <button type="submit" disabled={!allSelected}>
          Submit
        </button>
      </form>

      <style>{`
        .dropdown-hierarchy-interaction {
          padding: 1rem;
        }

        .hierarchy-level {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow: hidden;
        }

        .inception-level {
          border-left: 3px solid #f59e0b;
          padding-left: 1rem;
          background: rgba(245, 158, 11, 0.05);
        }

        .hierarchy-level label {
          font-weight: 500;
          color: #374151;
        }

        .hierarchy-level select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
          overflow-y: auto;
        }

        .hierarchy-level select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Friction for long dropdowns - tiny window with slow scrolling */
        .tiny-scrolling-dropdown {
          scroll-behavior: smooth;
          scrollbar-width: thin;
        }

        .tiny-scrolling-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .tiny-scrolling-dropdown::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .tiny-scrolling-dropdown::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Add option padding to make scrolling even more tedious */
        .tiny-scrolling-dropdown option {
          padding: 0.5rem;
          line-height: 1.8;
        }

        .option-count {
          font-size: 0.75rem;
          color: #6b7280;
          font-style: italic;
        }

        .dropdown-hierarchy-interaction button {
          width: 100%;
          padding: 0.75rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1rem;
        }

        .dropdown-hierarchy-interaction button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .dropdown-hierarchy-interaction button:not(:disabled):hover {
          background: #059669;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
