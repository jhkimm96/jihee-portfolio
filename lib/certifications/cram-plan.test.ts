import { describe, expect, it } from "vitest";
import { cramBlocks } from "./information-processing-engineer/cram-plan";
import { studyConcepts } from "./information-processing-engineer/concepts";
import { examSessions } from "./information-processing-engineer/question-bank";
import { createEmptyProgress, createBackup, restoreBackup, recordCramAnswer } from "./study-progress";

describe("12시간 개별 학습", () => {
  it("720분이며 모든 개념과 기출 연결이 존재한다", () => {
    expect(cramBlocks.reduce((sum, block) => sum + block.minutes, 0)).toBe(720);
    for (const block of cramBlocks) {
      for (const id of block.conceptIds) expect(studyConcepts.some((concept) => concept.id === id), id).toBe(true);
      for (const id of block.questionIds) expect(examSessions.some((session) => session.questions.some((question) => question.id === id)), id).toBe(true);
    }
    expect(cramBlocks.slice(0, 9).flatMap((block) => block.questionIds).some((id) => id.startsWith("2026-2"))).toBe(false);
  });

  const question = examSessions[0].questions[0];
  const now = "2026-10-24T06:00:00Z";
  it("빈 답은 오답도 제출 기록도 만들지 않는다", () => {
    const progress = createEmptyProgress();
    expect(recordCramAnswer(progress, question, "  ", now)).toBe(progress);
  });
  it("제출한 오답 하나만 저장하고 기존 진도와 모의고사를 건드리지 않는다", () => {
    const progress = createEmptyProgress();
    const result = recordCramAnswer(progress, question, "명백한오답", now);
    expect(result.wrongAnswers.map((wrong) => wrong.questionId)).toEqual([question.id]);
    expect(result.programmingAttempts).toHaveLength(1);
    expect(result.examAttempts).toEqual(progress.examAttempts);
    expect(result.answers).toEqual(progress.answers);
    expect(result.completedDays).toEqual([]);
    result.wrongAnswers[0].memoryRule = "내 규칙";
    const retried = recordCramAnswer(result, question, question.acceptedAnswers[0], now);
    expect(retried.programmingAttempts.at(-1)?.correct).toBe(true);
    expect(retried.wrongAnswers[0].memoryRule).toBe("내 규칙");
    expect(retried.wrongAnswers[0].attempts).toBe(1);
    expect(restoreBackup(createBackup({ ...retried, activeTab: "cram" }))).toEqual({ ...retried, activeTab: "cram" });
  });
  it("서브넷의 의미 기반 채점을 개별 풀이에서도 적용한다", () => {
    const subnet = { ...question, gradingMode: "subnet-hosts" as const, acceptedAnswers: [], subnetChecks: [{ networkAddress: "192.168.1.0", prefixLength: 24, excludedAddresses: [] }] };
    expect(recordCramAnswer(createEmptyProgress(), subnet, "192.168.1.42", now).programmingAttempts[0].correct).toBe(true);
  });
});
