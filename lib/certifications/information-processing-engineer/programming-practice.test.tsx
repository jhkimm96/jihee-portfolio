import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { pythonReference } from "./python-reference";
import { programmingLessons, programmingQuestions, findStudyQuestion } from "./programming-practice";
import { studyConcepts } from "./concepts";
import { ProgrammingLessonExplorer, PythonReferenceExplorer, PythonTextFormatGuide } from "../../../components/certification-study/programming-lesson-explorer";
import { PythonSliceExplorer } from "../../../components/certification-study/python-slice-explorer";
import { ProgrammingPractice } from "../../../components/certification-study/programming-practice";
import { gradeAnswer } from "../study-grading";

describe("programming mastery coverage", () => {
  it("covers every approved Python function and method with a real explanation and runnable example", () => {
    const required = {
      builtin: ["len", "range", "print", "type", "int", "str", "list", "tuple", "set", "dict", "bool"],
      number: ["sum", "min", "max", "abs", "round", "divmod", "pow", "bin", "oct", "hex"],
      list: ["append", "extend", "insert", "remove", "pop", "clear", "index", "count", "sort", "reverse", "copy"],
      str: ["split", "join", "strip", "replace", "find", "index", "count", "upper", "lower", "isdigit", "isalpha"],
      dict: ["get", "keys", "values", "items", "update", "pop", "setdefault"],
      set: ["add", "update", "remove", "discard", "union", "intersection", "difference"],
      iteration: ["enumerate", "zip", "sorted", "reversed", "map", "filter", "all", "any"], character: ["ord", "chr"],
    };
    for (const [group, names] of Object.entries(required)) for (const name of names) {
      const entry = pythonReference.find((item) => item.id === `${group}-${name}`);
      expect(entry, `${group}.${name}`).toBeDefined();
      for (const value of [entry!.summary, entry!.returns, entry!.mutates, entry!.code, entry!.output, entry!.trap]) expect(value.length).toBeGreaterThan(0);
      expect(findStudyQuestion(`practice-ref-${entry!.id}`)).toBeDefined();
    }
    expect(pythonReference).toHaveLength(Object.values(required).flat().length);
  });
  it("keeps unique concepts, all three priorities, complete traces and valid practice links", () => {
    expect(new Set(studyConcepts.map((concept) => concept.id)).size).toBe(studyConcepts.length);
    expect(new Set(programmingQuestions.map((question) => question.id)).size).toBe(programmingQuestions.length);
    for (const language of ["Python", "Java"]) for (const priority of [1, 2, 3]) expect(programmingLessons.some((lesson) => lesson.language === language && lesson.priority === priority)).toBe(true);
    for (const lesson of programmingLessons) {
      expect(studyConcepts.some((concept) => concept.id === lesson.conceptId)).toBe(true);
      expect(lesson.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of lesson.examples) {
        expect(example.steps.length).toBeGreaterThanOrEqual(2);
        for (const step of example.steps) {
          expect(step.line).toBeGreaterThan(0); expect(step.line).toBeLessThanOrEqual(example.code.split("\n").length);
          expect(step.bindings.length).toBeGreaterThan(0); expect(step.explanation.length).toBeGreaterThan(0);
        }
        expect(example.steps.at(-1)?.output, example.id).toBe(example.output);
        expect(findStudyQuestion(`practice-${example.id}`)?.code).toBe(example.code);
      }
    }
  });
  it("grades exact code output rather than ignoring meaningful whitespace and case", () => {
    const question = programmingQuestions.find((entry) => entry.answer.includes(" "))!;
    expect(gradeAnswer({ submittedAnswer: question.answer, gradingMode: "code-output", acceptedAnswers: question.acceptedAnswers }).correct).toBe(true);
    expect(gradeAnswer({ submittedAnswer: question.answer.replace(/ /g, ""), gradingMode: "code-output", acceptedAnswers: question.acceptedAnswers }).correct).toBe(false);
  });
  it("renders labelled mobile-friendly teaching, dictionary and prediction controls", () => {
    for (const lesson of programmingLessons) {
      const html = renderToStaticMarkup(createElement(ProgrammingLessonExplorer, { lessons: [lesson] }));
      expect(html).toContain("다음 단계"); expect(html).toContain("aria-live");
    }
    expect(renderToStaticMarkup(createElement(PythonReferenceExplorer))).toContain("함수·메서드 검색");
    expect(renderToStaticMarkup(createElement(PythonSliceExplorer))).toContain("다음 원소 선택");
    const formatGuide = renderToStaticMarkup(createElement(PythonTextFormatGuide));
    expect(formatGuide).toContain("chr(66) → &#x27;B&#x27;"); expect(formatGuide).toContain("서식 지정자");
    const quiz = renderToStaticMarkup(createElement(ProgrammingPractice, { questions: programmingQuestions.slice(0, 2), attempts: [], onSubmit: () => {} }));
    expect(quiz).toContain("제출하고 채점"); expect(quiz).toContain("예상 출력");
  });
});
