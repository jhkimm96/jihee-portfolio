"use client";

import React, { useId, useState } from "react";
import type { PointerLesson } from "@/lib/certifications/information-processing-engineer/pointer-walkthroughs";

export function PointerWalkthrough({ lesson }: { lesson: PointerLesson }) {
  const headingId = useId();
  const [stepIndex, setStepIndex] = useState(0);
  const step = lesson.steps[stepIndex];
  const visibleObjects = lesson.objects.filter((object) => !step.visibleObjects || step.visibleObjects.includes(object.id));

  function findAddressTarget(address: string) {
    for (const object of visibleObjects) {
      const field = object.fields.find((entry) => entry.address === address);
      if (field) return field.label.split(" · ")[0];
      if (object.address === address) return object.name;
    }
    return null;
  }

  return (
    <section aria-labelledby={headingId} className="min-w-0 space-y-4">
      <div>
        <h3 id={headingId} className="text-sm font-semibold">주소를 하나씩 따라가 보기</h3>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{lesson.note}</p>
      </div>

      <div role="group" aria-label="포인터 추적 단계" className="flex flex-wrap gap-2">
        {lesson.steps.map((entry, index) => (
          <button
            key={entry.label}
            type="button"
            aria-pressed={index === stepIndex}
            onClick={() => setStepIndex(index)}
            className={`min-h-11 max-w-full rounded border px-3 py-2 text-left font-mono text-xs [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-brand ${index === stepIndex ? "border-brand bg-brand/5 text-brand" : "border-border hover:border-brand"}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleObjects.map((object) => (
          <div key={object.id} className="min-w-0">
            <p className={`mb-2 text-xs ${step.highlight.includes(object.id) ? "font-semibold text-brand" : "text-muted-foreground"}`}>
              {object.fields.some((field) => field.address) ? "시작 주소" : object.fields.length === 0 ? "함수 주소" : "자기 주소"}
              {" "}<span className="font-mono text-sm font-semibold">{object.address}</span>
            </p>
            <div className={`rounded-t border px-3 py-2 ${step.highlight.includes(object.id) ? "border-brand bg-brand/5" : "border-border bg-muted/40"}`}>
              <p className="break-words font-mono text-sm font-semibold">{object.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{object.kind}</p>
            </div>
            {object.fields.length > 0 ? (
              <dl className="divide-y divide-border rounded-b border border-t-0 border-border">
                {object.fields.map((field) => {
                  const value = step.values?.[field.id] ?? field.value;
                  const target = field.kind === "integer" ? null : findAddressTarget(value);
                  const highlighted = step.highlight.includes(field.id);
                  return (
                    <div key={field.id} className={`px-3 py-3 ${highlighted ? "bg-brand/5" : ""}`}>
                      {field.address ? <p className="mb-1 font-mono text-xs text-muted-foreground">자기 주소 {field.address}</p> : null}
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <dt className="text-xs text-muted-foreground">{field.label}</dt>
                        <dd className={`font-mono text-lg font-semibold ${highlighted ? "text-brand" : ""}`}>{value}</dd>
                      </div>
                      {target ? <p className="mt-2 break-words text-xs text-brand">→ {target}의 주소</p> : null}
                      {value === "NULL" ? <p className="mt-2 text-xs text-muted-foreground">다음 대상 없음</p> : null}
                    </div>
                  );
                })}
              </dl>
            ) : null}
          </div>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="true" className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-y border-border py-3">
          <code className="min-w-0 text-sm [overflow-wrap:anywhere]">{step.expression}</code>
          <span aria-hidden="true">→</span>
          <strong className={`break-words font-mono text-lg ${step.resultKind === "컴파일 오류" ? "text-destructive" : "text-brand"}`}>{step.result}</strong>
          <span className="text-xs text-muted-foreground">{step.resultKind}</span>
        </div>
        <p className="text-sm leading-7">{step.explanation}</p>
      </div>
    </section>
  );
}
