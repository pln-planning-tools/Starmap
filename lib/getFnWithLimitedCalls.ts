
type FnType<T> = T extends (...args: any[])=> infer R ? R : any
export function getFnWithLimitedCalls<T extends (...args: any[])=> any>(maxTimesToCallFunction: number, fn: T, defaultValueAtCap: Awaited<ReturnType<T>>) {
  let count = 0;
  return (...args: Parameters<T>): ReturnType<T> => {
    if (count <= maxTimesToCallFunction) {
      count++;
      return fn(...args);
    } else {
      return defaultValueAtCap;
    }
  }
}
