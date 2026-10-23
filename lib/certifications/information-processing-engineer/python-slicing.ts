export function tracePythonSlice(length: number, start: number | null, stop: number | null, step: number): { start: number; stop: number; step: number; indices: number[] } {
  if (!Number.isSafeInteger(length) || length < 0 || length > 10000) throw new Error("길이는 0~10000의 정수여야 합니다.");
  if (![start, stop, step].every((value) => value === null || Number.isSafeInteger(value))) throw new Error("인덱스와 간격은 안전한 정수여야 합니다.");
  if (step === 0) throw new Error("ValueError: slice step cannot be zero");
  const forward = step > 0;
  const lower = forward ? 0 : -1;
  const upper = forward ? length : length - 1;
  function normalize(index: number | null, fallback: number) {
    if (index === null) return fallback;
    return Math.max(lower, Math.min(upper, index < 0 ? index + length : index));
  }
  // 생략한 역방향 끝 -1은 실제 인덱스 -1(마지막 원소)과 구분한다.
  const normalizedStart = normalize(start, forward ? 0 : length - 1);
  const normalizedStop = normalize(stop, forward ? length : -1);
  const indices: number[] = [];
  for (let index = normalizedStart; forward ? index < normalizedStop : index > normalizedStop; index += step) indices.push(index);
  return { start: normalizedStart, stop: normalizedStop, step, indices };
}
