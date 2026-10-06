export type GradingMode = "theory" | "code-output" | "subnet-hosts";

export type ExamQuestion = {
  id: string;
  prompt: string;
  answer: string;
  acceptedAnswers: string[];
  explanation: string;
  tags: string[];
  gradingMode: GradingMode;
  code?: string;
  tables?: { title: string; columns: string[]; rows: string[][] }[];
  verificationNote?: string;
  sourceAnswer?: string | null;
  figures?: { src: string; alt: string; width: number; height: number }[];
  subnetChecks?: { networkAddress: string; prefixLength: number; excludedAddresses: string[] }[];
};

export type ExamSession = {
  id: string;
  label: string;
  sourceUrl: string;
  contentStatus?: "practice-draft";
  sourceAuthor?: string;
  sourceLicenseUrl?: string;
  sourceCheckedAt?: string;
  questions: ExamQuestion[];
};

export type WrongReason =
  | "concept-unknown"
  | "code-trace-error"
  | "calculation-error"
  | "misread-question"
  | "answer-format-error"
  | "guessed";

export type WrongAnswerHistory = {
  answeredAt: string;
  reason: WrongReason;
};

export type WrongAnswer = {
  questionId: string;
  attempts: number;
  reason: WrongReason;
  memoryRule: string;
  memo?: string;
  nextReviewAt: string;
  history: WrongAnswerHistory[];
  reviewStreak?: number;
  reviews?: { reviewedAt: string; remembered: boolean }[];
};

export type ExamAttempt = {
  sessionId: string;
  mode: "practice" | "mock";
  startedAt: string;
  submittedAt?: string;
  score?: number;
  answers: Record<string, string>;
};

export type StudyProgress = {
  certificateId: "information-processing-engineer";
  currentDay: number;
  activeTab: string;
  answers: Record<string, string>;
  wrongAnswers: WrongAnswer[];
  completedDays: number[];
  examAttempts: ExamAttempt[];
  activeSessionId?: string;
};
