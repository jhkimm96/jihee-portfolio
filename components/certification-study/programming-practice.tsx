"use client";

import React, { useId, useState } from "react";
import type { ProgrammingAttempt } from "../../lib/certifications/information-processing-engineer/types";
import type { ProgrammingQuestion } from "../../lib/certifications/information-processing-engineer/programming-practice";
import { gradeAnswer } from "../../lib/certifications/study-grading";

export function ProgrammingPractice({ questions, attempts, onSubmit, targetQuestionId }: {
  questions: ProgrammingQuestion[]; attempts: ProgrammingAttempt[];
  onSubmit: (question: ProgrammingQuestion, answer: string) => void; targetQuestionId?: string | null;
}) {
  const fieldId = useId();
  const [questionId, setQuestionId] = useState(targetQuestionId ?? questions[0]?.id);
  const [wrongOnly, setWrongOnly] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const latestAttempts = new Map(attempts.map((attempt) => [attempt.questionId, attempt]));
  const visible = wrongOnly ? questions.filter((question) => latestAttempts.get(question.id)?.correct === false) : questions;
  const question = visible.find((entry) => entry.id === questionId) ?? visible[0];

  function selectQuestion(id: string) {
    setQuestionId(id); setAnswer(""); setResult(null);
  }

  return <section aria-label="자체 제작 변형 연습" className="min-w-0 space-y-4 border-t border-border pt-5">
    <h3 className="font-semibold">출력 예측 · 자체 제작 연습</h3>
    <p className="text-xs leading-6 text-muted-foreground">실제 기출이 아닌 개념 연습입니다. {questions.length}문제 · 최근 정답 {questions.filter((entry) => latestAttempts.get(entry.id)?.correct).length}개. 기록은 이 브라우저와 JSON 백업에 저장됩니다.</p>
    <button type="button" aria-pressed={wrongOnly} onClick={() => { setWrongOnly(!wrongOnly); selectQuestion(""); }} className="min-h-11 rounded border border-border px-3 text-sm">{wrongOnly ? "전체 문제 보기" : "최근에 틀린 문제만 재시험"}</button>
    {!question ? <p role="status" className="text-sm">최근에 틀린 문제가 없습니다. 전체 문제에서 먼저 풀어보세요.</p> : <>
      <label className="block text-sm">연습 문제 선택<select aria-label="연습 문제 선택" value={question.id} onChange={(event) => selectQuestion(event.target.value)} className="mt-2 block min-h-11 w-full min-w-0 rounded border border-border bg-background px-2">{visible.map((entry) => <option key={entry.id} value={entry.id}>{entry.prompt}</option>)}</select></label>
      <pre className="max-w-full overflow-x-auto rounded border border-border bg-muted/30 p-3 text-sm leading-7"><code>{question.code}</code></pre>
      <form onSubmit={(event) => {
        event.preventDefault();
        const { correct } = gradeAnswer({ submittedAnswer: answer, gradingMode: question.gradingMode, acceptedAnswers: question.acceptedAnswers });
        setQuestionId(question.id); onSubmit(question, answer); setResult(correct);
        // 오답만 보기에서 정답을 맞혀도 해설을 읽을 때까지 현재 문제를 유지한다.
        if (wrongOnly && correct) setWrongOnly(false);
      }} className="space-y-3">
        <label htmlFor={fieldId} className="block text-sm font-medium">예상 출력</label>
        <p id={`${fieldId}-help`} className="text-xs leading-6 text-muted-foreground">출력 바깥을 따옴표로 감싸지 마세요. 리스트·문자열 표현 안의 따옴표, 공백, 대소문자, 줄바꿈은 그대로 입력하고 맨 끝의 자동 개행만 생략하세요.</p>
        <textarea id={fieldId} aria-describedby={`${fieldId}-help`} value={answer} onChange={(event) => { setAnswer(event.target.value); setResult(null); }} spellCheck={false} className="min-h-24 w-full rounded border border-border bg-background p-3 font-mono text-sm" />
        <button type="submit" className="min-h-11 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground">제출하고 채점</button>
      </form>
      {result !== null ? <div role="status" className="space-y-3 border-l-2 border-brand pl-3">
        <p className="font-semibold">{result ? "정답입니다. 기록했어요." : "다시 확인해 보세요. 오답노트에 기록했어요."}</p>
        <p className="text-xs text-muted-foreground">정답 출력</p><pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm">{question.answer}</pre>
        <p className="whitespace-pre-wrap text-sm leading-7">{question.explanation}</p>
      </div> : null}
      <details><summary className="min-h-11 cursor-pointer py-2 text-sm text-brand">제출하지 않고 해설 보기</summary><pre className="overflow-x-auto whitespace-pre-wrap text-sm">{question.answer}</pre><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{question.explanation}</p></details>
    </>}
  </section>;
}
