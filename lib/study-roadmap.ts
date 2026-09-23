export type StudyRoadmapTrack = {
  step: number
  title: string
  description: string
  categories: string[]
}

/** 현재 노트의 양이 아니라, 개념이 쌓이는 순서를 보여주는 개인 학습 지도. */
export const studyRoadmap: StudyRoadmapTrack[] = [
  {
    step: 1,
    title: 'CS와 Java 런타임',
    description: '자료구조, 메모리, 동시성처럼 다른 기술을 이해하는 기반부터 다집니다.',
    categories: ['cs', 'jvm']
  },
  {
    step: 2,
    title: 'API와 애플리케이션 설계',
    description: 'Spring, JPA, 테스트를 통해 요청이 도메인 로직과 데이터로 이어지는 흐름을 읽습니다.',
    categories: ['spring', 'jpa', 'testing']
  },
  {
    step: 3,
    title: '데이터와 검색',
    description: '트랜잭션과 인덱스에서 출발해 검색 품질과 추천 파이프라인까지 확장합니다.',
    categories: ['database', 'es']
  },
  {
    step: 4,
    title: '분산 시스템과 서비스 경계',
    description: '이벤트, 메시지, 멱등성, 장애 전파를 서비스 간 계약의 관점에서 연결합니다.',
    categories: ['msa']
  },
  {
    step: 5,
    title: '배포와 운영',
    description: 'AWS와 컨테이너, Kubernetes, CI/CD를 실제 운영 검증의 흐름으로 묶습니다.',
    categories: ['aws', 'docker', 'kubernetes', 'cicd']
  }
]
