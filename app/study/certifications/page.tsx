import Link from "next/link";

export default function CertificationsPage() {
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-brand">Study / certifications</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">자격증 학습 기록</h1><Link href="/study/certifications/information-processing-engineer" className="mt-8 block rounded border border-border bg-card p-5 transition-colors hover:border-brand/50"><p className="font-mono text-xs text-brand">ACTIVE</p><h2 className="mt-2 text-xl font-semibold">정보처리기사 실기</h2><p className="mt-2 text-sm text-muted-foreground">10일 플랜, 기출 자동채점, 오답노트, 암기카드</p></Link></main>;
}
