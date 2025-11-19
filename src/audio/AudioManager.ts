import * as Tone from 'tone';
import { AUDIO_CONFIG } from '../config/gameConfig';

class AudioManager {
  private synth: Tone.Synth | null = null;
  private pitchShift: Tone.PitchShift | null = null;
  private reverb: Tone.Reverb | null = null;
  private distortion: Tone.Distortion | null = null;
  private initialized = false;
  private nightmareEventId: number | null = null;

  // Stage 8 breakdown audio components
  private secondSynth: Tone.Synth | null = null;
  private bitCrusher: Tone.BitCrusher | null = null;
  private filter: Tone.Filter | null = null;
  private tremolo: Tone.Tremolo | null = null;
  private panner: Tone.Panner | null = null;
  private breakdownEventId: number | null = null;

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

      // Create Stage 8 breakdown audio chain (second synth voice)
      this.secondSynth = new Tone.Synth({
        oscillator: { type: 'triangle' }, // Different waveform for texture
        envelope: {
          attack: 0.01,
          decay: 0.15,
          sustain: 0.2,
          release: 0.2,
        },
      });

      // Stage 8 effects
      this.bitCrusher = new Tone.BitCrusher(AUDIO_CONFIG.STAGE_8.BITCRUSH_BITS);
      this.filter = new Tone.Filter(AUDIO_CONFIG.STAGE_8.FILTER_FREQ_START, 'lowpass');
      this.tremolo = new Tone.Tremolo(
        AUDIO_CONFIG.STAGE_8.TREMOLO_FREQUENCY,
        AUDIO_CONFIG.STAGE_8.TREMOLO_DEPTH
      ).start();
      this.panner = new Tone.Panner(0);

      // Connect second synth chain: secondSynth → bitCrusher → filter → tremolo → panner → distortion → output
      this.secondSynth.chain(
        this.bitCrusher,
        this.filter,
        this.tremolo,
        this.panner,
        this.distortion,
        Tone.getDestination()
      );

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

    // When called from Transport, use the scheduled time directly
    // Otherwise, schedule slightly in the future
    const when = time !== undefined ? time : Tone.now() + 0.01;

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
        now + 0.01 + AUDIO_CONFIG.KNOCK_TIMING[i] // Add small offset to ensure future timing
      );
    });
  }

  // Play "denied" sound for blocked tasks - lower, duller thud
  playBlockedSound() {
    if (!this.synth || !this.initialized) {
      console.warn('Audio not initialized for blocked sound');
      return;
    }

    // Low, dull sound - no distortion, some reverb for depth
    if (this.distortion) {
      this.distortion.distortion = 0;
    }
    if (this.reverb) {
      this.reverb.wet.value = 0.3;
    }
    if (this.pitchShift) {
      this.pitchShift.pitch = -7; // Lower pitch for "denied" feel
    }

    // Play a quick descending pattern (like a "bonk" or "denied")
    const now = Tone.now();
    this.synth.triggerAttackRelease(
      280, // Lower frequency than ping
      '8n', // Slightly longer duration
      now + 0.01
    );
    // Add a second lower note for emphasis
    this.synth.triggerAttackRelease(
      220,
      '16n',
      now + 0.08
    );
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

  // Play breakdown ping (Stage 8) - chaotic, unstable version
  playBreakdownPing(chaosLevel: number, time?: number) {
    if (!this.synth || !this.initialized) return;

    const when = time !== undefined ? time : Tone.now() + 0.01;

    // Extreme pitch variance - ±5 semitones
    const pitchVariance = (Math.random() - 0.5) * 2 * AUDIO_CONFIG.STAGE_8.PITCH_VARIANCE;
    const frequency = AUDIO_CONFIG.PING_FREQUENCY * Math.pow(2, pitchVariance / 12);
    const duration = AUDIO_CONFIG.PING_DURATION * (1 + chaosLevel * 0.15);

    // Max out distortion and reverb
    if (this.distortion) {
      this.distortion.distortion = 0.9;
    }
    if (this.reverb) {
      this.reverb.wet.value = 0.8;
    }

    // Random pan for stereo chaos
    if (this.panner) {
      this.panner.pan.value = (Math.random() - 0.5) * 2 * AUDIO_CONFIG.STAGE_8.PAN_RANGE;
    }

    // Gradually sweep filter down (muffling effect)
    if (this.filter) {
      const progress = Math.min(chaosLevel / 50, 1);
      const filterFreq =
        AUDIO_CONFIG.STAGE_8.FILTER_FREQ_START -
        (AUDIO_CONFIG.STAGE_8.FILTER_FREQ_START - AUDIO_CONFIG.STAGE_8.FILTER_FREQ_END) * progress;
      this.filter.frequency.value = filterFreq;
    }

    // Trigger the note
    this.synth.triggerAttackRelease(frequency, duration, when);
  }

  // Play second breakdown voice (Stage 8 polyrhythm)
  playSecondBreakdownPing(chaosLevel: number, time?: number) {
    if (!this.secondSynth || !this.initialized) return;

    const when = time !== undefined ? time : Tone.now() + 0.01;

    // Different pitch variance for detuned effect
    const pitchVariance = (Math.random() - 0.5) * 2 * AUDIO_CONFIG.STAGE_8.PITCH_VARIANCE;
    const frequency = AUDIO_CONFIG.STAGE_8.SECOND_SYNTH_FREQUENCY * Math.pow(2, pitchVariance / 12);
    const duration = AUDIO_CONFIG.PING_DURATION * (1.2 + chaosLevel * 0.1);

    // Random pan (opposite side of primary for stereo separation)
    if (this.panner) {
      this.panner.pan.value = (Math.random() - 0.5) * 2 * AUDIO_CONFIG.STAGE_8.PAN_RANGE * -1;
    }

    // Trigger the note
    this.secondSynth.triggerAttackRelease(frequency, duration, when);
  }

  // Start Stage 8 breakdown pings (dual voices, polyrhythm)
  startBreakdownPings(subtaskCount: number) {
    this.stopNightmarePings(); // Stop normal nightmare pings
    this.stopBreakdownPings(); // Clear any existing breakdown

    // Calculate intervals (both voices, different rates)
    const intervalRange =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - AUDIO_CONFIG.NIGHTMARE_FAST_INTERVAL;
    const normalizedCount = Math.min(subtaskCount / 20, 1);
    const baseIntervalMs =
      AUDIO_CONFIG.NIGHTMARE_BASE_INTERVAL - intervalRange * normalizedCount;

    // Primary voice interval
    const primaryIntervalSec = baseIntervalMs / 1000;

    // Secondary voice interval (70% of primary = polyrhythm)
    const secondaryIntervalSec =
      (baseIntervalMs * AUDIO_CONFIG.STAGE_8.SECOND_SYNTH_INTERVAL_RATIO) / 1000;

    // Start the transport if not already started
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }

    // Schedule primary voice
    this.nightmareEventId = Tone.Transport.scheduleRepeat((time) => {
      this.playBreakdownPing(subtaskCount, time);
    }, primaryIntervalSec);

    // Schedule secondary voice (polyrhythm)
    this.breakdownEventId = Tone.Transport.scheduleRepeat((time) => {
      this.playSecondBreakdownPing(subtaskCount, time);
    }, secondaryIntervalSec);
  }

  // Stop breakdown pings
  stopBreakdownPings() {
    if (this.nightmareEventId !== null) {
      Tone.Transport.clear(this.nightmareEventId);
      this.nightmareEventId = null;
    }
    if (this.breakdownEventId !== null) {
      Tone.Transport.clear(this.breakdownEventId);
      this.breakdownEventId = null;
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
    this.stopBreakdownPings();
    this.synth?.dispose();
    this.pitchShift?.dispose();
    this.reverb?.dispose();
    this.distortion?.dispose();
    this.secondSynth?.dispose();
    this.bitCrusher?.dispose();
    this.filter?.dispose();
    this.tremolo?.dispose();
    this.panner?.dispose();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
