import { describe, expect, it } from "vitest";

import { examSessions } from "./question-bank";

describe("information processing engineer question bank", () => {
  it("uses the restored 2026 second-session numbering instead of topic exercises", () => {
    const latest = examSessions.find((session) => session.id === "2026-2")!;
    expect(latest.questions[1].answer).toBe("10a20b");
    expect(latest.questions[5].answer).toBe("_THIISING");
    expect(latest.questions[15].answer).toBe("28");
    expect(latest.contentStatus).not.toBe("practice-draft");
  });
  it("contains eight recovered sessions with twenty unique sourced questions each", () => {
    expect(examSessions).toHaveLength(8);

    const questions = examSessions.flatMap((session) => session.questions);
    expect(questions).toHaveLength(160);
    expect(new Set(questions.map((question) => question.id)).size).toBe(160);

    for (const session of examSessions) {
      expect(session.questions).toHaveLength(20);
      expect(session.sourceUrl).toMatch(/^https:\/\/chobopark\.tistory\.com\//);
    }
  });
});
