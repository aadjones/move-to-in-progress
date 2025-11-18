import { useState, useEffect } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { FallingCard } from './components/FallingCard';
import { FloatingFragments } from './components/FloatingFragments';
import { NightmareZone } from './components/NightmareZone';
import { EndingModal } from './components/EndingModal';
import { ManagerMessage } from './components/ManagerMessage';
import { Phase } from './types';
import { useGlitch } from './hooks/useGlitch';
import { audioManager } from './utils/audio';
import { ANIMATION_CONFIG } from './config/animations';

function App() {
  const [showManagerMessage, setShowManagerMessage] = useState(true);
  const [phase, setPhase] = useState<Phase>('board');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [endingVariant, setEndingVariant] = useState<'complete' | 'leave'>('complete');
  const [dropPosition, setDropPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cardWidth, setCardWidth] = useState<number>(320);

  const handleAudioInit = async () => {
    await audioManager.initialize();
  };

  const fallingTask = {
    id: '1',
    title: 'Refactor Notifications System',
    column: 'todo' as const,
    assignee: 'you',
    tags: ['backend', 'P1'],
    timestamp: '2 days ago',
    description: 'Refactor the push notification service to support real-time delivery requirements from the Q3 roadmap.',
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Check if user reached the ground
      if (window.scrollY >= ANIMATION_CONFIG.falling.scrollDistance && phase === 'falling') {
        document.body.style.overflow = 'hidden';
        setPhase('ground');
        audioManager.playGroundDrone();

        // Transition to nightmare after lingering pause
        setTimeout(() => {
          setPhase('nightmare');
        }, ANIMATION_CONFIG.ground.lingerDuration);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  const { intensity, hueRotation, scanlineOpacity } = useGlitch(
    scrollPosition,
    ANIMATION_CONFIG.falling.scrollDistance
  );

  // Play falling audio as user scrolls
  useEffect(() => {
    if (phase === 'falling' && intensity > 0.1) {
      audioManager.playFallingPing(intensity);
    }
  }, [Math.floor(scrollPosition / ANIMATION_CONFIG.falling.audioTriggerInterval)]); // Trigger based on config

  const handleTaskMovedToInProgress = (position: { x: number; y: number }, width: number) => {
    // Extend page height
    document.body.style.minHeight = `${ANIMATION_CONFIG.falling.pageHeight}px`;
    setDropPosition(position);
    setCardWidth(width);
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
    setShowManagerMessage(true);
    setPhase('board');
  };

  const handleDismissMessage = () => {
    setShowManagerMessage(false);
  };

  return (
    <>
      {/* Manager Message - Shows before everything else */}
      {showManagerMessage && (
        <ManagerMessage
          onDismiss={handleDismissMessage}
          onAudioInit={handleAudioInit}
        />
      )}

      <div
        className="relative"
        style={{
          filter: phase === 'falling' ? `hue-rotate(${hueRotation}deg)` : undefined,
        }}
      >
      {/* Phase 1: Board */}
      {phase === 'board' && !showManagerMessage && (
        <TaskBoard onTaskMovedToInProgress={handleTaskMovedToInProgress} />
      )}

      {/* Phase 2: Falling */}
      {phase === 'falling' && (
        <>
          {/* Falling card */}
          <FallingCard
            task={fallingTask}
            onLanded={handleFallingCardLanded}
            initialPosition={dropPosition}
            cardWidth={cardWidth}
          />

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
          audio={{
            playNightmarePing: audioManager.playNightmarePing.bind(audioManager),
            startNightmarePings: audioManager.startNightmarePings.bind(audioManager),
            stopNightmarePings: audioManager.stopNightmarePings.bind(audioManager),
            playSlackKnock: audioManager.playSlackKnock.bind(audioManager),
          }}
        />
      )}

      {/* Phase 5: Ending */}
      {phase === 'ending' && (
        <EndingModal variant={endingVariant} onRestart={handleRestart} />
      )}
      </div>
    </>
  );
}

export default App;
