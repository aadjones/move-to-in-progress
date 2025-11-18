import * as Tone from 'tone';
import { AUDIO_CONFIG } from '../config/gameConfig';

class AudioManager {
  private synth: Tone.Synth | null = null;
  private pitchShift: Tone.PitchShift | null = null;
  private reverb: Tone.Reverb | null = null;
  private distortion: Tone.Distortion | null = null;
  private initialized = false;
  private nightmareEventId: number | null = null;

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

    // Always use Tone.now() for absolute timing to avoid conflicts
    const now = Tone.now();
    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY,
      AUDIO_CONFIG.PING_DURATION,
      now + 0.01
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

    // Use absolute timing
    const now = Tone.now();
    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY,
      AUDIO_CONFIG.PING_DURATION * (1 + glitchIntensity),
      now + 0.01
    );
  }

  // Play distorted ping for nightmare mode (Phase 4)
  playNightmarePing(chaosLevel: number, time?: number) {
    if (!this.synth || !this.distortion || !this.initialized) return;

    // Ensure time is always in the future relative to Tone's current time
    const now = Tone.now();
    let when: number;

    if (time !== undefined) {
      // If Transport provides a time, ensure it's at least 0.01s ahead of now
      when = Math.max(time, now + 0.01);
    } else {
      when = now + 0.01;
    }

    // Slightly randomize frequency for unease
    const frequency = AUDIO_CONFIG.PING_FREQUENCY + (Math.random() - 0.5) * 100;
    const duration = AUDIO_CONFIG.PING_DURATION * (1 + chaosLevel * 0.1);

    // Set effect parameters immediately (these are not scheduled)
    const distortionAmount = Math.min(chaosLevel * 0.1, AUDIO_CONFIG.DISTORTION_AMOUNT);
    const reverbAmount = Math.min(chaosLevel * 0.05, 0.7);

    if (this.distortion) {
      this.distortion.distortion = distortionAmount;
    }
    if (this.reverb) {
      this.reverb.wet.value = reverbAmount;
    }

    // Trigger the note
    this.synth.triggerAttackRelease(frequency, duration, when);
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

    // Play double knock pattern using absolute timing
    const now = Tone.now();
    AUDIO_CONFIG.KNOCK_FREQUENCIES.forEach((freq, i) => {
      this.synth?.triggerAttackRelease(
        freq,
        '16n', // Very short
        now + AUDIO_CONFIG.KNOCK_TIMING[i]
      );
    });
  }

  // Start nightmare mode repeating pings using Tone.Transport
  startNightmarePings(subtaskCount: number) {
    this.stopNightmarePings(); // Clear any existing event

    // Calculate interval based on subtask count (faster with more subtasks)
    const intervalRange =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - AUDIO_CONFIG.NIGHTMARE_FAST_INTERVAL;
    const normalizedCount = Math.min(subtaskCount / 20, 1); // 0 to 1
    const intervalMs =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - intervalRange * normalizedCount;

    // Convert ms to seconds for Tone.Transport
    const intervalSec = intervalMs / 1000;

    // Start the transport if not already started
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }

    // Use Tone.Transport.scheduleRepeat - Transport provides precise timing
    this.nightmareEventId = Tone.Transport.scheduleRepeat((time) => {
      this.playNightmarePing(subtaskCount, time);
    }, intervalSec);
  }

  // Stop nightmare pings
  stopNightmarePings() {
    if (this.nightmareEventId !== null) {
      Tone.Transport.clear(this.nightmareEventId);
      this.nightmareEventId = null;
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

    // Use absolute timing
    const now = Tone.now();
    this.synth.triggerAttackRelease(
      AUDIO_CONFIG.PING_FREQUENCY / 2,
      '2n', // Half note duration
      now + 0.01
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
