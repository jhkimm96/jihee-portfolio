"use client";

import React, { Fragment, useId, useState } from "react";
import { designPatterns, patternCategories, umlRelations, type DesignPattern, type UmlRelation } from "../../lib/certifications/information-processing-engineer/design-patterns";

export function DesignPatternExplorer() {
  const detailId = useId();
  const [section, setSection] = useState<"patterns" | "uml">("patterns");
  const [selectedId, setSelectedId] = useState("bridge");
  const concept = section === "patterns"
    ? designPatterns.find((pattern) => pattern.id === selectedId) ?? designPatterns[0]
    : umlRelations.find((relation) => relation.id === selectedId) ?? umlRelations[0];
  const groups = section === "patterns"
    ? patternCategories.map((category) => ({ label: `${category} · ${designPatterns.filter((pattern) => pattern.category === category).length}개`, items: designPatterns.filter((pattern) => pattern.category === category) }))
    : [{ label: "선과 끝 모양으로 구별", items: umlRelations }];

  function selectSection(nextSection: "patterns" | "uml") {
    setSection(nextSection);
    setSelectedId(nextSection === "patterns" ? "bridge" : "association");
  }

  return (
    <section aria-label="디자인 패턴과 UML 탐색" className="min-w-0 space-y-5">
      <div role="group" aria-label="학습 내용" className="flex flex-wrap gap-2">
        {([ ["patterns", "디자인 패턴 23개"], ["uml", "UML 관계 6개"] ] as const).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={section === id} onClick={() => selectSection(id)} className={`min-h-11 rounded border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand ${section === id ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand"}`}>{label}</button>
        ))}
      </div>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[205px_minmax(0,1fr)]">
        <nav aria-label={section === "patterns" ? "패턴 선택" : "UML 관계 선택"} className={`grid min-w-0 gap-3 ${section === "patterns" ? "grid-cols-3 lg:grid-cols-1" : "grid-cols-1"}`}>
          {groups.map((group) => (
            <div key={group.label} className="min-w-0">
              <h3 className="mb-2 text-xs text-muted-foreground">{group.label}</h3>
              <div className={`grid gap-1.5 ${section === "patterns" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-2"}`}>
                {group.items.map((item) => (
                  <button key={item.id} type="button" aria-controls={detailId} aria-pressed={concept.id === item.id} onClick={() => setSelectedId(item.id)} className={`min-h-11 min-w-0 rounded border px-2 py-2 text-left text-xs [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-brand ${concept.id === item.id ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand"}`}>{item.name}</button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <section id={detailId} aria-label="선택한 개념" aria-live="polite" aria-atomic="true" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="font-mono text-xs text-brand">{"category" in concept ? `${concept.category} 패턴` : "UML 관계"}</p>
          <h3 className="mt-2 text-2xl font-semibold">{concept.name}</h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{concept.en}</p>
          <p className="my-5 text-base leading-7">{concept.answer}</p>

          <h4 className="text-sm font-semibold">이럴 때 필요해요</h4>
          <p className="mt-2 text-sm leading-7">{concept.situation}</p>
          <figure className="my-5 min-w-0 border-y border-border py-4">
            <p className="mb-3 text-xs text-muted-foreground">{"diagram" in concept ? "상황 그림 · 동작을 이해하기 위한 예시" : "UML 관계 표기"}</p>
            {"diagram" in concept ? <PatternDiagram pattern={concept} /> : <UmlDiagram relation={concept} />}
            <figcaption className="mt-4 text-sm leading-7 text-muted-foreground">{concept.effect}</figcaption>
          </figure>

          <div className="border-l-2 border-brand pl-3">
            <h4 className="text-xs font-semibold text-brand">시험에서 찾을 표현</h4>
            <p className="mt-1 text-sm leading-7">{concept.clue}</p>
          </div>
          {"compare" in concept ? <div className="mt-5"><h4 className="text-sm font-semibold">헷갈리지 않기</h4><p className="mt-2 text-sm leading-7">{concept.compare}</p></div> : null}
          <details key={`${section}-${concept.id}`} className="mt-5 border-t border-border pt-2">
            <summary className="min-h-11 cursor-pointer py-2 text-sm text-brand">이름을 가리고 스스로 설명해 보기</summary>
            <p className="mt-2 text-sm leading-7">{concept.situation}<br />어떤 개념이며, 무엇을 해결하나요?</p>
          </details>
        </section>
      </div>

      <p className="border-t border-border pt-3 text-xs leading-6 text-muted-foreground">
        근거: <a className="text-brand underline underline-offset-4" href="https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780321770462" target="_blank" rel="noreferrer">GoF Design Patterns</a>{" / "}
        <a className="text-brand underline underline-offset-4" href="https://www.omg.org/spec/UML/2.5.1" target="_blank" rel="noreferrer">OMG UML 2.5.1</a>
      </p>
    </section>
  );
}

function PatternDiagram({ pattern }: { pattern: DesignPattern }) {
  if (pattern.diagram.kind === "bridge") {
    return (
      <div role="img" aria-label="긴급·예약 알림 기능 계층이 이메일·문자 전송 구현 계층에 전송을 위임하며 두 계층은 각각 확장할 수 있습니다." className="flex min-w-0 flex-wrap items-center justify-center gap-3">
        <div className="min-w-0 flex-1 border border-border p-3">
          <p className="mb-2 text-xs text-muted-foreground">기능 계층</p>
          {["긴급 알림", "예약 알림"].map((name) => <div key={name} className="mt-2 rounded border border-border bg-background px-2 py-3 text-center text-sm">{name}</div>)}
        </div>
        <div className="text-center"><p className="text-xs text-muted-foreground">전송 위임</p><span aria-hidden="true" className="text-2xl text-brand">→</span></div>
        <div className="min-w-0 flex-1 border border-border p-3">
          <p className="mb-2 text-xs text-muted-foreground">구현 계층</p>
          {["이메일 전송", "문자 전송"].map((name) => <div key={name} className="mt-2 rounded border border-border bg-background px-2 py-3 text-center text-sm">{name}</div>)}
        </div>
      </div>
    );
  }

  return (
    <div role="img" aria-label={`${pattern.name} 예시: ${pattern.situation}`} className="space-y-3">
      {pattern.diagram.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex min-w-0 flex-wrap items-center justify-center gap-2">
          {row.map((text, index) => (
            <Fragment key={`${rowIndex}-${index}`}>
              {index % 2 === 0
                ? <div className="min-w-0 max-w-full rounded border border-border bg-background px-3 py-3 text-center text-sm [overflow-wrap:anywhere]">{text}</div>
                : <div className="max-w-full text-center"><p className="text-xs text-muted-foreground">{text}</p><span aria-hidden="true" className="text-2xl text-brand">→</span></div>}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

export function UmlDiagram({ relation }: { relation: UmlRelation }) {
  const markerId = useId().replace(/:/g, "");
  const dashed = relation.kind === "dependency" || relation.kind === "realization";
  const triangle = relation.kind === "generalization" || relation.kind === "realization";
  const diamond = relation.kind === "aggregation" || relation.kind === "composition";
  return (
    <div role="img" aria-label={`${relation.name}: ${relation.left}에서 ${relation.right}로 연결. ${relation.effect}`} className="flex min-w-0 items-center gap-2">
      <span className="w-20 shrink-0 break-words text-center text-xs">{relation.left}</span>
      <svg aria-hidden="true" width="100%" height="52" className="min-w-0 flex-1 overflow-visible text-foreground">
        <defs>
          <marker id={`${markerId}-arrow`} markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="16" refX="12" refY="8" orient="auto"><path d="M 2 2 L 12 8 L 2 14" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker>
          <marker id={`${markerId}-triangle`} markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="18" refX="14" refY="9" orient="auto"><path d="M 1 2 L 14 9 L 1 16 Z" className="fill-card" stroke="currentColor" strokeWidth="1.5" /></marker>
          <marker id={`${markerId}-diamond`} markerUnits="userSpaceOnUse" markerWidth="24" markerHeight="18" refX="1" refY="9" orient="auto-start-reverse"><path d="M 1 9 L 11 2 L 22 9 L 11 16 Z" className={relation.kind === "composition" ? "fill-current" : "fill-card"} stroke="currentColor" strokeWidth="1.5" /></marker>
        </defs>
        <line x1={diamond ? "24" : "2"} y1="26" x2="94%" y2="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray={dashed ? "5 4" : undefined} markerStart={diamond ? `url(#${markerId}-diamond)` : undefined} markerEnd={triangle ? `url(#${markerId}-triangle)` : relation.kind === "dependency" ? `url(#${markerId}-arrow)` : undefined} />
      </svg>
      <span className="w-20 shrink-0 break-words text-center text-xs">{relation.right}</span>
    </div>
  );
}
