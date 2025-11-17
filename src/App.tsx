import { useState, useEffect } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { FallingCard } from './components/FallingCard';
import { FloatingFragments } from './components/FloatingFragments';
import { NightmareZone } from './components/NightmareZone';
import { EndingModal } from './components/EndingModal';
import { Phase } from './types';
import { useGlitch } from './hooks/useGlitch';

const FALLING_DISTANCE = 2500;
const PAGE_HEIGHT = 4000;

function App() {
  const [phase, setPhase] = useState<Phase>('board');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [endingVariant, setEndingVariant] = useState<'complete' | 'leave'>('complete');

  const fallingTask = {
    id: '1',
    title: 'Refactor Notifications System',
    column: 'todo' as const,
    assignee: 'you',
    tags: ['backend', 'P1'],
    timestamp: '2 days ago',
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Check if user reached the ground
      if (window.scrollY >= FALLING_DISTANCE && phase === 'falling') {
        document.body.style.overflow = 'hidden';
        setPhase('ground');

        // Transition to nightmare after brief pause
        setTimeout(() => {
          setPhase('nightmare');
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  const { intensity, hueRotation, scanlineOpacity } = useGlitch(
    scrollPosition,
    FALLING_DISTANCE
  );

  const handleTaskMovedToInProgress = () => {
    // Extend page height
    document.body.style.minHeight = `${PAGE_HEIGHT}px`;
    setPhase('falling');
  };

  const handleFallingCardLanded = () => {
    // Card has landed at bottom, waiting for scroll
  };

  const handleNightmareComplete = () => {
    setEndingVariant('complete');
    setPhase('ending');
  };

  const handleNightmareLeave = () => {
    setEndingVariant('leave');
    setPhase('ending');
  };

  const handleRestart = () => {
    document.body.style.overflow = 'auto';
    document.body.style.minHeight = 'auto';
    window.scrollTo(0, 0);
    setPhase('board');
  };

  return (
    <div
      className="relative"
      style={{
        filter: phase === 'falling' ? `hue-rotate(${hueRotation}deg)` : undefined,
      }}
    >
      {/* Phase 1: Board */}
      {phase === 'board' && (
        <TaskBoard onTaskMovedToInProgress={handleTaskMovedToInProgress} />
      )}

      {/* Phase 2: Falling */}
      {phase === 'falling' && (
        <>
          {/* Hidden board in background */}
          <div className="opacity-50">
            <TaskBoard onTaskMovedToInProgress={() => {}} />
          </div>

          {/* Falling card */}
          <FallingCard task={fallingTask} onLanded={handleFallingCardLanded} />

          {/* Floating fragments */}
          <FloatingFragments intensity={intensity} />

          {/* Scanline effect */}
          <div
            className="scanlines"
            style={{ opacity: scanlineOpacity }}
          />
        </>
      )}

      {/* Phase 3: Ground */}
      {phase === 'ground' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <p className="text-red-500 text-2xl font-bold animate-pulse">
            ▼ YOU HAVE REACHED THE BOTTOM ▼
          </p>
        </div>
      )}

      {/* Phase 4: Nightmare */}
      {phase === 'nightmare' && (
        <NightmareZone
          onComplete={handleNightmareComplete}
          onLeave={handleNightmareLeave}
        />
      )}

      {/* Phase 5: Ending */}
      {phase === 'ending' && (
        <EndingModal variant={endingVariant} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;
