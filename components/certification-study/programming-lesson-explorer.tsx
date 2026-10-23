"use client";

import React, { useId, useState } from "react";
import type { ProgrammingLesson } from "../../lib/certifications/information-processing-engineer/types";
import { characterCodeGroups, formatSpecExamples, formatSpecParts, pythonReference } from "../../lib/certifications/information-processing-engineer/python-reference";

export function ProgrammingLessonExplorer({ lessons }: { lessons: ProgrammingLesson[] }) {
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const lesson = lessons.find((entry) => entry.id === lessonId) ?? lessons[0];
  return <section aria-label="프로그래밍 단계별 이해" className="min-w-0 space-y-5">
    <p className="text-xs leading-6 text-muted-foreground">Python 3.12 / Java 17 기준의 자체 제작 예제입니다. 브라우저 실행기가 아니라 사전 검증한 실행 과정을 보여줍니다.</p>
    <div className="border-l-2 border-brand pl-3 text-sm leading-7"><p className="font-semibold">이름표 읽는 법</p><p>L1·L2는 리스트, I1·I2는 리스트 안의 리스트, O1·O2는 클래스로 만든 객체(Java에서는 배열·문자열 객체도 포함), D는 기본값 리스트에 붙인 설명용 이름표입니다. 숫자는 만들어진 순서이고 실제 메모리 주소가 아닙니다. <code>a → L1</code>은 "이름 a가 상자 L1을 가리킨다", <code>L1 = [→I1, →I2]</code>는 "L1의 칸들이 I1, I2를 가리킨다"는 뜻입니다.</p></div>
    <div role="group" aria-label="학습 주제" className="flex flex-wrap gap-2">{lessons.map((entry) => <button key={entry.id} type="button" aria-pressed={entry.id === lesson.id} onClick={() => setLessonId(entry.id)} className={`min-h-11 max-w-full rounded border px-3 py-2 text-left text-sm ${entry.id === lesson.id ? "border-brand bg-brand/5 text-brand" : "border-border"}`}>{entry.priority}순위 · {entry.title}</button>)}</div>
    <ExampleWalkthrough key={lesson.id} lesson={lesson} />
  </section>;
}

function ExampleWalkthrough({ lesson }: { lesson: ProgrammingLesson }) {
  const [exampleId, setExampleId] = useState(lesson.examples[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const example = lesson.examples.find((entry) => entry.id === exampleId) ?? lesson.examples[0];
  const step = example.steps[stepIndex];
  return <div className="min-w-0 space-y-4">
    <h3 className="text-lg font-semibold">{lesson.title}</h3><p className="text-sm leading-7">{lesson.rule}</p>
    <label className="block text-sm">비교 예제<select aria-label="비교 예제" className="mt-2 block min-h-11 w-full min-w-0 rounded border border-border bg-background px-2" value={example.id} onChange={(event) => { setExampleId(event.target.value); setStepIndex(0); }}>{lesson.examples.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label>
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
      <div className="min-w-0 overflow-x-auto rounded border border-border bg-muted/30 py-3"><pre className="text-sm leading-7">{example.code.split("\n").map((line, index) => <span key={index} className={`block min-w-max px-3 ${step.line === index + 1 ? "bg-brand/10 font-semibold text-brand" : ""}`}><span className="mr-3 inline-block w-5 text-right text-xs text-muted-foreground">{index + 1}</span>{line || " "}{"\n"}</span>)}</pre></div>
      <div aria-live="polite" aria-atomic="true" className="min-w-0 space-y-3">
        <p className="text-xs text-brand">단계 {stepIndex + 1} / {example.steps.length} · 코드 {step.line}행</p>
        <p className="text-sm leading-7">{step.explanation}</p>
        <h4 className="text-xs text-muted-foreground">현재 변수·객체·호출 상태</h4>
        <ul className="space-y-2">{step.bindings.map((binding) => <li key={binding} className="break-words rounded border border-border bg-background px-3 py-2 font-mono text-sm">{binding}</li>)}</ul>
        <h4 className="text-xs text-muted-foreground">현재까지 출력</h4><pre className="overflow-x-auto rounded border border-border p-3 text-sm">{step.output ?? "(아직 출력 없음)"}</pre>
      </div>
    </div>
    <div className="flex flex-wrap gap-2"><button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)} className="min-h-11 rounded border border-border px-3 text-sm disabled:opacity-40">이전 단계</button><button type="button" disabled={stepIndex === example.steps.length - 1} onClick={() => setStepIndex(stepIndex + 1)} className="min-h-11 rounded border border-border px-3 text-sm disabled:opacity-40">다음 단계</button><button type="button" onClick={() => setStepIndex(0)} className="min-h-11 rounded border border-border px-3 text-sm">처음부터</button></div>
    <div className="border-l-2 border-brand pl-3"><h4 className="text-sm font-semibold">틀리기 쉬운 차이</h4><p className="mt-2 text-sm leading-7">{lesson.trap}</p></div>
  </div>;
}

function describeCharacter(character: string) {
  const code = character.codePointAt(0)!;
  if (character === " ") return "' ' (공백)";
  if (code < 32 || (code >= 127 && code < 160)) return "화면에 보이지 않는 제어 문자";
  return `'${character}'`;
}

export function PythonTextFormatGuide() {
  const [characters, setCharacters] = useState("Az9");
  const [codeText, setCodeText] = useState("66");
  const code = Number(codeText);
  const isValidCode = /^\d+$/.test(codeText) && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff);
  return <section aria-label="문자 코드표와 서식 정리" className="min-w-0 space-y-5 border-y border-border py-5">
    <h3 className="font-semibold">문자 코드표 · ord와 chr</h3>
    <p className="text-sm leading-7">시작 번호 네 개만 외우고 나머지는 1씩 세면 됩니다. 공백 32, 숫자 문자 &apos;0&apos; 48, 대문자 &apos;A&apos; 65, 소문자 &apos;a&apos; 97. 같은 알파벳의 소문자는 대문자보다 32 큽니다.</p>
    {characterCodeGroups.map((group) => <div key={group.name} className="space-y-2">
      <h4 className="text-xs text-muted-foreground">{group.name} · {group.characters.length === 1 ? group.characters.codePointAt(0) : `${group.characters.codePointAt(0)}~${group.characters.codePointAt(group.characters.length - 1)}`}</h4>
      <div className="flex flex-wrap gap-1">{Array.from(group.characters).map((character) => <div key={character} className="min-w-10 rounded border border-border px-1 py-1 text-center font-mono"><p className="text-base font-semibold">{character === " " ? "␠" : character}</p><p className="text-xs text-muted-foreground">{character.codePointAt(0)}</p></div>)}</div>
    </div>)}
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2"><label className="block text-sm">문자 → ord(문자)<input value={characters} maxLength={10} onChange={(event) => setCharacters(event.target.value)} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-3 font-mono" /></label>
        <ul role="status" className="space-y-1 font-mono text-sm">{Array.from(characters).slice(0, 10).map((character, index) => <li key={index}>ord({describeCharacter(character)}) → {character.codePointAt(0)}</li>)}</ul></div>
      <div className="space-y-2"><label className="block text-sm">번호 → chr(번호)<input value={codeText} inputMode="numeric" onChange={(event) => setCodeText(event.target.value)} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-3 font-mono" /></label>
        <p role="status" className="font-mono text-sm">{isValidCode ? `chr(${code}) → ${describeCharacter(String.fromCodePoint(code))}` : "0~1114111 사이의 정수를 입력하세요. 범위를 벗어나면 Python은 ValueError입니다."}</p></div>
    </div>
    <h3 className="font-semibold">서식 지정자 · {"{값:채움 정렬 부호 # 0 폭 , .정밀도 타입}"}</h3>
    <p className="text-sm leading-7">콜론(:) 뒤를 이 순서로 한 칸씩 읽고, 쓰지 않은 칸은 건너뜁니다. 예를 들어 <code>*^8.2f</code>는 채움 *, 가운데 정렬, 폭 8, 소수 2자리 실수입니다. % 서식(<code>&apos;%5.1f&apos; % x</code>)과 <code>format()</code>도 같은 규칙을 씁니다.</p>
    <dl className="grid gap-2 text-sm sm:grid-cols-[96px_minmax(0,1fr)]">{formatSpecParts.map(([part, meaning, sample]) => <React.Fragment key={part}><dt className="font-mono font-semibold text-brand">{part}</dt><dd className="min-w-0">{meaning} <code className="whitespace-pre text-muted-foreground">{sample}</code></dd></React.Fragment>)}</dl>
    <p className="text-xs text-muted-foreground">아래 결과의 대괄호 [ ]는 빈칸이 몇 개인지 보이도록 붙인 것입니다.</p>
    <ul className="space-y-2">{formatSpecExamples.map((example) => <li key={example.expression} className="grid min-w-0 gap-1 rounded border border-border px-3 py-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <code className="break-all font-mono text-sm">{example.expression} → <span className="whitespace-pre font-semibold text-brand">{example.output}</span></code>
      <span className="text-sm text-muted-foreground">{example.reading}</span>
    </li>)}</ul>
  </section>;
}

export function PythonReferenceExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("전체");
  const [level, setLevel] = useState("전체");
  const [selectedId, setSelectedId] = useState(pythonReference[0].id);
  const detailId = useId();
  const visible = pythonReference.filter((entry) => (group === "전체" || entry.group === group) && (level === "전체" || entry.level === level) && `${entry.name} ${entry.summary} ${entry.trap}`.toLowerCase().includes(query.toLowerCase()));
  const selected = visible.find((entry) => entry.id === selectedId) ?? visible[0];
  return <section aria-label="Python 함수·메서드 사전" className="min-w-0 space-y-4">
    <p className="text-sm leading-7">{pythonReference.length}개 항목 모두 설명과 실행 예제를 제공합니다. 필수·보충은 학습 순서이며 실제 기출 여부를 뜻하지 않습니다. len(a)는 함수 호출, a.append(1)은 메서드 호출입니다.</p>
    <label className="block text-sm">함수·메서드 검색<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-3" placeholder="append, 원본, 정렬…" /></label>
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">자료형·분류<select aria-label="자료형·분류" value={group} onChange={(event) => setGroup(event.target.value)} className="mt-2 block min-h-11 w-full min-w-0 rounded border border-border bg-background px-2">{["전체", ...new Set(pythonReference.map((entry) => entry.group))].map((name) => <option key={name}>{name}</option>)}</select></label><label className="text-sm">학습 비중<select aria-label="학습 비중" value={level} onChange={(event) => setLevel(event.target.value)} className="mt-2 block min-h-11 w-full rounded border border-border bg-background px-2">{["전체", "필수", "보충"].map((name) => <option key={name}>{name}</option>)}</select></label></div>
    <p role="status" className="text-xs text-muted-foreground">{visible.length}개 항목</p>
    <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Python 사전 항목" className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">{visible.map((entry) => <button type="button" key={entry.id} aria-controls={detailId} aria-pressed={entry.id === selected?.id} onClick={() => setSelectedId(entry.id)} className={`min-h-11 min-w-0 break-all rounded border px-2 py-2 text-left font-mono text-xs ${entry.id === selected?.id ? "border-brand text-brand bg-brand/5" : "border-border"}`}>{entry.name}<span className="mt-1 block font-sans text-xs text-muted-foreground">{entry.group.split(" ")[0]}</span></button>)}</nav>
      {selected ? <div id={detailId} aria-live="polite" className="min-w-0 space-y-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
        <p className="text-xs text-brand">{selected.group} / {selected.level}</p><h3 className="text-2xl font-semibold">{selected.name}()</h3><p className="text-sm leading-7">{selected.summary}</p>
        <dl className="space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">반환값</dt><dd className="mt-1">{selected.returns}</dd></div><div><dt className="text-xs text-muted-foreground">원본 변경</dt><dd className="mt-1">{selected.mutates}</dd></div></dl>
        <pre className="max-w-full overflow-x-auto rounded border border-border p-3 text-sm leading-7"><code>{selected.code}</code></pre>
        <details key={selected.id}><summary className="min-h-11 cursor-pointer py-2 text-sm text-brand">예측 후 결과 확인</summary><pre className="overflow-x-auto whitespace-pre-wrap text-sm">{selected.output}</pre></details>
        <p className="border-l-2 border-brand pl-3 text-sm leading-7">{selected.trap}</p>
      </div> : <p>검색 조건에 맞는 항목이 없습니다.</p>}
    </div>
    <p className="text-xs leading-6 text-muted-foreground">정확한 출력의 모든 항목별 연습은 아래에서 풀 수 있습니다. Python 3.12 기준. <a href="https://docs.python.org/3.12/library/functions.html" target="_blank" rel="noreferrer" className="text-brand underline">내장 함수 공식 문서</a> / <a href="https://docs.python.org/3.12/library/stdtypes.html" target="_blank" rel="noreferrer" className="text-brand underline">자료형 공식 문서</a></p>
  </section>;
}
