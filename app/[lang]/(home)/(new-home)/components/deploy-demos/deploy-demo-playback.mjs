/**
 * @param {number} value
 */
function clampProgress(value) {
  return Math.min(1, Math.max(0, value));
}

/**
 * @param {number} duration
 * @param {number} progress
 */
export function getRemainingDuration(duration, progress) {
  return Math.max(0, duration) * (1 - clampProgress(progress));
}

/**
 * @typedef {{ index: number, loop: boolean, stepCount: number }} PlaybackStateInput
 */

/**
 * @param {PlaybackStateInput} input
 */
export function getNextPlaybackState({ index, loop, stepCount }) {
  const finalIndex = Math.max(0, stepCount - 1);
  const currentIndex = Math.min(finalIndex, Math.max(0, index));

  if (currentIndex < finalIndex) {
    return { completed: false, index: currentIndex + 1, progress: 0 };
  }

  return loop
    ? { completed: false, index: 0, progress: 0 }
    : { completed: true, index: finalIndex, progress: 1 };
}
