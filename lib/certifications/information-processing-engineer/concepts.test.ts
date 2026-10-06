import { describe, expect, it } from "vitest";
import { studyConcepts } from "./concepts";
import { examSessions } from "./question-bank";

describe("concept links", () => {
  it("links the double-pointer lesson to double-pointer questions", () => {
    const concept = studyConcepts.find((entry) => entry.id === "c-double-pointer")!;
    const question = examSessions.flatMap((session) => session.questions).find((entry) => entry.id === concept.relatedQuestionIds[0])!;
    expect(question.code).toMatch(/int\s*\*\s*\*/);
  });
  it("never sends learners to a missing question", () => {
    const questionIds = new Set(examSessions.flatMap((session) => session.questions.map((question) => question.id)));
    for (const concept of studyConcepts) {
      for (const questionId of concept.relatedQuestionIds) {
        expect(questionIds.has(questionId), `${concept.title}: ${questionId}`).toBe(true);
      }
    }
  });
});
