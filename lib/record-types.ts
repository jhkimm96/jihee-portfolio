/**
 * 이 사이트가 모으는 네 가지 기록 타입의 정식 명칭.
 *
 * 홈 히어로 카운터, 프로젝트 카드, /engineering 허브, 프로젝트 상세 탭이 모두 여기서 이름을
 * 가져간다. 같은 타입이 화면마다 다른 이름으로 불리면 분류 체계 자체가 전달되지 않으므로,
 * 이름을 바꿀 일이 생기면 반드시 이 파일만 고친다.
 *
 * 목록 페이지 제목과 Recent Activity 배지는 의도적으로 영문을 유지한다(섹션 라벨 한정 영문 혼용).
 */

export type RecordTypeKey = 'troubleshooting' | 'decisions' | 'reviews' | 'quality'

export interface RecordType {
  key: RecordTypeKey
  label: string
  href: string
  description: string
}

export const RECORD_TYPES: readonly RecordType[] = [
  {
    key: 'troubleshooting',
    label: '문제 해결',
    href: '/troubleshooting',
    description: '증상부터 원인, 해결과 재발 방지까지 기록한 트러블슈팅'
  },
  {
    key: 'decisions',
    label: '설계 판단',
    href: '/decisions',
    description: '선택지와 트레이드오프, 변경 이유를 남긴 Architecture Decision Record'
  },
  {
    key: 'reviews',
    label: '리뷰',
    href: '/reviews',
    description: '구현을 다시 읽고 발견한 문제와 후속 개선 과제'
  },
  {
    key: 'quality',
    label: '코드 품질',
    href: '/quality',
    description: '의미 있는 변경 시점에 측정한 서비스별 품질 스냅샷과 추세'
  }
] as const

/** 타입별 개수를 붙이고, 아직 기록이 없는 타입은 떨어뜨린다. */
export function withCounts(counts: Record<RecordTypeKey, number>) {
  return RECORD_TYPES.map((type) => ({ ...type, count: counts[type.key] })).filter((type) => type.count > 0)
}
