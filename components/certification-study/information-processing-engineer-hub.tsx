"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Download, Eye, Focus, Upload } from "lucide-react";

import { ExamWorkspace } from "@/components/certification-study/exam-workspace";
import { FlashcardDeck } from "@/components/certification-study/flashcard-deck";
import { WrongAnswerNotebook } from "@/components/certification-study/wrong-answer-notebook";
import { ConceptLibrary } from "@/components/certification-study/concept-library";
import { studyDays, flexDays, studyResourceGroups } from "@/lib/certifications/information-processing-engineer/curriculum";
import { examSessions } from "@/lib/certifications/information-processing-engineer/question-bank";
import type { StudyProgress, ExamAttempt } from "@/lib/certifications/information-processing-engineer/types";
import { createBackup, createEmptyProgress, restoreBackup, updateWrongAnswer, startExam, submitExam, getRemainingSeconds, reviewWrongAnswer } from "@/lib/certifications/study-progress";

const storageKey = "jh-work:information-processing-engineer:progress:v1";
const tabs = [
  ["today", "오늘 학습"],
  ["plan", "10일 플랜"],
  ["concepts", "개념"],
  ["exams", "기출"],
  ["wrong", "오답"],
  ["cards", "암기카드"],
  ["library", "자료실"],
] as const;

export function InformationProcessingEngineerHub() {
  const [progress, setProgress] = useState<StudyProgress>(createEmptyProgress);
  const [activeTab, setActiveTab] = useState("today");
  const [sessionId, setSessionId] = useState(examSessions.at(-1)?.id ?? "2026-2");
  const [focusMode, setFocusMode] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProgress = window.localStorage.getItem(storageKey);
      if (savedProgress) {
        const restored = restoreBackup(JSON.parse(savedProgress));
        setProgress(restored);
        setActiveTab(restored.activeTab);
        setSessionId(restored.activeSessionId ?? "2026-2");
      }
    } catch {
      setBackupMessage("저장된 기록을 읽지 못했습니다. 기존 데이터는 보존했습니다. JSON 백업으로 복원할 수 있어요.");
      return;
    }
    setRecordsLoaded(true);
  }, []);

  useEffect(() => {
    if (!recordsLoaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(createBackup({ ...progress, activeTab })));
    } catch {
      setBackupMessage("브라우저 저장에 실패했습니다. 현재 기록을 JSON으로 백업해 주세요.");
    }
  }, [activeTab, progress, recordsLoaded]);

  useEffect(() => {
    if (!recordsLoaded) return;
    function submitExpiredExams() {
      const now = Date.now();
      setProgress((current) => {
        let updated = current;
        for (const attempt of current.examAttempts) {
          if (attempt.submittedAt || attempt.mode !== "mock" || getRemainingSeconds(attempt, now) > 0) continue;
          const session = examSessions.find((entry) => entry.id === attempt.sessionId);
          if (session) updated = submitExam(updated, session, new Date(now).toISOString());
        }
        return updated;
      });
    }
    submitExpiredExams();
    const timer = window.setInterval(submitExpiredExams, 1000);
    return () => window.clearInterval(timer);
  }, [recordsLoaded]);

  useEffect(() => {
    document.body.classList.toggle("study-focus", focusMode);
    return () => document.body.classList.remove("study-focus");
  }, [focusMode]);

  const activeSession = useMemo(
    () => examSessions.find((session) => session.id === sessionId) ?? examSessions.at(-1)!,
    [sessionId],
  );
  const nextDay = studyDays.find(([day]) => Number(day.replace("일", "")) === progress.currentDay) ?? studyDays[0];

  function changeTab(tab: string) {
    setActiveTab(tab);
    setMoreMenuOpen(false);
  }

  function openConceptQuestion(questionId: string) {
    const session = examSessions.find((entry) => entry.questions.some((question) => question.id === questionId));
    if (!session) return;
    setSessionId(session.id);
    setProgress((current) => ({ ...current, activeSessionId: session.id }));
    setTargetQuestionId(questionId);
    changeTab("exams");
  }

  function beginExam(mode: ExamAttempt["mode"]) {
    setProgress((current) => startExam(current, activeSession, new Date().toISOString(), mode));
  }

  function finishExam() {
    setProgress((current) => submitExam(current, activeSession, new Date().toISOString()));
  }

  function recordReview(questionId: string, remembered: boolean) {
    setProgress((current) => reviewWrongAnswer(current, questionId, remembered, new Date().toISOString()));
  }

  function updateAnswer(questionId: string, answer: string) {
    setProgress((current) => {
      const attempt = current.examAttempts.filter((entry) => entry.sessionId === activeSession.id).at(-1);
      if (!attempt || attempt.submittedAt) return current;
      if (attempt.mode === "mock" && getRemainingSeconds(attempt, Date.now()) === 0) return submitExam(current, activeSession, new Date().toISOString());
      return { ...current, answers: { ...current.answers, [questionId]: answer } };
    });
  }

  function updateWrongAnswerNote(questionId: string, updates: Parameters<typeof updateWrongAnswer>[2]) {
    setProgress((current) => updateWrongAnswer(current, questionId, updates));
  }

  function exportBackup() {
    const backup = JSON.stringify(createBackup({ ...progress, activeTab }), null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "information-processing-engineer-progress.json";
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setBackupMessage("백업 파일을 내려받았습니다.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const restored = restoreBackup(JSON.parse(await file.text()));
      setProgress(restored);
      setActiveTab(restored.activeTab);
      setSessionId(restored.activeSessionId ?? "2026-2");
      setRecordsLoaded(true);
      setBackupMessage("학습 기록을 복원했습니다.");
    } catch {
      setBackupMessage("이 자격증에서 만든 올바른 백업 파일만 가져올 수 있습니다.");
    } finally {
      event.target.value = "";
    }
  }

  if (!recordsLoaded) return <main className="mx-auto max-w-5xl px-4 py-10"><p role="status">{backupMessage || "학습 기록을 불러오는 중입니다."}</p>{backupMessage ? <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center rounded border border-border px-3">JSON 백업으로 복원<input type="file" accept="application/json" className="sr-only" onChange={importBackup} /></label> : null}</main>;

  const dueReviews = progress.wrongAnswers.filter((wrong) => Date.parse(wrong.nextReviewAt) <= Date.now());
  const activeAttempt = progress.examAttempts.filter((attempt) => attempt.sessionId === activeSession.id).at(-1);

  return (
    <main className="certification-hub mx-auto max-w-5xl px-4 py-10 pb-24 sm:px-6">
      <header className="border-b border-border pb-7">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Certification study / public learning record</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">정보처리기사 실기</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">기출은 직접 풀고, 오답은 브라우저에 남기고, 필요할 때 JSON으로 옮기는 10일 집중 학습 허브입니다.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setFocusMode((current) => !current)} className="inline-flex min-h-10 items-center gap-2 rounded border border-border px-3 text-sm"><Focus className="size-4" />{focusMode ? "집중 모드 종료" : "집중 모드"}</button>
          <button type="button" onClick={exportBackup} className="inline-flex min-h-10 items-center gap-2 rounded border border-border px-3 text-sm"><Download className="size-4" />JSON 백업</button>
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded border border-border px-3 text-sm"><Upload className="size-4" />JSON 가져오기<input type="file" accept="application/json" className="sr-only" onChange={importBackup} /></label>
        </div>
        {backupMessage ? <p className="mt-3 text-xs text-muted-foreground" role="status">{backupMessage}</p> : null}
      </header>

      <nav className="mt-6 hidden flex-wrap gap-2 sm:flex" aria-label="학습 허브 메뉴">
        {tabs.map(([id, label]) => <button key={id} type="button" onClick={() => changeTab(id)} aria-pressed={activeTab === id} className={activeTab === id ? "min-h-10 rounded bg-primary px-3 text-sm font-semibold text-primary-foreground" : "min-h-10 rounded border border-border px-3 text-sm"}>{label}</button>)}
      </nav>

      <div className="mt-7">
        {activeTab === "today" ? <><TodayPanel day={nextDay} currentDay={progress.currentDay} onComplete={() => setProgress((current) => ({ ...current, completedDays: [...new Set([...current.completedDays, current.currentDay])], currentDay: Math.min(10, current.currentDay + 1) }))} /><section className="mt-5 border-t border-border pt-5"><h2 className="font-semibold">오늘 복습할 오답 {dueReviews.length}개</h2><p className="mt-2 text-sm text-muted-foreground">복습 날짜가 지났어도 기록은 그대로 남습니다.</p><button type="button" onClick={() => changeTab("cards")} className="mt-3 min-h-11 rounded border border-border px-4 text-sm">암기카드로 복습</button></section></> : null}
        {activeTab === "plan" ? <PlanPanel currentDay={progress.currentDay} /> : null}
        {activeTab === "concepts" ? <ConceptLibrary onOpenQuestion={openConceptQuestion} /> : null}
        {activeTab === "exams" ? <section><div className="mb-5 flex flex-wrap gap-2">{examSessions.map((session) => <button type="button" key={session.id} onClick={() => { setSessionId(session.id); setProgress((current) => ({ ...current, activeSessionId: session.id })); setTargetQuestionId(null); }} className={session.id === activeSession.id ? "min-h-11 rounded bg-primary px-3 text-sm font-semibold text-primary-foreground" : "min-h-11 rounded border border-border px-3 text-sm"}>{session.label}</button>)}</div><ExamWorkspace key={activeSession.id} session={activeSession} attempt={activeAttempt} savedAnswers={progress.answers} onAnswerChange={updateAnswer} onStart={beginExam} onSubmit={finishExam} targetQuestionId={targetQuestionId} /><section className="mt-6 border-t border-border pt-5" aria-label="점수 기록"><h3 className="font-semibold">이 회차 점수 기록</h3><ul className="mt-3 space-y-2 text-sm">{progress.examAttempts.filter((attempt) => attempt.sessionId === activeSession.id && attempt.submittedAt).map((attempt, index) => <li key={`${attempt.startedAt}-${index}`}>{new Date(attempt.submittedAt!).toLocaleString("ko-KR")} — {attempt.mode === "mock" ? "모의고사" : "연습"} {attempt.score}점</li>)}</ul></section></section> : null}
        {activeTab === "wrong" ? <WrongAnswerNotebook wrongAnswers={progress.wrongAnswers} examAttempts={progress.examAttempts} onOpenQuestion={openConceptQuestion} onUpdate={updateWrongAnswerNote} /> : null}
        {activeTab === "cards" ? <FlashcardDeck wrongAnswers={progress.wrongAnswers} onReview={recordReview} onOpenQuestion={openConceptQuestion} /> : null}
        {activeTab === "library" ? <LibraryPanel /> : null}
      </div>

      {moreMenuOpen ? <nav id="study-more-menu" className="fixed inset-x-3 bottom-20 z-30 grid gap-2 rounded border border-border bg-background p-3 shadow-lg sm:hidden" aria-label="추가 학습 메뉴">
        {[["plan", "10일 플랜"], ["concepts", "개념 공부"], ["library", "자료실"]].map(([id, label]) => <button key={id} type="button" onClick={() => changeTab(id)} className="min-h-11 rounded border border-border px-3 text-left text-sm">{label}</button>)}
      </nav> : null}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:hidden" aria-label="모바일 학습 허브 메뉴">
        {[["today", "오늘"], ["exams", "기출"], ["wrong", "오답"], ["cards", "암기"]].map(([id, label]) => <button key={id} type="button" onClick={() => changeTab(id)} aria-pressed={activeTab === id} className={activeTab === id ? "min-h-11 rounded bg-secondary text-xs font-semibold" : "min-h-11 text-xs text-muted-foreground"}>{label}</button>)}
        <button type="button" onClick={() => setMoreMenuOpen((current) => !current)} aria-expanded={moreMenuOpen} aria-controls="study-more-menu" className="min-h-11 text-xs">더보기</button>
      </nav>
    </main>
  );
}

function TodayPanel({ day, currentDay, onComplete }: { day: readonly string[]; currentDay: number; onComplete: () => void }) {
  const studyBlocks = currentDay === 1 || currentDay === 10
    ? [["진단·실전 풀이", "150분"], ["채점·오답 분석", "90분"]]
    : [["개념 1·2회독", "50분"], ["예제와 연결 기출 추적", "100분"], ["답 가리고 기출 재풀이", "60분"], ["기억 규칙·오답 복습", "30분"]];
  return (
    <section className="rounded border border-border bg-card p-5 sm:p-6">
      <p className="font-mono text-xs text-brand">DAY {String(currentDay).padStart(2, "0")} / 10 · 하루 4시간</p>
      <h2 className="mt-3 text-2xl font-semibold">{day[1]}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{day[2]}</p>
      <dl className="mt-5 divide-y divide-border border-y border-border">
        {studyBlocks.map(([title, time]) => <div key={title} className="flex justify-between gap-3 py-3 text-sm"><dt>{title}</dt><dd className="shrink-0 font-mono text-brand">{time}</dd></div>)}
      </dl>
      {currentDay === 1 ? <p className="mt-4 text-sm leading-7 text-muted-foreground">기출 탭의 2026년 2회는 원문 대조를 마쳤습니다. IP·정규화 문항의 복원 조건을 확인하며 풀고, 채점 후 틀린 이유를 기록하세요.</p> : null}
      <button type="button" onClick={onComplete} className="mt-6 min-h-11 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground">오늘 학습 완료</button>
    </section>
  );
}

function PlanPanel({ currentDay }: { currentDay: number }) {
  return <section><h2 className="text-2xl font-semibold">10일 필수 플랜 + 4일 유연일</h2><ol className="mt-5 divide-y divide-border border-y border-border">{studyDays.map(([day, title, detail], index) => <li key={day} className={index + 1 === currentDay ? "bg-brand/5 px-4 py-4" : "px-4 py-4"}><p className="font-mono text-xs text-brand">{day}</p><h3 className="mt-1 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{detail}</p></li>)}</ol><p className="mt-5 text-sm text-muted-foreground">유연일: {flexDays.join(" · ")}. 3~4일 쉬어도 다음 필수일로 이어가면 됩니다.</p></section>;
}

function LibraryPanel() {
  return (
    <section>
      <h2 className="text-2xl font-semibold">자료실</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">참고 블로그의 목차 33개 링크입니다. 최근 8회차는 기출 탭에서 직접 풀고, 이전 회차와 언어 정리는 원문에서 읽을 수 있습니다.</p>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {studyResourceGroups.map((group, index) => (
          <details key={group.title} open={index === 0} className="py-4">
            <summary className="min-h-10 cursor-pointer font-semibold">{group.title} ({group.links.length})</summary>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {group.links.map(([label, articleId]) => (
                <li key={articleId}>
                  <a href={`https://chobopark.tistory.com/${articleId}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm text-brand underline underline-offset-4">
                    <Eye className="size-4" />{label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
