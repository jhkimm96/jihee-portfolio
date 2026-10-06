import { describe, expect, it } from "vitest";

import { addWrongAnswer, createBackup, restoreBackup, createEmptyProgress, startExam, submitExam, getRemainingSeconds, reviewWrongAnswer } from "./study-progress";
import { examSessions } from "./information-processing-engineer/question-bank";

describe("study progress", () => {
  it("keeps the original deadline when an active exam is started again", () => {
    const session = examSessions.at(-1)!;
    const progress = startExam(createEmptyProgress(), session, "2026-10-06T00:00:00.000Z");
    const resumed = startExam(progress, session, "2026-10-06T01:00:00.000Z");
    expect(resumed.examAttempts).toHaveLength(1);
    expect(getRemainingSeconds(resumed.examAttempts[0], Date.parse("2026-10-06T01:00:00Z"))).toBe(90 * 60);
    expect(getRemainingSeconds(resumed.examAttempts[0], Date.parse("2026-10-06T03:00:00Z"))).toBe(0);
  });

  it("stores score and submitted answers once without duplicating wrong answers", () => {
    const session = examSessions.at(-1)!;
    const running = startExam(createEmptyProgress(), session, "2026-10-06T00:00:00.000Z");
    running.answers[session.questions[0].id] = session.questions[0].answer;
    const submitted = submitExam(running, session, "2026-10-06T00:30:00.000Z");
    expect(submitted.examAttempts[0].score).toBe(5);
    expect(submitted.examAttempts[0].answers[session.questions[0].id]).toBe(session.questions[0].answer);
    expect(submitExam(submitted, session, "2026-10-06T00:31:00.000Z")).toEqual(submitted);
    expect(restoreBackup(createBackup(submitted))).toEqual(submitted);
    const retake = startExam(submitted, session, "2026-10-07T00:00:00.000Z");
    expect(retake.examAttempts).toHaveLength(2);
    expect(retake.answers[session.questions[0].id]).toBe("");
    expect(retake.examAttempts[0].score).toBe(5);
  });

  it("restores older backups with no exam records but rejects invalid scores", () => {
    const backup = createBackup({ currentDay: 4 });
    const { examAttempts: omitted, ...legacy } = backup.progress;
    expect(restoreBackup({ ...backup, progress: legacy }).examAttempts).toEqual([]);
    const session = examSessions.at(-1)!;
    const running = startExam(createEmptyProgress(), session, "2026-10-06T00:00:00.000Z");
    const submitted = submitExam(running, session, "2026-10-06T00:30:00.000Z");
    submitted.examAttempts[0].score = 999;
    expect(() => restoreBackup(createBackup(submitted))).toThrow();
  });

  it("records successful reviews and resets a forgotten card without losing notes", () => {
    const progress = addWrongAnswer(createEmptyProgress(), { questionId: "q", answeredAt: "2026-10-06T00:00:00.000Z", reason: "code-trace-error", memoryRule: "내 규칙", memo: "내 메모" });
    const remembered = reviewWrongAnswer(progress as ReturnType<typeof createEmptyProgress>, "q", true, "2026-10-07T00:00:00.000Z");
    expect(remembered.wrongAnswers[0].nextReviewAt).toBe("2026-10-10T00:00:00.000Z");
    const forgotten = reviewWrongAnswer(remembered, "q", false, "2026-10-10T00:00:00.000Z");
    expect(forgotten.wrongAnswers[0]).toMatchObject({ nextReviewAt: "2026-10-11T00:00:00.000Z", memoryRule: "내 규칙", memo: "내 메모", reviewStreak: 0 });
    expect(forgotten.wrongAnswers[0].reviews).toHaveLength(2);
    expect(restoreBackup(createBackup(forgotten))).toEqual(forgotten);
  });
  it("rejects malformed notes and invalid day numbers before restoring records", () => {
    const backup = createBackup({ currentDay: 4 });
    expect(() => restoreBackup({ ...backup, progress: { ...backup.progress, currentDay: 99 } })).toThrow();
    expect(() => restoreBackup({ ...backup, progress: { ...backup.progress, wrongAnswers: [{ questionId: "x", nextReviewAt: "bad" }] } })).toThrow();
    expect(() => restoreBackup({ ...backup, progress: { ...backup.progress, answers: { q: 42 } } })).toThrow();
  });
  it("creates a first review date one day after a wrong answer", () => {
    const progress = addWrongAnswer(
      { wrongAnswers: [] },
      {
        questionId: "2026-2-01",
        answeredAt: "2026-10-06T00:00:00.000Z",
        reason: "concept-unknown",
        memoryRule: "해시 함수는 입력을 고정 길이 값으로 변환한다.",
      },
    );

    expect(progress.wrongAnswers).toHaveLength(1);
    expect(progress.wrongAnswers[0]).toMatchObject({
      questionId: "2026-2-01",
      attempts: 1,
      nextReviewAt: "2026-10-07T00:00:00.000Z",
    });
  });

  it("preserves prior history and moves a repeated wrong answer to the next interval", () => {
    const first = addWrongAnswer(
      { wrongAnswers: [] },
      {
        questionId: "2026-2-01",
        answeredAt: "2026-10-06T00:00:00.000Z",
        reason: "concept-unknown",
        memoryRule: "첫 규칙",
      },
    );
    const repeated = addWrongAnswer(first, {
      questionId: "2026-2-01",
      answeredAt: "2026-10-07T00:00:00.000Z",
      reason: "calculation-error",
      memoryRule: "수식부터 적는다.",
    });

    expect(repeated.wrongAnswers[0]).toMatchObject({
      attempts: 2,
      nextReviewAt: "2026-10-10T00:00:00.000Z",
      memoryRule: "수식부터 적는다.",
    });
    expect(repeated.wrongAnswers[0].history).toHaveLength(2);
  });

  it("restores a valid backup but rejects a different certificate", () => {
    const backup = createBackup({
      certificateId: "information-processing-engineer",
      wrongAnswers: [],
      currentDay: 4,
    });

    expect(restoreBackup(backup)).toMatchObject({ currentDay: 4 });
    expect(() => restoreBackup({ ...backup, certificateId: "sqld" })).toThrow(
      "지원하지 않는 백업 파일",
    );
  });
});
