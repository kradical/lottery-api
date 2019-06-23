export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();

  a.forEach((value): void => {
    if (b.has(value)) {
      result.add(value);
    }
  });

  return result;
}
