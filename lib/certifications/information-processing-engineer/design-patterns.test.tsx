import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DesignPatternExplorer, UmlDiagram } from "../../../components/certification-study/design-pattern-explorer";
import { studyConcepts } from "./concepts";
import { designPatterns, umlRelations } from "./design-patterns";

describe("design pattern concept explorer", () => {
  it("covers all 23 GoF patterns in the 5/7/11 categories inside the existing concept", () => {
    expect(studyConcepts.filter((concept) => concept.id === "patterns-uml")).toHaveLength(1);
    expect(designPatterns).toHaveLength(23);
    expect(new Set(designPatterns.map((pattern) => pattern.id)).size).toBe(23);
    expect(["생성", "구조", "행위"].map((category) => designPatterns.filter((pattern) => pattern.category === category).length)).toEqual([5, 7, 11]);
  });

  it("gives every pattern a complete example and a diagram made of nodes and labelled actions", () => {
    for (const pattern of designPatterns) {
      for (const value of [pattern.name, pattern.en, pattern.answer, pattern.situation, pattern.effect, pattern.clue, pattern.compare]) expect(value.trim().length).toBeGreaterThan(0);
      if (pattern.diagram.kind !== "flow") continue;
      expect(pattern.diagram.rows.length).toBeGreaterThan(0);
      for (const row of pattern.diagram.rows) {
        expect(row.length).toBeGreaterThanOrEqual(3);
        expect(row.length % 2).toBe(1);
        expect(row.every((label) => label.trim().length > 0)).toBe(true);
      }
    }
  });

  it("starts at Bridge and renders all 23 selectable names without preloading separate pages", () => {
    const markup = renderToStaticMarkup(createElement(DesignPatternExplorer));
    expect(markup).toContain('aria-label="패턴 선택"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain("기능 계층");
    expect(markup).toContain("구현 계층");
    for (const pattern of designPatterns) expect(markup).toContain(`>${pattern.name}</button>`);
  });

  it("draws UML notation with triangles toward the parent and diamonds at the whole", () => {
    expect(umlRelations).toHaveLength(6);
    expect(new Set(umlRelations.map((relation) => relation.kind)).size).toBe(6);
    for (const relation of umlRelations) {
      const markup = renderToStaticMarkup(createElement(UmlDiagram, { relation }));
      const line = markup.match(/<line [^>]+>/)?.[0] ?? "";
      const dashed = relation.kind === "dependency" || relation.kind === "realization";
      const diamond = relation.kind === "aggregation" || relation.kind === "composition";
      expect(line.includes('stroke-dasharray="5 4"'), relation.id).toBe(dashed);
      expect(line.includes("marker-start="), relation.id).toBe(diamond);
      if (relation.kind === "generalization" || relation.kind === "realization") expect(line).toContain("-triangle)");
      if (relation.kind === "dependency") expect(line).toContain("-arrow)");
      if (relation.kind === "solid") expect(line).not.toContain("marker-");
      if (diamond) {
        const marker = markup.match(/<marker [^>]+-diamond[^>]*>[\s\S]*?<\/marker>/)?.[0] ?? "";
        expect(marker).toContain(relation.kind === "composition" ? 'class="fill-current"' : 'class="fill-card"');
      }
    }
  });
});
