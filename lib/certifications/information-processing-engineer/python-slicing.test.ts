import { describe, expect, it } from "vitest";
import { tracePythonSlice } from "./python-slicing";

describe("Python slice indices", () => {
  it.each([
    [7, 1, 6, 2, [1, 3, 5]], [7, -5, -1, 1, [2, 3, 4, 5]],
    [7, null, null, -1, [6, 5, 4, 3, 2, 1, 0]], [7, null, -1, -1, []],
    [7, 5, 1, -2, [5, 3]], [7, 1, 5, -1, []], [3, -99, 99, 1, [0, 1, 2]],
    [0, null, null, -1, []], [7, -99, null, -1, []],
  ])("selects Python-compatible indices for %s/%s/%s/%s", (length, start, stop, step, expected) => {
    expect(tracePythonSlice(length as number, start as number | null, stop as number | null, step as number).indices).toEqual(expected);
  });
  it("rejects zero steps and unsafe or oversized inputs before iterating", () => {
    for (const args of [[7, null, null, 0], [10001, null, null, 1], [3, 1.2, null, 1], [3, null, null, Infinity]]) {
      expect(() => tracePythonSlice(...args as [number, number | null, number | null, number])).toThrow();
    }
  });
});
