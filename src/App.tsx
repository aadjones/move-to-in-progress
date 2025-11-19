import { useState, useEffect, useMemo } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { FallingCard } from './components/FallingCard';
import { FloatingFragments } from './components/FloatingFragments';
import { NightmareZone } from './components/NightmareZone';
import { EndingModal } from './components/EndingModal';
import { GameEndingScreen } from './components/GameEndingScreen';
import { ManagerMessage } from './components/ManagerMessage';
import { TitleScreen } from './components/TitleScreen';
import { type BoardTask } from './types';
import { useGlitch } from './hooks/useGlitch';
import { audioManager } from './audio/AudioManager';
import { ANIMATION_CONFIG } from './config/animations';
import { GameStateMachine } from './core/GameStateMachine';

function App() {
  const [showTitleScreen, setShowTitleScreen] = useState(true);

  // Initialize game state machine
  const stateMachine = useMemo(() => new GameStateMachine(), []);
  const [gameState, setGameState] = useState(stateMachine.getState());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((newState) => {
      setGameState(newState);
    });
    return unsubscribe;
  }, [stateMachine]);

  const handleAudioInit = async () => {
    await audioManager.initialize();
  };

  const fallingTask: BoardTask = {
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
      const position = window.scrollY;
      stateMachine.dispatch({ type: 'SCROLL', payload: { position } });

      // Check if user reached the ground
      if (stateMachine.shouldTransitionToGround(ANIMATION_CONFIG.falling.scrollDistance)) {
        document.body.style.overflow = 'hidden';
        stateMachine.dispatch({ type: 'REACHED_GROUND' });
        audioManager.playGroundDrone();

        // Transition to nightmare after lingering pause
        setTimeout(() => {
          stateMachine.dispatch({ type: 'GROUND_TIMER_COMPLETE' });
        }, ANIMATION_CONFIG.ground.lingerDuration);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stateMachine]);

  const { intensity, hueRotation, scanlineOpacity } = useGlitch(
    gameState.scrollPosition,
    ANIMATION_CONFIG.falling.scrollDistance
  );

  // Play falling audio as user scrolls
  useEffect(() => {
    if (gameState.phase === 'falling' && intensity > 0.1) {
      audioManager.playFallingPing(intensity);
    }
  }, [Math.floor(gameState.scrollPosition / ANIMATION_CONFIG.falling.audioTriggerInterval), gameState.phase, intensity]);

  const handleTaskMovedToInProgress = (position: { x: number; y: number }, width: number) => {
    // Extend page height
    document.body.style.minHeight = `${ANIMATION_CONFIG.falling.pageHeight}px`;
    stateMachine.dispatch({
      type: 'TASK_MOVED_TO_IN_PROGRESS',
      payload: { position, width },
    });
  };

  const handleFallingCardLanded = () => {
    // Card has landed at bottom, waiting for scroll
  };

  const handleNightmareComplete = () => {
    stateMachine.dispatch({ type: 'NIGHTMARE_COMPLETE' });
  };

  const handleNightmareLeave = () => {
    stateMachine.dispatch({ type: 'NIGHTMARE_LEAVE' });
  };

  const handleGameEnding = (
    endingType: 'burn' | 'delegate' | 'assimilate',
    tasksUnlocked: number,
    nightmareStage: number
  ) => {
    stateMachine.dispatch({
      type: 'GAME_ENDING',
      payload: { endingType, tasksUnlocked, nightmareStage },
    });
  };

  const handleRestart = () => {
    document.body.style.overflow = 'auto';
    document.body.style.minHeight = 'auto';
    window.scrollTo(0, 0);
    stateMachine.dispatch({ type: 'RESTART' });
  };

  const handleDismissMessage = () => {
    stateMachine.dispatch({ type: 'DISMISS_MANAGER_MESSAGE' });
  };

  return (
    <>
      {/* Title Screen */}
      {showTitleScreen && (
        <TitleScreen onBegin={() => setShowTitleScreen(false)} />
      )}

      {/* Manager Message - Shows before everything else */}
      {!showTitleScreen && gameState.showManagerMessage && (
        <ManagerMessage
          onDismiss={handleDismissMessage}
          onAudioInit={handleAudioInit}
        />
      )}

      <div
        className="relative"
        style={{
          filter: gameState.phase === 'falling' ? `hue-rotate(${hueRotation}deg)` : undefined,
        }}
      >
      {/* Phase 1: Board */}
      {!showTitleScreen && gameState.phase === 'board' && !gameState.showManagerMessage && (
        <TaskBoard onTaskMovedToInProgress={handleTaskMovedToInProgress} />
      )}

      {/* Phase 2: Falling */}
      {gameState.phase === 'falling' && (
        <>
          {/* Falling card */}
          <FallingCard
            task={fallingTask}
            onLanded={handleFallingCardLanded}
            initialPosition={gameState.dropPosition}
            cardWidth={gameState.cardWidth}
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
      {gameState.phase === 'ground' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <p className="text-red-500 text-2xl font-bold animate-pulse">
            ▼ YOU HAVE REACHED THE BOTTOM ▼
          </p>
        </div>
      )}

      {/* Phase 4: Nightmare */}
      {gameState.phase === 'nightmare' && (
        <NightmareZone
          onComplete={handleNightmareComplete}
          onLeave={handleNightmareLeave}
          onGameEnding={handleGameEnding}
        />
      )}

      {/* Phase 5: Ending */}
      {gameState.phase === 'ending' && gameState.gameEndingType && (
        <GameEndingScreen
          endingType={gameState.gameEndingType}
          tasksUnlocked={gameState.tasksUnlocked}
          nightmareStage={gameState.nightmareStage}
          onRestart={handleRestart}
        />
      )}
      {gameState.phase === 'ending' && !gameState.gameEndingType && (
        <EndingModal variant={gameState.endingVariant} onRestart={handleRestart} />
      )}
      </div>
    </>
  );
}

export default App;
