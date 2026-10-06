"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, ExternalLink, Send } from "lucide-react";
import Image from "next/image";

import { gradeAnswer } from "@/lib/certifications/study-grading";
import type { ExamSession, ExamAttempt } from "@/lib/certifications/information-processing-engineer/types";
import { getRemainingSeconds } from "@/lib/certifications/study-progress";

type ExamWorkspaceProps = {
  session: ExamSession;
  savedAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  targetQuestionId?: string | null;
  attempt?: ExamAttempt;
  onStart: (mode: ExamAttempt["mode"]) => void;
  onSubmit: () => void;
};

export function ExamWorkspace({
  session,
  savedAnswers,
  onAnswerChange,
  attempt,
  onStart,
  onSubmit,
  targetQuestionId,
}: ExamWorkspaceProps) {
  const [now, setNow] = useState(() => Date.now());
  const submitted = Boolean(attempt?.submittedAt);
  const answers = submitted ? attempt!.answers : savedAnswers;
  const remainingSeconds = attempt ? getRemainingSeconds(attempt, now) : 150 * 60;

  useEffect(() => {
    if (!targetQuestionId) return;
    document.getElementById(`exam-${targetQuestionId}`)?.scrollIntoView({ block: "start" });
  }, [targetQuestionId]);

  const results = useMemo(
    () =>
      session.questions.map((question) => ({
        question,
        grade: gradeAnswer({
          submittedAnswer: answers[question.id] ?? "",
          gradingMode: question.gradingMode,
          acceptedAnswers: question.acceptedAnswers,
          subnetChecks: question.subnetChecks,
        }),
      })),
    [answers, session.questions],
  );
  const correctCount = results.filter((result) => result.grade.correct).length;
  const score = attempt?.score ?? correctCount * 5;
  const timeLabel = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(
    remainingSeconds % 60,
  ).padStart(2, "0")}`;

  useEffect(() => {
    if (!attempt || submitted || attempt.mode === "practice") return;
    setNow(Date.now());
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, submitted]);

  return (
    <section aria-labelledby="exam-title" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">Recovered exam</p>
          <h2 id="exam-title" className="mt-2 text-2xl font-semibold tracking-tight">{session.label}</h2>
          <a href={session.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-brand underline underline-offset-4">
            원문 복원 기록 보기 <ExternalLink className="size-3.5" />
          </a>
          {session.sourceAuthor ? <p className="mt-2 text-xs leading-6 text-muted-foreground">복원 출처: {session.sourceAuthor} · {session.sourceCheckedAt} 대조 · <a href={session.sourceLicenseUrl} target="_blank" rel="noreferrer" className="underline">CC BY 4.0</a><br />본문·코드의 표시 형식을 정리하고 표를 다시 그렸습니다. 해설과 자동채점은 별도로 작성했습니다.</p> : null}
        </div>
        <div className="flex items-center gap-2 rounded border border-border px-3 py-2 font-mono text-sm">
          <Clock3 className="size-4 text-brand" /> {submitted ? "제출 완료" : attempt?.mode === "practice" ? "시간 제한 없음" : timeLabel}
        </div>
      </div>

      {!attempt || submitted ? <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => onStart("mock")} className="min-h-11 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground">{submitted ? "150분 모의고사 다시 풀기" : "150분 모의고사 시작"}</button>
        <button type="button" onClick={() => onStart("practice")} className="min-h-11 rounded border border-border px-4 text-sm">시간 제한 없이 연습{ submitted ? " 다시 시작" : " 시작"}</button>
        <p className="w-full text-xs leading-6 text-muted-foreground">시작 시 이번 답안 칸은 비워집니다. 이전 점수와 오답은 유지됩니다. 모의고사는 화면을 닫아도 시간이 흐르며, 종료 후 페이지를 열면 자동 채점됩니다.</p>
      </div> : null}

      {session.contentStatus === "practice-draft" ? <p className="rounded border border-border bg-muted/40 p-4 text-sm leading-7">이 회차의 현재 문항은 주제별 연습 초안입니다. 실제 복원문제와 문항 순서가 다르므로 진단 점수에 사용하지 마세요. 위 원문 링크에서 실제 2026년 2회 문제를 확인할 수 있습니다.</p> : null}

      {submitted ? (
        <p className="rounded border border-brand/30 bg-brand/5 px-4 py-3 text-sm">
          {score / 5}/20 정답 · 복원 기준 {score}점. 틀린 문항은 오답노트와 암기카드에 저장되었습니다.
        </p>
      ) : null}

      <ol className="space-y-4">
        {results.map(({ question, grade }, index) => (
          <li key={question.id} id={`exam-${question.id}`} className="scroll-mt-24 rounded border border-border bg-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")} / 20</p>
              <div className="flex flex-wrap justify-end gap-1">
                {question.tags.map((tag) => <span key={tag} className="rounded border border-border px-1.5 py-0.5 text-[0.68rem] text-muted-foreground">{tag}</span>)}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{question.prompt}</p>
            {question.figures?.map((figure) => <figure key={figure.src} className="mt-4 overflow-x-auto rounded border border-border bg-white p-3"><a href={figure.src} target="_blank" rel="noreferrer" aria-label={`${figure.alt} 크게 보기`}><Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} className="h-auto max-w-full" /></a><figcaption className="mt-2 text-xs text-gray-700">원문 입력 자료 · 누르면 크게 볼 수 있습니다.</figcaption></figure>)}
            {question.tables?.map((table) => <div key={table.title} className="mt-4 max-w-full overflow-x-auto"><table className="w-full border-collapse text-sm"><caption className="mb-2 text-left font-semibold">{table.title}</caption><thead><tr>{table.columns.map((column) => <th key={column} scope="col" className="border border-border bg-muted/40 px-3 py-2 text-left">{column}</th>)}</tr></thead><tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-border px-3 py-2">{cell}</td>)}</tr>)}</tbody></table></div>)}
            {question.code ? <pre className="mt-4 max-w-full overflow-x-auto rounded border border-border bg-muted/40 p-4 text-sm leading-6"><code>{question.code}</code></pre> : null}
            {question.verificationNote ? <p className="mt-3 border-l-2 border-brand pl-3 text-xs leading-6 text-muted-foreground">복원 확인 사항: {question.verificationNote}</p> : null}
            <label className="mt-4 block text-xs font-medium text-muted-foreground" htmlFor={question.id}>답안</label>
            <textarea
              id={question.id}
              value={answers[question.id] ?? ""}
              disabled={!attempt || submitted || (attempt.mode === "mock" && remainingSeconds === 0)}
              onChange={(event) => onAnswerChange(question.id, event.target.value)}
              className="mt-1 min-h-20 w-full rounded border border-border bg-background p-3 text-sm outline-none focus:border-brand disabled:opacity-70"
              placeholder="답을 직접 입력하세요"
            />
            {submitted ? (
              <div className="mt-4 border-t border-border pt-4 text-sm">
                <p className={grade.correct ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>{grade.correct ? "정답" : `오답 · 정답: ${question.answer}`}</p>
                <p className="mt-2 leading-6 text-muted-foreground">{question.explanation}</p>
                {!grade.correct ? <p className="mt-3 text-xs text-muted-foreground">오답노트에서 틀린 이유와 메모를 바꾸고, 기억 규칙도 다듬어 주세요.</p> : null}
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {attempt && !submitted ? <button type="button" onClick={onSubmit} className="inline-flex min-h-11 items-center gap-2 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground"><Send className="size-4" />제출하고 자동 채점</button> : null}
    </section>
  );
}
