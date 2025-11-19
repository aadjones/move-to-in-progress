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
  const [totalSpawned, setTotalSpawned] = useState(0);

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

        // Calculate how many toasts to spawn in this batch
        const batchSize = Math.min(Math.floor(spawnCount / 10) + 1, 20);

        // Spawn them over time instead of all at once
        // This prevents audio scheduling conflicts
        for (let i = 0; i < batchSize; i++) {
          setTimeout(() => {
            const message = messages[Math.floor(Math.random() * messages.length)];
            const newToast = { id: Date.now() + Math.random(), message };

            setToasts((prev) => [...prev, newToast]);
            setTotalSpawned((prev) => prev + 1);

            // Play audio for this toast
            if (onSingularityToastAppear) {
              onSingularityToastAppear();
            } else {
              onToastAppear?.();
            }

            // Auto-remove toast after duration
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
            }, toastDuration);
          }, i * 20); // Spawn each toast 20ms apart
        }

        // Exponential decay - gets faster and faster (more aggressive acceleration)
        currentInterval = Math.max(20, spawnInterval * Math.pow(0.85, spawnCount));
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
        // Use multiple random seeds for more variety in spawn positions
        const angle = singularityMode ? (toast.id * 137.508) % 360 : 0; // Golden angle for better distribution
        // Use total spawned count for cumulative growth that never resets
        const toastSequence = singularityMode ? totalSpawned - (toasts.length - index) : 0;
        // Distance grows exponentially with total spawned count - truly explosive growth
        const distance = singularityMode ? toastSequence * accelerationFactor * 15 : 0;
        // Scale grows exponentially - each toast gets bigger as acceleration increases
        const scale = singularityMode ? Math.pow(accelerationFactor, 2) : 1;
        // Rotation grows with acceleration
        const rotation = singularityMode ? (toast.id * 23) % 90 - 45 : 0;
        // Add varied random offsets for screen position variety
        const randomOffsetX = singularityMode ? (Math.sin(toast.id * 0.547) * accelerationFactor * 300) : 0;
        const randomOffsetY = singularityMode ? (Math.cos(toast.id * 0.739) * accelerationFactor * 300) : 0;

        return (
          <div
            key={toast.id}
            className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border-l-4 border-blue-500 pointer-events-auto"
            style={{
              position: singularityMode ? 'absolute' : 'relative',
              left: singularityMode ? '50%' : 'auto',
              top: singularityMode ? '50%' : 'auto',
              animation: singularityMode
                ? ''
                : `slideInFade 0.3s ease-out, fadeOut 0.5s ease-in ${(toastDuration - 500) / 1000}s forwards`,
              transform: singularityMode
                ? `translate(-50%, -50%) translate(${Math.cos(angle * Math.PI / 180) * distance + randomOffsetX}px, ${Math.sin(angle * Math.PI / 180) * distance + randomOffsetY}px) scale(${scale}) rotate(${rotation}deg)`
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
