"use client";

import { useState } from "react";
import type { WrongAnswer } from "@/lib/certifications/information-processing-engineer/types";
import { examSessions } from "@/lib/certifications/information-processing-engineer/question-bank";

export function FlashcardDeck({ wrongAnswers, onReview, onOpenQuestion }: {
  wrongAnswers: WrongAnswer[];
  onReview: (questionId: string, remembered: boolean) => void;
  onOpenQuestion: (questionId: string) => void;
}) {
  const [allCards, setAllCards] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [showRule, setShowRule] = useState(false);
  const [message, setMessage] = useState("");
  const cards = wrongAnswers.filter((wrong) => allCards || Date.parse(wrong.nextReviewAt) <= Date.now());
  const index = Math.max(0, cards.findIndex((card) => card.questionId === questionId));
  const card = cards[index];
  const question = examSessions.flatMap((session) => session.questions).find((entry) => entry.id === card?.questionId);

  function move(direction: number) {
    setShowRule(false);
    setQuestionId(cards[(index + direction + cards.length) % cards.length]?.questionId ?? null);
  }

  function recordReview(remembered: boolean) {
    if (!card) return;
    onReview(card.questionId, remembered);
    setQuestionId(cards[(index + 1) % cards.length]?.questionId ?? null);
    setShowRule(false);
    setMessage(remembered ? "기억함을 기록했습니다. 다음 복습일을 늦췄습니다." : "다시 복습을 기록했습니다. 내일 다시 확인하세요.");
  }

  return <section className="max-w-xl" aria-label="암기카드">
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => { setAllCards((current) => !current); setQuestionId(null); setShowRule(false); }} className="min-h-11 rounded border border-border px-3 text-sm">{allCards ? "오늘 복습만 보기" : "전체 오답 보기"}</button>
      <p className="text-sm text-muted-foreground">{allCards ? "전체" : "오늘 복습"} {cards.length}개</p>
    </div>
    {message ? <p role="status" className="mb-3 text-sm text-muted-foreground">{message}</p> : null}
    {!card ? <p className="rounded border border-dashed border-border p-5 text-sm text-muted-foreground">오늘 복습할 카드가 없습니다. 전체 오답은 위 버튼으로 확인할 수 있어요.</p> : <>
      <button type="button" onClick={() => setShowRule((current) => !current)} className="min-h-56 w-full rounded border border-brand/30 bg-brand/5 p-6 text-left">
        <p className="font-mono text-xs text-brand">{showRule ? "MEMORY RULE" : "QUESTION"}</p>
        <p className="mt-5 whitespace-pre-wrap text-lg font-semibold leading-8">{showRule ? card.memoryRule : question?.tags.join(" / ") || card.questionId}</p>
        {!showRule ? <p className="mt-3 text-sm leading-7 text-muted-foreground">기억 규칙을 먼저 떠올린 뒤 뒤집어 확인하세요.</p> : null}
        <p className="mt-5 text-sm text-muted-foreground">눌러서 {showRule ? "키워드" : "기억 규칙"} 보기</p>
      </button>
      <p className="mt-3 text-xs text-muted-foreground">{card.questionId} · 복습 기록 {card.reviews?.length ?? 0}회 · 다음 복습 {new Date(card.nextReviewAt).toLocaleDateString("ko-KR")}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" className="min-h-11 rounded border border-border px-3 text-sm" onClick={() => move(-1)}>이전</button>
        <button type="button" className="min-h-11 rounded border border-border px-3 text-sm" onClick={() => move(1)}>다음</button>
        <button type="button" onClick={() => onOpenQuestion(card.questionId)} className="min-h-11 rounded border border-border px-3 text-sm">원래 문제 보기</button>
      </div>
      {showRule ? <div className="mt-3 flex gap-3">
        <button type="button" onClick={() => recordReview(false)} className="min-h-11 rounded border border-border px-4 text-sm">다시 복습</button>
        <button type="button" onClick={() => recordReview(true)} className="min-h-11 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground">기억함</button>
      </div> : null}
    </>}
  </section>;
}
