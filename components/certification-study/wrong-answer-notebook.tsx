"use client";

import type { ExamAttempt, WrongAnswer, WrongReason } from "@/lib/certifications/information-processing-engineer/types";
import { examSessions } from "@/lib/certifications/information-processing-engineer/question-bank";

const reasonLabels = {
  "concept-unknown": "개념을 몰랐음",
  "code-trace-error": "코드 추적 실수",
  "calculation-error": "계산 실수",
  "misread-question": "문제 오독",
  "answer-format-error": "답안 형식",
  guessed: "찍음",
};

const reasonOptions = Object.entries(reasonLabels) as Array<[WrongReason, string]>;

export function WrongAnswerNotebook({ wrongAnswers, examAttempts, onOpenQuestion, onUpdate }: {
  wrongAnswers: WrongAnswer[];
  examAttempts: ExamAttempt[];
  onOpenQuestion: (questionId: string) => void;
  onUpdate: (questionId: string, updates: Pick<WrongAnswer, "reason" | "memoryRule" | "memo">) => void;
}) {
  if (wrongAnswers.length === 0) return <p className="rounded border border-dashed border-border p-5 text-sm text-muted-foreground">아직 저장된 오답이 없습니다. 기출을 풀면 자동으로 쌓입니다.</p>;

  return <section className="space-y-3" aria-label="오답노트">
    {wrongAnswers.map((wrongAnswer) => {
      const question = examSessions.flatMap((session) => session.questions).find((entry) => entry.id === wrongAnswer.questionId);
      const submittedAnswer = examAttempts.filter((attempt) => attempt.submittedAt && Object.hasOwn(attempt.answers, wrongAnswer.questionId)).at(-1)?.answers[wrongAnswer.questionId];
      return (
      <article key={wrongAnswer.questionId} className="rounded border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><strong className="font-mono text-sm">{wrongAnswer.questionId}</strong><span className="text-xs text-muted-foreground">{wrongAnswer.attempts}회 오답 · 다음 복습 {new Date(wrongAnswer.nextReviewAt).toLocaleDateString("ko-KR")}</span></div>
        {question ? <div className="mt-3 text-sm leading-7">
          <p className="font-semibold">{question.tags.join(" / ")}</p>
          <p className="mt-2 whitespace-pre-wrap">{question.prompt}</p>
          <dl className="mt-3 grid gap-2 border-l-2 border-brand pl-3">
            <div><dt className="text-xs text-muted-foreground">최근 제출한 내 답</dt><dd className="whitespace-pre-wrap">{submittedAnswer ?? "이전 기록에 답안이 없습니다."}{submittedAnswer === "" ? "(미응답)" : ""}</dd></div>
            <div><dt className="text-xs text-muted-foreground">복원 정답</dt><dd className="whitespace-pre-wrap">{question.answer}</dd></div>
          </dl>
          <button type="button" onClick={() => onOpenQuestion(question.id)} className="mt-3 min-h-11 rounded border border-border px-3 text-sm">전체 문제와 코드 보기</button>
        </div> : <p className="mt-3 text-sm text-muted-foreground">이 문항은 현재 기출 목록에 없습니다. 기존 메모와 규칙은 보존되어 있습니다.</p>}
        <label className="mt-3 block text-xs text-muted-foreground">틀린 이유
          <select value={wrongAnswer.reason} onChange={(event) => onUpdate(wrongAnswer.questionId, { reason: event.target.value as WrongReason, memoryRule: wrongAnswer.memoryRule, memo: wrongAnswer.memo })} className="mt-1 block min-h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground">
            {reasonOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-xs text-muted-foreground">다시 기억할 규칙
          <textarea value={wrongAnswer.memoryRule} onChange={(event) => onUpdate(wrongAnswer.questionId, { reason: wrongAnswer.reason, memoryRule: event.target.value, memo: wrongAnswer.memo })} className="mt-1 min-h-20 w-full rounded border border-border bg-background p-3 text-sm leading-6 text-foreground" />
        </label>
        <label className="mt-3 block text-xs text-muted-foreground">내 메모 (선택)
          <input value={wrongAnswer.memo ?? ""} onChange={(event) => onUpdate(wrongAnswer.questionId, { reason: wrongAnswer.reason, memoryRule: wrongAnswer.memoryRule, memo: event.target.value })} className="mt-1 min-h-10 w-full rounded border border-border bg-background px-3 text-sm text-foreground" placeholder="예: 포인터 이동은 자료형 크기 단위" />
        </label>
      </article>
    );})}
  </section>
}
