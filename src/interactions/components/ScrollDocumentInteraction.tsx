import React, { useState, useRef, useEffect } from 'react';

interface ScrollDocumentInteractionProps {
  title: string;
  pages: number;
  content: string[];
  onComplete: () => void;
}

export const ScrollDocumentInteraction: React.FC<ScrollDocumentInteractionProps> = ({
  title,
  pages,
  content,
  onComplete,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if scrolled to bottom (with small threshold)
    const threshold = 10;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();

      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasScrolledToBottom]);

  return (
    <div className="scroll-document-interaction">
      <h3>{title}</h3>

      <div className="document-info">
        <span className="page-count">{pages} pages</span>
        <span className="requirement">Please read entire document</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="document-content"
      >
        {content.map((paragraph, index) => (
          <p key={index} className="document-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      {!hasScrolledToBottom && (
        <div className="scroll-indicator">
          ↓ Scroll to bottom to continue ↓
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!hasScrolledToBottom}
        className={`continue-btn ${hasScrolledToBottom ? '' : 'disabled'}`}
      >
        {hasScrolledToBottom ? 'I have read and understood' : 'Scroll to bottom to continue'}
      </button>

      <style>{`
        .scroll-document-interaction {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .scroll-document-interaction h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .document-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ddd;
        }

        .page-count {
          font-size: 0.85rem;
          color: #666;
        }

        .requirement {
          font-size: 0.85rem;
          color: #ff6600;
          font-style: italic;
        }

        .document-content {
          flex: 1;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1.5rem;
          background: #fafafa;
          margin-bottom: 1rem;
          max-height: 400px;
          line-height: 1.6;
        }

        .document-content::-webkit-scrollbar {
          width: 8px;
        }

        .document-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .document-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .document-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .document-paragraph {
          margin-bottom: 1rem;
          text-align: justify;
          color: #333;
        }

        .scroll-indicator {
          text-align: center;
          color: #ff6600;
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
