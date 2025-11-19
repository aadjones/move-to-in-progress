/**
 * Toast Manager
 *
 * Displays notification toasts in the top-right corner
 * Used for spam notifications during chaos phase
 */

import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
}

interface ToastManagerProps {
  /** Whether toasts should be actively spawned */
  active: boolean;
  /** Messages to randomly select from */
  messages: string[];
  /** Interval between toast spawns (ms) */
  spawnInterval?: number;
  /** How long each toast should display (ms) */
  toastDuration?: number;
  /** Audio callback to play when toast appears */
  onToastAppear?: () => void;
}

export const ToastManager = ({
  active,
  messages,
  spawnInterval = 2500,
  toastDuration = 3000,
  onToastAppear,
}: ToastManagerProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Spawn toasts while active
  useEffect(() => {
    if (!active || messages.length === 0) return;

    const interval = setInterval(() => {
      const message = messages[Math.floor(Math.random() * messages.length)];
      const newToast = { id: Date.now(), message };

      setToasts((prev) => [...prev, newToast]);
      onToastAppear?.();

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, toastDuration);
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [active, messages, spawnInterval, toastDuration, onToastAppear]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-[60] max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white rounded-lg shadow-lg p-4 animate-slide-in-fade border-l-4 border-blue-500 pointer-events-auto"
          style={{
            animation: `slideInFade 0.3s ease-out, fadeOut 0.5s ease-in ${(toastDuration - 500) / 1000}s forwards`,
          }}
        >
          <p className="text-sm text-gray-800">{toast.message}</p>
        </div>
      ))}

      <style>{`
        @keyframes slideInFade {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
};
