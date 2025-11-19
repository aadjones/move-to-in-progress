import { useEffect, useRef } from 'react';
import { audioManager } from '../audio/AudioManager';

export const useAudio = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Initialize audio on first user interaction
    const initAudio = async () => {
      if (!initializedRef.current) {
        await audioManager.initialize();
        initializedRef.current = true;
      }
    };

    // Auto-initialize on any user interaction
    const handleInteraction = () => {
      initAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return {
    playPing: () => audioManager.playPing(),
    playFallingPing: (intensity: number) => audioManager.playFallingPing(intensity),
    playNightmarePing: (chaosLevel: number) => audioManager.playNightmarePing(chaosLevel),
    startNightmarePings: (subtaskCount: number) => audioManager.startNightmarePings(subtaskCount),
    stopNightmarePings: () => audioManager.stopNightmarePings(),
    playGroundDrone: () => audioManager.playGroundDrone(),
    playSlackKnock: () => audioManager.playSlackKnock(),
    playBlockedSound: () => audioManager.playBlockedSound(),
    // Stage 8 breakdown audio
    playBreakdownPing: (chaosLevel: number) => audioManager.playBreakdownPing(chaosLevel),
    startBreakdownPings: (subtaskCount: number) => audioManager.startBreakdownPings(subtaskCount),
    stopBreakdownPings: () => audioManager.stopBreakdownPings(),
    // Stage 10 singularity audio
    playSingularityKnock: () => audioManager.playSingularityKnock(),
  };
};
