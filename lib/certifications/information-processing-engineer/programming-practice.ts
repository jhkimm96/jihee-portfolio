import { pythonLessons } from "./python-lessons";
import { javaLessons } from "./java-lessons";
import { pythonReference } from "./python-reference";
import { examSessions } from "./question-bank";
import type { ExamQuestion } from "./types";

export const programmingLessons = [...pythonLessons, ...javaLessons];
export type ProgrammingQuestion = ExamQuestion & { conceptId: string; lessonId: string; language: "Python" | "Java" };

export const programmingQuestions: ProgrammingQuestion[] = [
  ...programmingLessons.flatMap((lesson) => lesson.examples.map((example) => ({
    id: `practice-${example.id}`, conceptId: lesson.conceptId, lessonId: lesson.id, language: lesson.language,
    prompt: `${example.title} — 다음 코드의 출력을 적으세요.`, code: example.code,
    answer: example.output, acceptedAnswers: [example.output], gradingMode: "code-output" as const,
    explanation: `${lesson.rule}\n${lesson.trap}\n${example.steps.map((step) => step.explanation).join("\n")}`,
    tags: [lesson.language, lesson.title, "자체 제작 연습"],
  }))),
  ...pythonReference.map((entry) => ({
    id: `practice-ref-${entry.id}`, conceptId: "python-reference", lessonId: entry.id, language: "Python" as const,
    prompt: `${entry.group} / ${entry.name} — 다음 코드의 출력을 적으세요.`, code: entry.code,
    answer: entry.output, acceptedAnswers: [entry.output], gradingMode: "code-output" as const,
    explanation: `${entry.summary}\n반환: ${entry.returns}\n원본: ${entry.mutates}\n${entry.trap}`,
    tags: ["Python", entry.group, entry.name, "자체 제작 연습"],
  })),
];

export function findStudyQuestion(questionId: string): ExamQuestion | undefined {
  return programmingQuestions.find((question) => question.id === questionId)
    ?? examSessions.flatMap((session) => session.questions).find((question) => question.id === questionId);
}
