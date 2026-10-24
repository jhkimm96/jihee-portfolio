"use client";

import { useState } from "react";
import Image from "next/image";
import { cramBlocks } from "@/lib/certifications/information-processing-engineer/cram-plan";
import { studyConcepts } from "@/lib/certifications/information-processing-engineer/concepts";
import { examSessions } from "@/lib/certifications/information-processing-engineer/question-bank";
import type { ExamQuestion, ProgrammingAttempt } from "@/lib/certifications/information-processing-engineer/types";
import { gradeAnswer } from "@/lib/certifications/study-grading";

const linkStyle = "inline-flex min-h-11 items-center rounded border border-border px-3 py-2 text-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";

export function CramPlanPanel({ blockId, questionId, attempts, onSubmit }: {
  blockId: string; questionId: string | null; attempts: ProgrammingAttempt[];
  onSubmit: (question: ExamQuestion, answer: string) => void;
}) {
  const block = cramBlocks.find((entry) => entry.id === blockId) ?? cramBlocks[0];
  const session = examSessions.find((entry) => entry.questions.some((question) => question.id === questionId));
  const question = session?.questions.find((entry) => entry.id === questionId);
  const blockIndex = cramBlocks.indexOf(block);
  const startMinutes = cramBlocks.slice(0, blockIndex).reduce((sum, entry) => sum + entry.minutes, 0);
  const clock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const answeredCount = block.questionIds.filter((id) => attempts.some((attempt) => attempt.questionId === id)).length;

  return <section aria-labelledby="cram-title" className="space-y-5">
    <header className="rounded border border-brand/30 bg-brand/5 p-5">
      <p className="font-mono text-xs text-brand">720 MIN / 합격선 60 · 연습 목표 70</p>
      <h2 id="cram-title" className="mt-2 text-2xl font-semibold">12시간 벼락치기</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">개념 → 지정 기출 → 틀린 이유 한 줄 → 답을 가리고 재풀이. 순공 시간이며 휴식·식사는 별도입니다. 수면과 이동 시간을 확보하세요. 합격을 보장하는 플랜은 아닙니다.</p>
      <p className="mt-2 text-sm leading-7">개별 풀이는 직접 제출한 답만 기록합니다. 빈칸이나 열어본 문제는 오답이 되지 않습니다. 기록은 이 브라우저에 저장되며 기기를 옮길 때 JSON 백업이 필요합니다.</p>
    </header>
    <nav aria-label="12시간 학습 구간" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {cramBlocks.map((entry, index) => <a key={entry.id} href={`#cram/${entry.id}`} aria-current={entry.id === block.id ? "step" : undefined} className={`${linkStyle} ${entry.id === block.id ? "border-brand bg-brand/10 font-semibold" : ""}`}>{index + 1}. {entry.title} · {entry.minutes}분</a>)}
    </nav>
    <article id="cram-block" className="scroll-mt-24 rounded border border-border p-5">
      <p className="font-mono text-sm text-brand">{clock(startMinutes)}–{clock(startMinutes + block.minutes)} · {block.minutes}분</p>
      <h3 className="mt-2 text-xl font-semibold">{block.title}</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7">{block.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
      {block.conceptIds.length ? <><h4 className="mt-5 font-semibold">1. 필요한 개념만 열기</h4><div className="mt-3 flex flex-wrap gap-2">{block.conceptIds.map((id) => <a className={linkStyle} key={id} href={`#cram/${block.id}/concept/${id}`}>{studyConcepts.find((concept) => concept.id === id)?.title}</a>)}</div></> : null}
      {block.questionIds.length ? <><h4 className="mt-5 font-semibold">지정 기출 · 제출 기록 {answeredCount}/{block.questionIds.length}</h4><p className="mt-2 text-xs leading-6 text-muted-foreground">누르면 아래에 문제가 열립니다. 채점 전까지 정답은 숨깁니다. 아직 제출하지 않은 입력은 화면을 떠나면 사라질 수 있습니다.</p><div className="mt-3 flex flex-wrap gap-2">{block.questionIds.map((id) => {
        const last = attempts.filter((attempt) => attempt.questionId === id).at(-1);
        return <a key={id} href={`#cram/${block.id}/question/${id}`} className={linkStyle} aria-current={id === questionId ? "true" : undefined}>{id} {last ? last.correct ? "· 최근 정답" : "· 재풀이 필요" : "· 미제출"}</a>;
      })}</div></> : null}
      {block.id === "mock" ? <a href="#cram/mock/exam/2026-2" className={`${linkStyle} mt-4`}>2026년 2회 전체 풀기 →</a> : null}
      <div className="mt-5 flex flex-wrap gap-2"><a href={`#cram/${block.id}/wrong`} className={linkStyle}>오답노트 열기</a>{blockIndex < cramBlocks.length - 1 ? <a href={`#cram/${cramBlocks[blockIndex + 1].id}`} className={linkStyle}>다음 구간 →</a> : null}</div>
    </article>
    {question && session ? <CramQuestion key={question.id} question={question} sourceUrl={session.sourceUrl} sourceLabel={session.label} onSubmit={onSubmit} /> : null}
  </section>;
}

function CramQuestion({ question, sourceUrl, sourceLabel, onSubmit }: {
  question: ExamQuestion; sourceUrl: string; sourceLabel: string;
  onSubmit: (question: ExamQuestion, answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const result = submittedAnswer === null ? null : gradeAnswer({ submittedAnswer, gradingMode: question.gradingMode, acceptedAnswers: question.acceptedAnswers, subnetChecks: question.subnetChecks });

  return <article id="cram-question" className="scroll-mt-24 rounded border border-border bg-card p-5" aria-label="기출 개별 풀이">
    <h3 className="text-lg font-semibold">{sourceLabel} · {question.id.split("-").at(-1)}번</h3>
    <a className="mt-2 inline-flex min-h-11 items-center text-sm text-brand underline" href={sourceUrl} target="_blank" rel="noreferrer">블로그 복원 원문 확인 ↗</a>
    <p className="text-xs leading-6 text-muted-foreground">복원 문제 기준 채점이며 공식 확정 정답이 아닙니다. 출처: chobopark · CC BY 4.0 · 해설 및 자동채점 별도 작성.</p>
    <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{question.prompt}</p>
    {question.figures?.map((figure) => <figure key={figure.src} className="mt-4 overflow-x-auto rounded bg-white p-3"><a href={figure.src} target="_blank" rel="noreferrer"><Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} className="h-auto max-w-full" /></a><figcaption className="text-xs text-gray-700">{figure.alt} · 누르면 크게 보기</figcaption></figure>)}
    {question.tables?.map((table) => <div key={table.title} className="mt-4 overflow-x-auto"><table className="w-full border-collapse text-sm"><caption className="mb-2 text-left">{table.title}</caption><thead><tr>{table.columns.map((column, index) => <th key={index} scope="col" className="border border-border p-2 text-left">{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td className="border border-border p-2" key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>)}
    {question.code ? <pre className="mt-4 overflow-x-auto rounded bg-muted/40 p-4 text-sm leading-6"><code>{question.code}</code></pre> : null}
    <form className="mt-5" onSubmit={(event) => { event.preventDefault(); if (!answer.trim() || result) return; onSubmit(question, answer); setSubmittedAnswer(answer); }}>
      <label htmlFor="cram-answer" className="text-sm font-semibold">내 답 (모르면 ‘모름’ 입력)</label>
      <textarea id="cram-answer" value={answer} disabled={Boolean(result)} onChange={(event) => setAnswer(event.target.value)} className="mt-2 min-h-28 w-full rounded border border-border bg-background p-3 text-sm" />
      <p className="mt-1 text-xs leading-6 text-muted-foreground">코드 출력은 공백과 줄바꿈도 채점합니다. 제출 시 이 문제만 기록하며, 기존 모의고사 답안은 바꾸지 않습니다.</p>
      {result ? <div className="mt-4 border-t border-border pt-4" role="status"><p className="font-semibold">{result.correct ? "정답 · 제출 기록 저장됨" : "오답 · 오답노트에 저장됨"}</p><p className="mt-3 whitespace-pre-wrap text-sm">정답: {question.answer}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{question.explanation}</p>{question.verificationNote ? <p className="mt-3 text-sm leading-7">복원 주의: {question.verificationNote}</p> : null}<button type="button" className={`${linkStyle} mt-4`} onClick={() => { setAnswer(""); setSubmittedAnswer(null); }}>정답 가리고 다시 풀기</button></div> : <button type="submit" disabled={!answer.trim()} className="mt-4 min-h-11 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40">이 문제만 제출하고 채점</button>}
    </form>
  </article>;
}
