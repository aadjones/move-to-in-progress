import * as Tone from 'tone';

// Audio constants
const AUDIO_CONFIG = {
  PING_FREQUENCY: 800, // Hz - Slack-like notification ping
  PING_DURATION: 0.1, // seconds
  KNOCK_FREQUENCIES: [400, 500], // Two-tone knock pattern
  KNOCK_TIMING: [0, 0.08], // Quick double knock
  FALLING_PITCH_SHIFT_MAX: -12, // semitones down
  NIGHTMARE_BASE_INTERVAL: 5000, // ms between pings
  NIGHTMARE_FAST_INTERVAL: 1000, // ms at max chaos
  REVERB_DECAY: 2, // seconds
  DISTORTION_AMOUNT: 0.8,
} as const;

class AudioManager {
  private synth: Tone.Synth | null = null;
  private pitchShift: Tone.PitchShift | null = null;
  private reverb: Tone.Reverb | null = null;
  private distortion: Tone.Distortion | null = null;
  private initialized = false;
  private nightmareInterval: NodeJS.Timeout | null = null;

  async initialize() {
    if (this.initialized) return;

    try {
      // MUST be called in response to user interaction
      await Tone.start();
      console.log('Tone.js audio context started');

      // Create synth for ping sounds
      this.synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 0.1,
        },
      });

      // Create effects chain
      this.pitchShift = new Tone.PitchShift();
      this.reverb = new Tone.Reverb(AUDIO_CONFIG.REVERB_DECAY);
      this.distortion = new Tone.Distortion(0);

      // Connect effects chain: synth → pitchShift → reverb → distortion → output
      this.synth.chain(this.pitchShift, this.reverb, this.distortion, Tone.getDestination());

      await this.reverb.generate();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  // Play a clean notification ping (Phase 1)
  playPing() {
    if (!this.synth || !this.initialized) {
      console.warn('Audio not initialized');
      return;
    }

    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY,
      AUDIO_CONFIG.PING_DURATION
    );
  }

  // Play ping with pitch shift for falling effect (Phase 2)
  playFallingPing(glitchIntensity: number) {
    if (!this.synth || !this.pitchShift || !this.initialized) {
      console.warn('Audio not initialized for falling ping');
      return;
    }

    // Gradually pitch shift down as intensity increases (0 to -12 semitones)
    const pitchShiftAmount = glitchIntensity * AUDIO_CONFIG.FALLING_PITCH_SHIFT_MAX;
    this.pitchShift.pitch = pitchShiftAmount;

    // Add slight reverb
    if (this.reverb) {
      this.reverb.wet.value = glitchIntensity * 0.5;
    }

    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY,
      AUDIO_CONFIG.PING_DURATION * (1 + glitchIntensity)
    );
  }

  // Play distorted ping for nightmare mode (Phase 4)
  playNightmarePing(chaosLevel: number) {
    if (!this.synth || !this.distortion || !this.initialized) return;

    // Increase distortion with chaos level
    const distortionAmount = Math.min(chaosLevel * 0.1, AUDIO_CONFIG.DISTORTION_AMOUNT);
    this.distortion.distortion = distortionAmount;

    // Add reverb
    if (this.reverb) {
      this.reverb.wet.value = Math.min(chaosLevel * 0.05, 0.7);
    }

    // Slightly randomize frequency for unease
    const frequency = AUDIO_CONFIG.PING_FREQUENCY + (Math.random() - 0.5) * 100;

    this.synth.triggerAttackRelease(
      frequency,
      AUDIO_CONFIG.PING_DURATION * (1 + chaosLevel * 0.1)
    );
  }

  // Play "knock knock" notification sound for toast messages
  playSlackKnock() {
    if (!this.synth || !this.initialized) {
      console.warn('Audio not initialized for Slack knock');
      return;
    }

    // Clean sound for notification - no distortion
    if (this.distortion) {
      this.distortion.distortion = 0;
    }
    if (this.reverb) {
      this.reverb.wet.value = 0.2;
    }
    if (this.pitchShift) {
      this.pitchShift.pitch = 0;
    }

    // Play double knock pattern: knock-knock
    const now = Tone.now();
    AUDIO_CONFIG.KNOCK_FREQUENCIES.forEach((freq, i) => {
      this.synth?.triggerAttackRelease(
        freq,
        '16n', // Very short
        now + AUDIO_CONFIG.KNOCK_TIMING[i]
      );
    });
  }

  // Start nightmare mode repeating pings
  startNightmarePings(subtaskCount: number) {
    this.stopNightmarePings(); // Clear any existing interval

    // Calculate interval based on subtask count (faster with more subtasks)
    const intervalRange =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - AUDIO_CONFIG.NIGHTMARE_FAST_INTERVAL;
    const normalizedCount = Math.min(subtaskCount / 20, 1); // 0 to 1
    const interval =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - intervalRange * normalizedCount;

    this.nightmareInterval = setInterval(() => {
      this.playNightmarePing(subtaskCount);
    }, interval);

    // Play immediately on start
    this.playNightmarePing(subtaskCount);
  }

  // Stop nightmare pings
  stopNightmarePings() {
    if (this.nightmareInterval) {
      clearInterval(this.nightmareInterval);
      this.nightmareInterval = null;
    }
  }

  // Play low drone for "reached the bottom" (Phase 3)
  playGroundDrone() {
    if (!this.synth || !this.initialized) return;

    if (this.pitchShift) {
      this.pitchShift.pitch = -24; // 2 octaves down
    }
    if (this.distortion) {
      this.distortion.distortion = 0.5;
    }

    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY / 2,
      '2n' // Half note duration
    );
  }

  // Cleanup
  dispose() {
    this.stopNightmarePings();
    this.synth?.dispose();
    this.pitchShift?.dispose();
    this.reverb?.dispose();
    this.distortion?.dispose();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
