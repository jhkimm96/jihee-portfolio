"use client";

import React, { Fragment, useId, useState } from "react";
import type { SecurityLesson } from "../../lib/certifications/information-processing-engineer/security-concepts";

type TermFilter = "all" | "core" | "supplement";

export function SecurityConceptExplorer({ lesson }: { lesson: SecurityLesson }) {
  const detailId = useId();
  const [filter, setFilter] = useState<TermFilter>("all");
  const [selectedId, setSelectedId] = useState(lesson.terms[0].id);
  const visibleTerms = lesson.terms.filter((term) => filter === "all" || (filter === "supplement" ? term.supplement : !term.supplement));
  const selected = visibleTerms.find((term) => term.id === selectedId) ?? visibleTerms[0];
  const groups = [...new Set(visibleTerms.map((term) => term.group))];
  const hasSupplement = lesson.terms.some((term) => term.supplement);

  function selectFilter(nextFilter: TermFilter) {
    setFilter(nextFilter);
    const first = lesson.terms.find((term) => nextFilter === "all" || (nextFilter === "supplement" ? term.supplement : !term.supplement));
    if (first) setSelectedId(first.id);
  }

  return (
    <section aria-label={`${lesson.title} 탐색`} className="min-w-0 space-y-5">
      <p className="text-xs leading-6 text-muted-foreground">용어를 누르면 상황·흐름 그림·대응·비교를 볼 수 있습니다. 기본·기출 대비는 학습 분류이며 모든 용어가 실제 기출이라는 뜻은 아닙니다. 최신 보충은 최근 강조되는 추가 학습 범위입니다.</p>
      {hasSupplement ? (
        <div role="group" aria-label="보안 학습 범위" className="flex flex-wrap gap-2">
          {([ ["all", "전체"], ["core", "기본·기출 대비"], ["supplement", "최신 보충"] ] as const).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => selectFilter(id)} className={`min-h-11 rounded border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand ${filter === id ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand"}`}>{label}</button>
          ))}
        </div>
      ) : null}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[205px_minmax(0,1fr)]">
        <nav aria-label={`${lesson.title} 용어 선택`} className="grid min-w-0 grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {groups.map((group) => (
            <div key={group} className="min-w-0">
              <h3 className="mb-2 text-xs text-muted-foreground">{group}</h3>
              <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-2">
                {visibleTerms.filter((term) => term.group === group).map((term) => (
                  <button key={term.id} type="button" aria-pressed={term.id === selected.id} aria-controls={detailId} onClick={() => setSelectedId(term.id)} className={`min-h-11 min-w-0 rounded border px-2 py-2 text-left text-xs [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-brand ${term.id === selected.id ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand"}`}>{term.name}</button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <section id={detailId} aria-label="선택한 보안 개념" aria-live="polite" aria-atomic="true" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs text-brand">{selected.group} / {selected.supplement ? "최신 보충" : "기본·기출 대비"}</p>
          <h3 className="mt-2 text-2xl font-semibold [overflow-wrap:anywhere]">{selected.name}</h3>
          <p className="my-5 text-base leading-7">{selected.summary}</p>
          <h4 className="text-sm font-semibold">이런 상황이에요</h4>
          <p className="mt-2 text-sm leading-7">{selected.situation}</p>
          <figure className="my-5 min-w-0 border-y border-border py-4">
            <p className="mb-3 text-xs text-muted-foreground">행동과 결과를 따라가기</p>
            <div role="img" aria-label={`${selected.name}: ${selected.flow.join(" → ")}`} className="flex min-w-0 flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap">
              {selected.flow.map((text, index) => (
                <Fragment key={`${selected.id}-${index}`}>
                  {index % 2 === 0
                    ? <div className="min-w-0 max-w-full rounded border border-border bg-background px-3 py-3 text-center text-sm [overflow-wrap:anywhere]">{text}</div>
                    : <div className="max-w-full text-center"><p className="text-xs text-muted-foreground">{text}</p><span aria-hidden="true" className="inline-block rotate-90 text-2xl text-brand sm:rotate-0">→</span></div>}
                </Fragment>
              ))}
            </div>
          </figure>
          <div className="border-l-2 border-brand pl-3"><h4 className="text-xs font-semibold text-brand">지문에서 찾을 표현</h4><p className="mt-1 text-sm leading-7">{selected.keywords}</p></div>
          <div className="mt-5"><h4 className="text-sm font-semibold">방어·활용 원칙</h4><p className="mt-2 text-sm leading-7">{selected.protection}</p></div>
          <div className="mt-5"><h4 className="text-sm font-semibold">헷갈리지 않기</h4><p className="mt-2 text-sm leading-7">{selected.compare}</p></div>
          <details key={selected.id} className="mt-5 border-t border-border pt-2">
            <summary className="min-h-11 cursor-pointer py-2 text-sm text-brand">스스로 설명해 보기</summary>
            <p className="mt-2 text-sm leading-7">{selected.situation}<br />어떤 개념이며, 비슷한 용어와 무엇이 다를까요?</p>
          </details>
        </section>
      </div>
      <p className="border-t border-border pt-3 text-xs leading-6 text-muted-foreground">정의·대응 참고 / 2026-10-24 확인: {lesson.sources.map((source, index) => <Fragment key={source.url}>{index > 0 ? " / " : ""}<a href={source.url} target="_blank" rel="noreferrer" className="text-brand underline underline-offset-4">{source.label}</a></Fragment>)}</p>
    </section>
  );
}
