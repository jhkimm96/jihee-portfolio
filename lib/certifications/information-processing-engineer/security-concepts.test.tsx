import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SecurityConceptExplorer } from "../../../components/certification-study/security-concept-explorer";
import { studyConcepts } from "./concepts";
import { securityLessons } from "./security-concepts";

describe("security concept explorers", () => {
  it("enriches the four existing cards without increasing the 37-concept curriculum", () => {
    expect(studyConcepts).toHaveLength(37);
    expect(Object.keys(securityLessons)).toEqual(["security-basics", "security-attacks", "security-web", "security-crypto"]);
    for (const id of Object.keys(securityLessons)) {
      expect(studyConcepts.filter((concept) => concept.id === id)).toHaveLength(1);
    }
    expect(Object.values(securityLessons).map((lesson) => lesson.terms.length)).toEqual([18, 26, 8, 12]);
    expect(Object.values(securityLessons).map((lesson) => lesson.terms.filter((term) => term.supplement).length)).toEqual([2, 3, 1, 0]);
  });

  it("provides unique selections, complete explanations, labelled flows and primary-source links", () => {
    for (const lesson of Object.values(securityLessons)) {
      expect(new Set(lesson.terms.map((term) => term.id)).size).toBe(lesson.terms.length);
      expect(lesson.terms.some((term) => !term.supplement)).toBe(true);
      for (const term of lesson.terms) {
        for (const value of [term.id, term.name, term.group, term.summary, term.situation, term.keywords, term.protection, term.compare]) {
          expect(value.trim().length, term.id).toBeGreaterThan(0);
        }
        expect(term.flow, term.id).toHaveLength(5);
        expect(term.flow.every((label) => label.trim().length > 0), term.id).toBe(true);
      }
      expect(lesson.sources.length).toBeGreaterThan(0);
      for (const source of lesson.sources) expect(new URL(source.url).protocol).toBe("https:");
    }
  });

  it("renders selectable terms and one accessible explanation per card", () => {
    for (const lesson of Object.values(securityLessons)) {
      const markup = renderToStaticMarkup(createElement(SecurityConceptExplorer, { lesson }));
      expect(markup).toContain(`aria-label="${lesson.title} 용어 선택"`);
      expect(markup).toContain('aria-live="polite"');
      expect(markup.match(/role="img"/g)).toHaveLength(1);
      expect(markup).toContain("모든 용어가 실제 기출이라는 뜻은 아닙니다");
      expect(markup.includes('aria-label="보안 학습 범위"')).toBe(lesson.terms.some((term) => term.supplement));
      for (const term of lesson.terms) expect(markup).toContain(`>${term.name}</button>`);
    }
  });
});
