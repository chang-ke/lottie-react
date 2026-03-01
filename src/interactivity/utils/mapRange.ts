/**
 * Maps a value from one range to another (linear interpolation).
 * Input is clamped to [inMin, inMax].
 *
 * @example mapRange(0.5, [0, 1], [0, 100]) → 50
 */
export const mapRange = (
  value: number,
  inRange: [number, number],
  outRange: [number, number],
): number => {
  const [inMin, inMax] = inRange;
  const [outMin, outMax] = outRange;
  const span = inMax - inMin;
  if (span === 0) return outMin;
  const clamped = Math.min(Math.max(value, inMin), inMax);
  return outMin + ((clamped - inMin) / span) * (outMax - outMin);
};
