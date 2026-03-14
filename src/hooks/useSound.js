import { useCallback, useRef } from "react";

const STORAGE_KEY = "bgmi_sounds_enabled";

/**
 * Returns the persisted sound-enabled preference.
 * Defaults to true if never set.
 */
export function getSoundEnabled() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

/**
 * Persist the sound-enabled preference.
 */
export function setSoundEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY, enabled.toString());
}

/**
 * Hook that exposes simple sound-effect players via the Web Audio API.
 * No external audio files are required — all sounds are synthesised.
 *
 * @param {boolean} enabled - Whether sounds should play.
 */
export function useSound(enabled) {
  const ctxRef = useRef(null);

  /** Lazily create / resume the AudioContext on first use */
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /**
   * Play a single synthesised tone.
   * @param {number}   freq     - Oscillator frequency in Hz.
   * @param {number}   duration - Duration in seconds.
   * @param {string}   type     - OscillatorType (sine|square|triangle|sawtooth).
   * @param {number}   gain     - Peak gain (0–1).
   * @param {number}   delay    - Start delay in seconds (from now).
   */
  const playTone = useCallback(
    (freq, duration, type = "sine", gain = 0.25, delay = 0) => {
      if (!enabled) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = type;
        osc.frequency.value = freq;

        const start = ctx.currentTime + delay;
        gainNode.gain.setValueAtTime(gain, start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.start(start);
        osc.stop(start + duration + 0.05);
      } catch {
        // Silently ignore — audio is non-critical
      }
    },
    [enabled, getCtx]
  );

  /** Short tick when placing a guess pin on the map */
  const playClick = useCallback(() => {
    playTone(880, 0.07, "sine", 0.18);
  }, [playTone]);

  /** Two-note confirm sound when the player submits a guess */
  const playConfirm = useCallback(() => {
    playTone(660, 0.12, "sine", 0.25, 0);
    playTone(990, 0.18, "sine", 0.25, 0.1);
  }, [playTone]);

  /**
   * Score-dependent result jingle.
   * @param {number} score - Round score (0–1000).
   */
  const playScore = useCallback(
    (score) => {
      if (score >= 900) {
        // Perfect — bright ascending arpeggio
        [523, 659, 784, 1047].forEach((f, i) =>
          playTone(f, 0.22, "sine", 0.28, i * 0.09)
        );
      } else if (score >= 600) {
        // Good — two rising notes
        playTone(523, 0.2, "sine", 0.25, 0);
        playTone(659, 0.22, "sine", 0.25, 0.1);
      } else if (score > 0) {
        // Okay — single muted tone
        playTone(440, 0.18, "triangle", 0.2);
      }
      // score === 0 → silence (timeout or very wrong)
    },
    [playTone]
  );

  /** Descending beeps for timeout */
  const playTimeout = useCallback(() => {
    [440, 370, 310].forEach((f, i) =>
      playTone(f, 0.14, "square", 0.15, i * 0.12)
    );
  }, [playTone]);

  return { playClick, playConfirm, playScore, playTimeout };
}
