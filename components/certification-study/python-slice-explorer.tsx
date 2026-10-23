"use client";

import React, { useState } from "react";
import { tracePythonSlice } from "../../lib/certifications/information-processing-engineer/python-slicing";

const presets = [
  ["기본", "1", "6", "2"], ["음수 인덱스", "-5", "-1", "1"], ["전체 역순", "", "", "-1"],
  ["명시한 -1", "", "-1", "-1"], ["역방향 간격", "5", "1", "-2"], ["방향 불일치", "1", "5", "-1"],
  ["범위 초과", "-99", "99", "1"], ["간격 0", "", "", "0"],
];

export function PythonSliceExplorer() {
  const [source, setSource] = useState("ABCDEFG");
  const [start, setStart] = useState("1");
  const [stop, setStop] = useState("6");
  const [step, setStep] = useState("2");
  const [shown, setShown] = useState(0);
  const chars = Array.from(source);
  let trace: ReturnType<typeof tracePythonSlice> | null = null;
  let error = "";
  try {
    const parse = (text: string) => { if (!/^-?\d+$/.test(text)) throw new Error("생략하거나 정수를 입력하세요."); return Number(text); };
    trace = tracePythonSlice(chars.length, start === "" ? null : parse(start), stop === "" ? null : parse(stop), step === "" ? 1 : parse(step));
  } catch (cause) { error = cause instanceof Error ? cause.message : "입력을 확인하세요."; }
  const selected = trace?.indices.slice(0, shown) ?? [];
  const result = selected.map((index) => chars[index]).join("");
  const negativeInputs = ([["start", start], ["stop", stop]] as const).filter(([, value]) => /^-\d+$/.test(value) && chars.length + Number(value) >= 0);

  // 역방향의 생략한 끝 -1과 길이 위치는 실제 원소가 아니므로 숫자 대신 바깥 경계로 읽는다.
  function describeStop(stopIndex: number, step: number) {
    if (step < 0 && stopIndex === -1) return "맨 앞 바깥(0보다 앞)";
    if (step > 0 && stopIndex === chars.length) return `맨 끝 바깥(${stopIndex})`;
    return `${stopIndex}(제외)`;
  }

  function explainEmptyResult(startIndex: number, stopIndex: number, step: number) {
    if (chars.length === 0) return "원본이 비어 있어 고를 원소가 없습니다.";
    if (startIndex === stopIndex) return `시작(${startIndex})과 제외할 끝(${stopIndex})이 같아 첫 칸부터 멈춥니다.`;
    return step > 0
      ? `오른쪽(→)으로 가는데 끝(${stopIndex})이 시작(${startIndex})보다 왼쪽에 있어 닿을 수 없습니다. 양수 step은 시작 < 끝이어야 합니다.`
      : `왼쪽(←)으로 가는데 끝(${stopIndex})이 시작(${startIndex})보다 오른쪽에 있어 닿을 수 없습니다. 음수 step은 시작 > 끝이어야 합니다.`;
  }

  return <section aria-label="슬라이싱 실험실" className="min-w-0 space-y-4 border-y border-border py-5">
    <h3 className="font-semibold">슬라이싱 실험실 · 인덱스를 한 칸씩 선택하기</h3>
    <p className="text-xs leading-6 text-muted-foreground">문자열 최대 20자. 빈 start·stop은 생략, 빈 step은 1입니다. 직접 값을 바꾸고 결과를 예측한 뒤 선택 과정을 확인하세요. 일반 Python의 문자열 코드 포인트 기준이며 리스트 대입·삭제는 아래 예제에서 따로 다룹니다.</p>
    <label className="block text-sm">원본 문자열<input value={source} onChange={(event) => { setSource(Array.from(event.target.value).slice(0, 20).join("")); setShown(0); }} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-3 font-mono" /></label>
    <div className="grid grid-cols-3 gap-3">{([ ["start", start, setStart], ["stop", stop, setStop], ["step", step, setStep] ] as const).map(([label, value, update]) => <label key={label} className="min-w-0 text-sm">{label}<input inputMode="text" value={value} placeholder="생략" onChange={(event) => { update(event.target.value); setShown(0); }} className="mt-2 min-h-11 w-full min-w-0 rounded border border-border bg-background px-2 font-mono" /></label>)}</div>
    <div role="group" aria-label="슬라이싱 비교 유형" className="flex flex-wrap gap-2">{presets.map(([label, a, b, c]) => <button type="button" key={label} onClick={() => { setStart(a); setStop(b); setStep(c); setShown(0); }} className="min-h-11 rounded border border-border px-3 text-xs">{label}</button>)}</div>
    <code className="block break-all text-sm">s[{start}:{stop}:{step}]</code>
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : <>
      <p className="text-sm">실제 경계: 시작 {trace!.start}, 끝 {describeStop(trace!.stop, trace!.step)}, 간격 {trace!.step} · {trace!.step > 0 ? "오른쪽 →" : "← 왼쪽"}</p>
      {negativeInputs.length ? <p className="text-xs text-muted-foreground">음수 입력은 길이를 더해 읽습니다: {negativeInputs.map(([label, value]) => `${label} ${value} → ${chars.length} + (${value}) = ${chars.length + Number(value)}`).join(" / ")}</p> : null}
      <div aria-label="원소와 양수·음수 인덱스" className="flex flex-wrap gap-2">{chars.map((char, index) => <div key={index} className={`min-w-11 rounded border px-2 py-2 text-center font-mono ${selected.includes(index) ? "border-brand bg-brand/10 text-brand" : "border-border"}`}><p className="text-xs">{index}</p><p className="my-2 text-lg font-semibold whitespace-pre">{char}</p><p className="text-xs">{index - chars.length}</p><p className="mt-1 text-xs">{selected.includes(index) ? `${selected.indexOf(index) + 1}번째` : "미선택"}</p></div>)}</div>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={shown >= trace!.indices.length} onClick={() => setShown(shown + 1)} className="min-h-11 rounded border border-border px-3 text-sm disabled:opacity-40">다음 원소 선택</button><button type="button" onClick={() => setShown(trace!.indices.length)} className="min-h-11 rounded border border-border px-3 text-sm">전체 결과 확인</button><button type="button" onClick={() => setShown(0)} className="min-h-11 rounded border border-border px-3 text-sm">처음부터</button></div>
      <div role="status" className="space-y-2 text-sm"><p>선택 순서: {selected.length ? selected.join(" → ") : "없음"}</p><p>현재 결과: <code>{JSON.stringify(result)}</code></p><p>{trace!.indices.length === 0 ? `선택할 원소가 없어 결과는 빈 문자열 ''입니다. ${explainEmptyResult(trace!.start, trace!.stop, trace!.step)}` : shown >= trace!.indices.length ? "선택 완료. 끝 인덱스는 포함하지 않습니다." : "아직 선택할 원소가 남아 있습니다."}</p></div>
    </>}
  </section>;
}
