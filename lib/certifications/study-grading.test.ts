import { describe, expect, it } from "vitest";

import { gradeAnswer } from "./study-grading";

describe("gradeAnswer", () => {
  it("accepts Korean theory terms with optional spaces", () => {
    expect(gradeAnswer({ submittedAnswer: "외부조인", gradingMode: "theory", acceptedAnswers: ["외부 조인"] }).correct).toBe(true);
  });
  it("accepts any usable host in the requested subnets instead of one example answer", () => {
    const subnetChecks = [
      { networkAddress: "192.168.35.0", prefixLength: 24, excludedAddresses: ["192.168.35.3"] },
      { networkAddress: "129.200.8.0", prefixLength: 22, excludedAddresses: ["129.200.10.72"] },
      { networkAddress: "192.168.36.0", prefixLength: 24, excludedAddresses: ["192.168.36.16"] },
    ];
    const input = { gradingMode: "subnet-hosts" as const, acceptedAnswers: [], subnetChecks };
    expect(gradeAnswer({ ...input, submittedAnswer: "192.168.35.100\n129.200.11.200\n192.168.36.20" }).correct).toBe(true);
    expect(gradeAnswer({ ...input, submittedAnswer: "192.168.35.0\n129.200.11.200\n192.168.36.20" }).correct).toBe(false);
    expect(gradeAnswer({ ...input, submittedAnswer: "192.168.35.100\n129.200.12.1\n192.168.36.20" }).correct).toBe(false);
    expect(gradeAnswer({ ...input, submittedAnswer: "192.168.35.3\n129.200.11.200\n192.168.36.20" }).correct).toBe(false);
  });
  it("does not silently discard leading or trailing spaces in code output", () => {
    expect(gradeAnswer({ submittedAnswer: " 12 ", gradingMode: "code-output", acceptedAnswers: ["12"] }).correct).toBe(false);
  });
  it("accepts equivalent theory answers despite spacing, casing, and aliases", () => {
    const result = gradeAnswer({
      submittedAnswer: "  outer   join ",
      gradingMode: "theory",
      acceptedAnswers: ["OUTER JOIN", "외부 조인"],
    });

    expect(result).toEqual({ correct: true, normalizedAnswer: "outer join" });
  });

  it("keeps code output spacing and line breaks strict", () => {
    const result = gradeAnswer({
      submittedAnswer: "1  2\n3",
      gradingMode: "code-output",
      acceptedAnswers: ["1 2\n3"],
    });

    expect(result).toEqual({ correct: false, normalizedAnswer: "1  2\n3" });
  });
});
