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

  return <section aria-label="슬라이싱 실험실" className="min-w-0 space-y-4 border-y border-border py-5">
    <h3 className="font-semibold">슬라이싱 실험실 · 인덱스를 한 칸씩 선택하기</h3>
    <p className="text-xs leading-6 text-muted-foreground">문자열 최대 20자. 빈 start·stop은 생략, 빈 step은 1입니다. 직접 값을 바꾸고 결과를 예측한 뒤 선택 과정을 확인하세요. 일반 Python의 문자열 코드 포인트 기준이며 리스트 대입·삭제는 아래 예제에서 따로 다룹니다.</p>
    <label className="block text-sm">원본 문자열<input value={source} onChange={(event) => { setSource(Array.from(event.target.value).slice(0, 20).join("")); setShown(0); }} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-3 font-mono" /></label>
    <div className="grid grid-cols-3 gap-3">{([ ["start", start, setStart], ["stop", stop, setStop], ["step", step, setStep] ] as const).map(([label, value, update]) => <label key={label} className="min-w-0 text-sm">{label}<input inputMode="text" value={value} placeholder="생략" onChange={(event) => { update(event.target.value); setShown(0); }} className="mt-2 min-h-11 w-full min-w-0 rounded border border-border bg-background px-2 font-mono" /></label>)}</div>
    <div role="group" aria-label="슬라이싱 비교 유형" className="flex flex-wrap gap-2">{presets.map(([label, a, b, c]) => <button type="button" key={label} onClick={() => { setStart(a); setStop(b); setStep(c); setShown(0); }} className="min-h-11 rounded border border-border px-3 text-xs">{label}</button>)}</div>
    <code className="block break-all text-sm">s[{start}:{stop}:{step}]</code>
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : <>
      <p className="text-sm">정규화 경계: 시작 {trace!.start}, 끝 {trace!.stop}(제외), 간격 {trace!.step} · {trace!.step > 0 ? "오른쪽 →" : "← 왼쪽"}</p>
      <div aria-label="원소와 양수·음수 인덱스" className="flex flex-wrap gap-2">{chars.map((char, index) => <div key={index} className={`min-w-11 rounded border px-2 py-2 text-center font-mono ${selected.includes(index) ? "border-brand bg-brand/10 text-brand" : "border-border"}`}><p className="text-xs">{index}</p><p className="my-2 text-lg font-semibold whitespace-pre">{char}</p><p className="text-xs">{index - chars.length}</p><p className="mt-1 text-xs">{selected.includes(index) ? `${selected.indexOf(index) + 1}번째` : "미선택"}</p></div>)}</div>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={shown >= trace!.indices.length} onClick={() => setShown(shown + 1)} className="min-h-11 rounded border border-border px-3 text-sm disabled:opacity-40">다음 원소 선택</button><button type="button" onClick={() => setShown(trace!.indices.length)} className="min-h-11 rounded border border-border px-3 text-sm">전체 결과 확인</button><button type="button" onClick={() => setShown(0)} className="min-h-11 rounded border border-border px-3 text-sm">처음부터</button></div>
      <div role="status" className="space-y-2 text-sm"><p>선택 순서: {selected.length ? selected.join(" → ") : "없음"}</p><p>현재 결과: <code>{JSON.stringify(result)}</code></p><p>{shown >= trace!.indices.length ? "선택 완료. 끝 인덱스는 포함하지 않습니다." : "아직 선택할 원소가 남아 있습니다."}</p></div>
    </>}
  </section>;
}
