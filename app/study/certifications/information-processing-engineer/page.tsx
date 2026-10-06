import type { Metadata } from "next";

import { InformationProcessingEngineerHub } from "@/components/certification-study/information-processing-engineer-hub";

export const metadata: Metadata = {
  title: "정보처리기사 실기 학습 허브",
  description: "기출 자동채점과 오답 복습을 지원하는 정보처리기사 실기 학습 기록입니다.",
};

export default function InformationProcessingEngineerPage() {
  return <InformationProcessingEngineerHub />;
}
