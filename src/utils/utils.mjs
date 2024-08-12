export function isValueInPixels(value) {
  const regex = /[0-9]+(?:\.[0-9]+)?(?=px)/;

  return regex.test(value);
}
