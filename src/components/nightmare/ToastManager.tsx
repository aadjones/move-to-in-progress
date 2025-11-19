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
  /** Singularity mode - exponential acceleration */
  singularityMode?: boolean;
  /** Singularity audio callback */
  onSingularityToastAppear?: () => void;
}

export const ToastManager = ({
  active,
  messages,
  spawnInterval = 2500,
  toastDuration = 3000,
  onToastAppear,
  singularityMode = false,
  onSingularityToastAppear,
}: ToastManagerProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [accelerationFactor, setAccelerationFactor] = useState(1);

  // Singularity mode: exponentially accelerating spawns
  useEffect(() => {
    if (!active || messages.length === 0) return;

    if (singularityMode) {
      // Exponential acceleration - starts slow, becomes insane
      let currentInterval = spawnInterval;
      let spawnCount = 0;
      let timeoutId: ReturnType<typeof setTimeout>;

      const scheduleNext = () => {
        spawnCount++;

        // Spawn multiple toasts at once as it accelerates
        const batchSize = Math.min(Math.floor(spawnCount / 10) + 1, 20);

        for (let i = 0; i < batchSize; i++) {
          const message = messages[Math.floor(Math.random() * messages.length)];
          const newToast = { id: Date.now() + i, message };

          setToasts((prev) => [...prev, newToast]);

          // Use singularity audio if in singularity mode
          if (onSingularityToastAppear) {
            onSingularityToastAppear();
          } else {
            onToastAppear?.();
          }

          // Auto-remove toast after duration
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
          }, toastDuration);
        }

        // Exponential decay - gets faster and faster
        currentInterval = Math.max(50, spawnInterval * Math.pow(0.92, spawnCount));
        setAccelerationFactor(spawnInterval / currentInterval);

        timeoutId = setTimeout(scheduleNext, currentInterval);
      };

      scheduleNext();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    } else {
      // Normal mode
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
    }
  }, [active, messages, spawnInterval, toastDuration, onToastAppear, singularityMode, onSingularityToastAppear]);

  return (
    <div className={`fixed ${singularityMode ? 'inset-0' : 'top-4 right-4 left-4 sm:left-auto'} z-[60] ${singularityMode ? '' : 'sm:max-w-sm space-y-2'} pointer-events-none`}>
      {toasts.map((toast, index) => {
        // In singularity mode, spawn from center and explode outward
        const angle = singularityMode ? (toast.id * 37) % 360 : 0;
        const distance = singularityMode ? Math.min(index * 5, 400) : 0;
        // Scale grows exponentially with acceleration factor - from 0.3 to 3x size
        const scale = singularityMode ? 0.3 + (accelerationFactor * 0.4) : 1;
        const rotation = singularityMode ? (toast.id * 13) % 60 - 30 : 0;

        return (
          <div
            key={toast.id}
            className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-blue-500 pointer-events-auto"
            style={{
              position: singularityMode ? 'absolute' : 'relative',
              left: singularityMode ? '50%' : 'auto',
              top: singularityMode ? '50%' : 'auto',
              animation: singularityMode
                ? `explodeOut 0.5s ease-out forwards`
                : `slideInFade 0.3s ease-out, fadeOut 0.5s ease-in ${(toastDuration - 500) / 1000}s forwards`,
              transform: singularityMode
                ? `translate(-50%, -50%) translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(${scale}) rotate(${rotation}deg)`
                : 'none',
              zIndex: singularityMode ? 1000 + index : 'auto',
            }}
          >
            <p className="text-xs sm:text-sm text-gray-800">{toast.message}</p>
          </div>
        );
      })}

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

        @keyframes explodeOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.1);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};
