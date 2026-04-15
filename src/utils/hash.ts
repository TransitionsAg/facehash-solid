export function stringHash(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }

  return Math.abs(hash);
}
