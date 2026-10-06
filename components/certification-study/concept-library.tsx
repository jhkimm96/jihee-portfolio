"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, ExternalLink, Search } from "lucide-react";
import { studyConcepts, type StudyConcept } from "@/lib/certifications/information-processing-engineer/concepts";

const categories = [...new Set(studyConcepts.map((concept) => concept.category))];

export function ConceptLibrary({ onOpenQuestion }: { onOpenQuestion: (questionId: string) => void }) {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("전체");
  const [pass, setPass] = useState(1);
  const normalizedQuery = query.trim().toLocaleLowerCase("ko");
  const visibleConcepts = studyConcepts.filter((concept) => {
    if (category !== "전체" && concept.category !== category) return false;
    if (level !== "전체" && concept.level !== level) return false;
    return [concept.title, concept.definition, concept.trap, concept.memoryRule].join(" ").toLocaleLowerCase("ko").includes(normalizedQuery);
  });

  return (
    <section aria-labelledby="concept-title">
      <p className="font-mono text-xs text-brand">CONCEPTS / {studyConcepts.length} TOPICS</p>
      <h2 id="concept-title" className="mt-2 text-2xl font-semibold">읽고, 추적하고, 내 말로 설명하기</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">처음에는 필수 규칙과 예제를 읽고, 두 번째에는 풀이 순서와 함정을 확인하세요. 마지막에는 답을 가리고 기억 규칙을 설명한 뒤 연결 기출을 풀어봅니다.</p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="개념 학습 회독">
        {["1회독 · 핵심 이해", "2회독 · 풀이와 함정", "3회독 · 기억 점검"].map((label, index) => (
          <button key={label} type="button" onClick={() => setPass(index + 1)} aria-pressed={pass === index + 1} className={`min-h-11 rounded border px-3 text-sm transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand ${pass === index + 1 ? "border-brand bg-brand/5 text-brand" : "border-border"}`}>{label}</button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
        <label className="flex min-h-11 items-center gap-2 rounded border border-border bg-background px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">개념 검색</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이중 포인터, NULL, 서브넷…" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
        </label>
        <label className="sr-only" htmlFor="concept-level">개념 난이도</label>
        <select id="concept-level" value={level} onChange={(event) => setLevel(event.target.value)} className="min-h-11 rounded border border-border bg-background px-3 text-sm">
          <option value="전체">모든 난이도</option><option value="필수">필수 먼저</option><option value="심화">심화 집중</option><option value="보충">보충</option>
        </select>
      </div>
      <nav className="mt-3 flex flex-wrap gap-2" aria-label="개념 분야">
        {["전체", ...categories].map((name) => <button key={name} type="button" onClick={() => setCategory(name)} aria-pressed={category === name} className={`min-h-11 rounded border px-3 text-sm transition-colors hover:border-brand ${category === name ? "border-brand bg-brand/5 text-brand" : "border-border"}`}>{name}</button>)}
      </nav>
      <p className="mt-4 text-xs text-muted-foreground" role="status">{visibleConcepts.length}개 개념</p>

      <div className="mt-3 space-y-3">
        {visibleConcepts.map((concept) => <ConceptCard key={`${concept.id}-${pass}`} concept={concept} pass={pass} onOpenQuestion={onOpenQuestion} />)}
        {visibleConcepts.length === 0 ? <p className="rounded border border-dashed border-border p-5 text-sm text-muted-foreground">검색 결과가 없습니다. 다른 분야나 단어로 찾아보세요.</p> : null}
      </div>
    </section>
  );
}

function ConceptCard({ concept, pass, onOpenQuestion }: { concept: StudyConcept; pass: number; onOpenQuestion: (questionId: string) => void }) {
  return (
    <details id={`concept-${concept.id}`} className="group scroll-mt-24 rounded border border-border bg-card">
      <summary className="min-h-16 cursor-pointer px-4 py-4 focus-visible:outline-2 focus-visible:outline-brand sm:px-5">
        <span className="ml-1 text-base font-semibold">{concept.title}</span>
        <span className="ml-3 inline-block text-xs text-muted-foreground">{concept.category} / Day {concept.day} / {concept.level}</span>
      </summary>
      <div className="space-y-5 border-t border-border px-4 py-5 sm:px-5">
        {pass !== 3 ? <p className="max-w-3xl text-base leading-7">{concept.definition}</p> : null}
        {pass === 2 ? (
          <>
            <div><h3 className="text-sm font-semibold">풀이 순서</h3><ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6">{concept.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
            <div className="border-l-2 border-brand pl-3"><h3 className="text-sm font-semibold">자주 틀리는 지점</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{concept.trap}</p></div>
          </>
        ) : null}
        {pass !== 3 ? <div><h3 className="text-sm font-semibold">직접 추적할 예제</h3><pre className="mt-2 max-w-full overflow-x-auto rounded border border-border bg-muted/40 p-4 text-sm leading-7"><code>{concept.example}</code></pre><p className="mt-3 text-sm leading-7 text-muted-foreground">{concept.explanation}</p></div> : null}
        <div><h3 className="text-sm font-semibold">스스로 확인</h3><p className="mt-2 text-sm leading-7">{concept.selfCheck}</p><details className="mt-2"><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-brand">답 확인</summary><p className="text-sm leading-7">{concept.selfCheckAnswer}</p></details></div>
        <details open={pass !== 3} className="rounded bg-brand/5 px-3 py-2"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-brand">다시 기억할 규칙</summary><p className="pb-2 text-sm leading-7">{concept.memoryRule}</p></details>

        {concept.relatedQuestionIds.length > 0 ? <div><h3 className="text-sm font-semibold">연결 기출</h3><div className="mt-2 flex flex-wrap gap-2">{concept.relatedQuestionIds.map((questionId) => <button key={questionId} type="button" onClick={() => onOpenQuestion(questionId)} className="inline-flex min-h-11 items-center gap-2 rounded border border-border px-3 text-sm hover:border-brand">{questionId}<ArrowRight aria-hidden="true" className="size-3.5" /></button>)}</div></div> : null}
        <div className="border-t border-border pt-3 text-xs leading-6 text-muted-foreground">
          <p className="flex items-center gap-2"><BookOpen aria-hidden="true" className="size-3.5" />내 학습 자료: {concept.pdfReferences.join(", ")}</p>
          {concept.officialUrl ? <a href={concept.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1 text-brand underline underline-offset-4">공식 문서 확인<ExternalLink aria-hidden="true" className="size-3.5" /></a> : null}
          <p>예제는 개념 확인용으로 작성한 연습 코드입니다.</p>
        </div>
      </div>
    </details>
  );
}
