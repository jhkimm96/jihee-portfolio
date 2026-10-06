import type { ExamQuestion, GradingMode } from "./information-processing-engineer/types";

type GradeAnswerInput = {
  submittedAnswer: string;
  gradingMode: GradingMode;
  acceptedAnswers: string[];
  subnetChecks?: ExamQuestion["subnetChecks"];
};

export function gradeAnswer({
  submittedAnswer,
  gradingMode,
  acceptedAnswers,
  subnetChecks,
}: GradeAnswerInput) {
  const normalizedAnswer = normalizeAnswer(submittedAnswer, gradingMode);
  if (gradingMode === "subnet-hosts") {
    return { correct: gradeSubnetHosts(submittedAnswer, subnetChecks), normalizedAnswer };
  }
  const comparableAnswer = gradingMode === "theory" ? normalizedAnswer.replace(/\s/g, "") : normalizedAnswer;
  const correct = acceptedAnswers.some((answer) => {
    const normalizedAcceptedAnswer = normalizeAnswer(answer, gradingMode);
    const comparableAcceptedAnswer = gradingMode === "theory" ? normalizedAcceptedAnswer.replace(/\s/g, "") : normalizedAcceptedAnswer;
    return comparableAcceptedAnswer === comparableAnswer;
  });

  return { correct, normalizedAnswer };
}

function gradeSubnetHosts(answer: string, subnetChecks: ExamQuestion["subnetChecks"]) {
  if (!subnetChecks?.length) return false;
  const addresses = answer.trim().split(/[\n,]+/).map((entry) => entry.trim().replace(/^[245][.)]\s+/, ""));
  if (addresses.length !== subnetChecks.length || new Set(addresses).size !== addresses.length) return false;
  return subnetChecks.every((check, index) => {
    const address = parseIpv4(addresses[index]);
    const networkAddress = parseIpv4(check.networkAddress);
    if (address === null || networkAddress === null || check.excludedAddresses.includes(addresses[index])) return false;
    if (!Number.isInteger(check.prefixLength) || check.prefixLength < 1 || check.prefixLength > 30) return false;
    const mask = (0xffffffff << (32 - check.prefixLength)) >>> 0;
    const network = (networkAddress & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    return address > network && address < broadcast;
  });
}

function parseIpv4(value: string) {
  const octets = value.split(".");
  if (octets.length !== 4 || !octets.every((part) => /^(0|[1-9]\d{0,2})$/.test(part) && Number(part) <= 255)) return null;
  return octets.reduce((address, part) => address * 256 + Number(part), 0);
}

function normalizeAnswer(answer: string, gradingMode: GradingMode) {
  if (gradingMode === "code-output") {
    return answer.replace(/\r\n/g, "\n");
  }

  return answer.trim().replace(/\s+/g, " ").toLowerCase();
}
