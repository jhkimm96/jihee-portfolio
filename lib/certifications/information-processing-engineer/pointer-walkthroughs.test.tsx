import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PointerWalkthrough } from "../../../components/certification-study/pointer-walkthrough";
import { studyConcepts } from "./concepts";
import { pointerWalkthroughs } from "./pointer-walkthroughs";

describe("pointer concept walkthroughs", () => {
  it("enriches the seven existing pointer lessons without changing the 37-concept curriculum", () => {
    expect(studyConcepts).toHaveLength(37);
    expect(Object.keys(pointerWalkthroughs).sort()).toEqual([
      "c-array", "c-call", "c-double-pointer", "c-function-pointer", "c-pointer", "c-pointer-array", "c-struct",
    ]);
    for (const conceptId of Object.keys(pointerWalkthroughs)) {
      expect(studyConcepts.some((concept) => concept.id === conceptId)).toBe(true);
    }
  });

  it("only highlights and changes memory fields that exist in the visible snapshot", () => {
    for (const [conceptId, lesson] of Object.entries(pointerWalkthroughs)) {
      for (const step of lesson.steps) {
        const objects = lesson.objects.filter((object) => !step.visibleObjects || step.visibleObjects.includes(object.id));
        const objectIds = objects.map((object) => object.id);
        const fieldIds = objects.flatMap((object) => object.fields.map((field) => field.id));
        expect(new Set(objectIds).size, conceptId).toBe(objectIds.length);
        expect(new Set(fieldIds).size, conceptId).toBe(fieldIds.length);
        for (const id of step.highlight) expect([...objectIds, ...fieldIds], `${conceptId}: ${step.label}`).toContain(id);
        for (const id of Object.keys(step.values ?? {})) expect(fieldIds, `${conceptId}: ${step.label}`).toContain(id);
        for (const id of step.visibleObjects ?? []) expect(lesson.objects.some((object) => object.id === id)).toBe(true);
      }
    }
  });

  it("stores only the first address in each pointer-array element and distinguishes invalid extra dereferencing", () => {
    const lesson = pointerWalkthroughs["c-pointer-array"];
    const pointers = lesson.objects.find((object) => object.id === "parr")!;
    expect(pointers.fields.map(({ address, value }) => [address, value])).toEqual([["2000", "1012"], ["2008", "1024"]]);
    expect(lesson.steps.find((step) => step.expression.startsWith("**parr ="))?.result).toBe("4");
    expect(lesson.steps.find((step) => step.expression.startsWith("**parr[0]"))?.resultKind).toBe("컴파일 오류");
    expect(lesson.steps.find((step) => step.resultKind === "출력")?.result).toBe("8 + 9 + 4 = 21");
  });

  it("changes the pointer target separately from the pointed-to integer", () => {
    const steps = pointerWalkthroughs["c-double-pointer"].steps;
    expect(steps[3].values).toEqual({ "p-address": "200" });
    expect(steps[4].values).toEqual({ "p-address": "200", "b-value": "21" });
    expect(pointerWalkthroughs["c-struct"].steps[3].values).toEqual({ "b-value": "50" });
    expect(pointerWalkthroughs["c-struct"].steps[4].values).toEqual({ "head-address": "2000" });
  });

  it("renders each lesson with labelled controls, real addresses and an announced result", () => {
    for (const lesson of Object.values(pointerWalkthroughs)) {
      const markup = renderToStaticMarkup(createElement(PointerWalkthrough, { lesson }));
      expect(markup).toContain('aria-label="포인터 추적 단계"');
      expect(markup).toContain('aria-live="polite"');
      expect(markup.match(/aria-pressed="true"/g)).toHaveLength(1);
      const firstVisibleObject = lesson.objects.find((object) => !lesson.steps[0].visibleObjects || lesson.steps[0].visibleObjects.includes(object.id))!;
      expect(markup).toContain(firstVisibleObject.address);
      expect(markup).toContain(lesson.steps[0].result);
    }
  });
});
