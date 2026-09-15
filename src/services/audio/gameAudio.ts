export type SoundCue = 'click' | 'correct' | 'incorrect' | 'tick' | 'timeout' | 'transition' | 'result';

const cueMap: Record<SoundCue, Array<[number, number, number]>> = {
  click: [[420, 0, 0.045]],
  correct: [[520, 0, 0.09], [720, 0.08, 0.14]],
  incorrect: [[240, 0, 0.14], [180, 0.1, 0.18]],
  tick: [[720, 0, 0.035]],
  timeout: [[300, 0, 0.1], [210, 0.09, 0.22]],
  transition: [[360, 0, 0.06], [460, 0.05, 0.08]],
  result: [[440, 0, 0.1], [590, 0.09, 0.12], [760, 0.2, 0.22]],
};

let context: AudioContext | null = null;

export function playSound(cue: SoundCue, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    context ??= new AudioContext();
    const now = context.currentTime;
    for (const [frequency, offset, duration] of cueMap[cue]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = cue === 'incorrect' || cue === 'timeout' ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(cue === 'tick' ? 0.025 : 0.055, now + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
    }
  } catch {
    // Audio is an enhancement; the game remains fully playable without it.
  }
}
