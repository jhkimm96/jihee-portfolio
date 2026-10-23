import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pythonLessons } from "../lib/certifications/information-processing-engineer/python-lessons";
import { javaLessons } from "../lib/certifications/information-processing-engineer/java-lessons";
import { formatSpecExamples, pythonReference } from "../lib/certifications/information-processing-engineer/python-reference";
import { tracePythonSlice } from "../lib/certifications/information-processing-engineer/python-slicing";

const workingDirectory = mkdtempSync(join(tmpdir(), "study-programming-check-"));
let checked = 0;
const failures: string[] = [];
const sliceCases: [number, number | null, number | null, number][] = [];
for (const length of [0, 1, 7, 20]) for (const start of [null, -99, -8, -1, 0, 1, 7, 99]) for (const stop of [null, -99, -8, -1, 0, 1, 7, 99]) for (const step of [-3, -1, 1, 2, 3]) sliceCases.push([length, start, stop, step]);
const pythonSlices = spawnSync("python", ["-c", "import json,sys; print(json.dumps([list(range(n))[slice(a,b,c)] for n,a,b,c in json.load(sys.stdin)]))"], { input: JSON.stringify(sliceCases), encoding: "utf8", timeout: 30000 });
if (pythonSlices.status !== 0) failures.push(`slice oracle: ${pythonSlices.stderr}`);
else {
  const expectedSlices = JSON.parse(pythonSlices.stdout);
  sliceCases.forEach((args, index) => {
    if (JSON.stringify(tracePythonSlice(...args).indices) !== JSON.stringify(expectedSlices[index])) failures.push(`slice mismatch: ${JSON.stringify(args)}`);
  });
}
function checkOutput(id: string, command: string, args: string[], expected: string) {
  const result = spawnSync(command, args, { cwd: workingDirectory, encoding: "utf8", timeout: 30000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  const actual = result.stdout?.replace(/\r\n/g, "\n").replace(/\n$/, "");
  if (result.status !== 0 || actual !== expected) failures.push(`${id}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}; ${result.error?.message ?? result.stderr}`);
  checked++;
}
for (const lesson of pythonLessons) for (const example of lesson.examples) checkOutput(example.id, "python", ["-c", example.code], example.output);
for (const entry of pythonReference) checkOutput(entry.id, "python", ["-c", entry.code], entry.output);
for (const example of formatSpecExamples) checkOutput(`format ${example.expression}`, "python", ["-c", `print(${example.expression})`], example.output);
for (const lesson of javaLessons) for (const example of lesson.examples) {
  const source = join(workingDirectory, "Main.java");
  writeFileSync(source, example.code, "utf8");
  const compiled = spawnSync("javac", ["--release", "17", "-encoding", "UTF-8", source], { cwd: workingDirectory, encoding: "utf8", timeout: 30000 });
  if (compiled.status !== 0) { failures.push(`${example.id}: ${compiled.error?.message ?? compiled.stderr}`); continue; }
  checkOutput(example.id, "java", ["-cp", workingDirectory, "Main"], example.output);
}
console.log(JSON.stringify({ checked, sliceCases: sliceCases.length, pythonLessons: pythonLessons.length, javaLessons: javaLessons.length, referenceEntries: pythonReference.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
