export function isValueInPixels(value) {
  const regex = /[0-9]+(?:\.[0-9]+)?(?=px)/;

  return regex.test(value);
}

export function clamp(value, min, max) {
  if (max != null && value > max) return max;
  if (min != null && value < min) return min;

  return value;
}
