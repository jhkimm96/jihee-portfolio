import type {
  StudyProgress,
  WrongAnswer,
  WrongReason,
  ExamSession,
  ExamAttempt,
} from "./information-processing-engineer/types";
import { gradeAnswer } from "./study-grading";

const certificateId = "information-processing-engineer" as const;
const reviewIntervalsInDays = [1, 3, 7];

type WrongAnswerInput = {
  questionId: string;
  answeredAt: string;
  reason: WrongReason;
  memoryRule: string;
  memo?: string;
};

type ProgressDraft = Pick<StudyProgress, "wrongAnswers"> & Partial<StudyProgress>;

export function createEmptyProgress(): StudyProgress {
  return {
    certificateId,
    currentDay: 1,
    activeTab: "today",
    answers: {},
    wrongAnswers: [],
    completedDays: [],
    examAttempts: [],
    activeSessionId: "2026-2",
  };
}

export function startExam(progress: StudyProgress, session: ExamSession, startedAt: string, mode: ExamAttempt["mode"] = "mock"): StudyProgress {
  const latest = progress.examAttempts.filter((attempt) => attempt.sessionId === session.id).at(-1);
  if (latest && !latest.submittedAt) return progress;
  const answers = { ...progress.answers };
  session.questions.forEach((question) => { answers[question.id] = ""; });
  return { ...progress, answers, examAttempts: [...progress.examAttempts, { sessionId: session.id, mode, startedAt, answers: {} }] };
}

export function submitExam(progress: StudyProgress, session: ExamSession, submittedAt: string): StudyProgress {
  const attemptIndex = progress.examAttempts.findLastIndex((attempt) => attempt.sessionId === session.id);
  if (attemptIndex < 0 || progress.examAttempts[attemptIndex].submittedAt) return progress;
  const results = session.questions.map((question) => ({
    question,
    correct: gradeAnswer({
      submittedAnswer: progress.answers[question.id] ?? "",
      gradingMode: question.gradingMode,
      acceptedAnswers: question.acceptedAnswers,
      subnetChecks: question.subnetChecks,
    }).correct,
  }));
  const answers = Object.fromEntries(session.questions.map((question) => [question.id, progress.answers[question.id] ?? ""]));
  const submittedAttempt = {
    ...progress.examAttempts[attemptIndex],
    submittedAt,
    answers,
    score: results.filter((result) => result.correct).length * 5,
  };
  let submittedProgress = {
    ...progress,
    examAttempts: progress.examAttempts.map((attempt, index) => index === attemptIndex ? submittedAttempt : attempt),
  };
  for (const { question, correct } of results) {
    if (correct) continue;
    const existing = submittedProgress.wrongAnswers.find((wrong) => wrong.questionId === question.id);
    submittedProgress = addWrongAnswer(submittedProgress, {
      questionId: question.id,
      answeredAt: submittedAt,
      reason: existing?.reason ?? "concept-unknown",
      memoryRule: existing?.memoryRule ?? question.explanation,
      memo: existing?.memo,
    }) as StudyProgress;
  }
  return submittedProgress;
}

export function getRemainingSeconds(attempt: ExamAttempt, now: number): number {
  return Math.max(0, 150 * 60 - Math.floor((now - Date.parse(attempt.startedAt)) / 1000));
}

export function reviewWrongAnswer(progress: StudyProgress, questionId: string, remembered: boolean, reviewedAt: string): StudyProgress {
  return {
    ...progress,
    wrongAnswers: progress.wrongAnswers.map((wrong) => {
      if (wrong.questionId !== questionId) return wrong;
      const reviewStreak = remembered ? (wrong.reviewStreak ?? 0) + 1 : 0;
      return {
        ...wrong,
        reviewStreak,
        nextReviewAt: calculateNextReviewAt(reviewedAt, reviewStreak + 1),
        reviews: [...(wrong.reviews ?? []), { reviewedAt, remembered }],
      };
    }),
  };
}

export function addWrongAnswer(
  progress: ProgressDraft,
  input: WrongAnswerInput,
): ProgressDraft {
  const existing = progress.wrongAnswers.find(
    (wrongAnswer) => wrongAnswer.questionId === input.questionId,
  );

  if (!existing) {
    return {
      ...progress,
      wrongAnswers: [
        ...progress.wrongAnswers,
        createWrongAnswer(input, 1, []),
      ],
    };
  }

  const attempts = existing.attempts + 1;
  const updated: WrongAnswer = {
    ...existing,
    attempts,
    reason: input.reason,
    memoryRule: input.memoryRule,
    memo: input.memo,
    nextReviewAt: calculateNextReviewAt(input.answeredAt, attempts),
    history: [...existing.history, { answeredAt: input.answeredAt, reason: input.reason }],
    reviewStreak: 0,
  };

  return {
    ...progress,
    wrongAnswers: progress.wrongAnswers.map((wrongAnswer) =>
      wrongAnswer.questionId === input.questionId ? updated : wrongAnswer,
    ),
  };
}

export function updateWrongAnswer(
  progress: StudyProgress,
  questionId: string,
  updates: Pick<WrongAnswer, "reason" | "memoryRule" | "memo">,
): StudyProgress {
  return {
    ...progress,
    wrongAnswers: progress.wrongAnswers.map((wrongAnswer) =>
      wrongAnswer.questionId === questionId ? { ...wrongAnswer, ...updates } : wrongAnswer,
    ),
  };
}

export function createBackup(progress: Partial<StudyProgress>) {
  return {
    version: 1,
    certificateId,
    exportedAt: new Date().toISOString(),
    progress: { ...createEmptyProgress(), ...progress, certificateId },
  };
}

export function restoreBackup(backup: unknown): StudyProgress {
  if (!isRecord(backup) || backup.version !== 1 || backup.certificateId !== certificateId) {
    throw new Error("지원하지 않는 백업 파일");
  }
  if (!isRecord(backup.progress)) {
    throw new Error("지원하지 않는 백업 파일");
  }
  const progress = backup.progress;
  const allowedTabs = ["today", "plan", "concepts", "exams", "wrong", "cards", "library"];
  if (
    progress.certificateId !== certificateId ||
    !isStudyDay(progress.currentDay) ||
    typeof progress.activeTab !== "string" || !allowedTabs.includes(progress.activeTab) ||
    !isRecord(progress.answers) || !Object.values(progress.answers).every((answer) => typeof answer === "string") ||
    !Array.isArray(progress.completedDays) || !progress.completedDays.every(isStudyDay) ||
    !Array.isArray(progress.wrongAnswers) || !progress.wrongAnswers.every(isWrongAnswer)
    || (progress.examAttempts !== undefined && (!Array.isArray(progress.examAttempts) || !progress.examAttempts.every(isExamAttempt)))
    || (progress.activeSessionId !== undefined && (typeof progress.activeSessionId !== "string" || !/^202[4-6]-[1-3]$/.test(progress.activeSessionId)))
  ) {
    throw new Error("지원하지 않는 백업 파일");
  }
  return {
    certificateId,
    currentDay: progress.currentDay,
    activeTab: progress.activeTab,
    answers: progress.answers as Record<string, string>,
    wrongAnswers: progress.wrongAnswers,
    completedDays: progress.completedDays,
    examAttempts: (progress.examAttempts as ExamAttempt[] | undefined) ?? [],
    activeSessionId: (progress.activeSessionId as string | undefined) ?? "2026-2",
  };
}

const allowedReasons: WrongReason[] = ["concept-unknown", "code-trace-error", "calculation-error", "misread-question", "answer-format-error", "guessed"];

function isWrongAnswer(value: unknown): value is WrongAnswer {
  if (!isRecord(value)) return false;
  return typeof value.questionId === "string" && value.questionId.length > 0 &&
    typeof value.attempts === "number" && Number.isInteger(value.attempts) && value.attempts >= 1 &&
    typeof value.reason === "string" && allowedReasons.includes(value.reason as WrongReason) &&
    typeof value.memoryRule === "string" &&
    (value.memo === undefined || typeof value.memo === "string") &&
    (value.reviewStreak === undefined || (Number.isInteger(value.reviewStreak) && Number(value.reviewStreak) >= 0)) &&
    (value.reviews === undefined || (Array.isArray(value.reviews) && value.reviews.every((review) => isRecord(review) && isValidDate(review.reviewedAt) && typeof review.remembered === "boolean"))) &&
    isValidDate(value.nextReviewAt) &&
    Array.isArray(value.history) && value.history.length === value.attempts &&
    value.history.every((entry) => isRecord(entry) && isValidDate(entry.answeredAt) &&
      typeof entry.reason === "string" && allowedReasons.includes(entry.reason as WrongReason));
}

function isStudyDay(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10;
}

function isExamAttempt(value: unknown): value is ExamAttempt {
  if (!isRecord(value) || typeof value.sessionId !== "string" || !/^202[4-6]-[1-3]$/.test(value.sessionId)) return false;
  if (value.mode !== "mock" && value.mode !== "practice") return false;
  if (!isValidDate(value.startedAt) || !isRecord(value.answers) || !Object.values(value.answers).every((answer) => typeof answer === "string")) return false;
  if (value.submittedAt === undefined) return value.score === undefined;
  return isValidDate(value.submittedAt) && Date.parse(value.submittedAt) >= Date.parse(value.startedAt) &&
    typeof value.score === "number" && Number.isInteger(value.score) && value.score >= 0 && value.score <= 100 && value.score % 5 === 0;
}

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function createWrongAnswer(
  input: WrongAnswerInput,
  attempts: number,
  previousHistory: WrongAnswer["history"],
): WrongAnswer {
  return {
    questionId: input.questionId,
    attempts,
    reason: input.reason,
    memoryRule: input.memoryRule,
    memo: input.memo,
    nextReviewAt: calculateNextReviewAt(input.answeredAt, attempts),
    history: [...previousHistory, { answeredAt: input.answeredAt, reason: input.reason }],
  };
}

function calculateNextReviewAt(answeredAt: string, attempts: number) {
  const intervalIndex = Math.min(attempts - 1, reviewIntervalsInDays.length - 1);
  const nextReview = new Date(answeredAt);
  nextReview.setUTCDate(nextReview.getUTCDate() + reviewIntervalsInDays[intervalIndex]);
  return nextReview.toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
