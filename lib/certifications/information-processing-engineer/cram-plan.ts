export type CramBlock = { id: string; title: string; minutes: number; instructions: string[]; conceptIds: string[]; questionIds: string[] };
export const cramBlocks: CramBlock[] = [
  {
    id: "diagnosis", title: "진단 8문항", minutes: 30,
    instructions: ["문제당 3분, 마지막 6분은 채점과 분류. 모르면 넘어가고, 모른 문제를 기록하려면 ‘모름’이라고 직접 제출하세요.", "정답률을 예상 시험 점수로 환산하지 않습니다. 주소·호출·인덱스·용어 중 막힌 지점을 찾으세요."],
    conceptIds: [], questionIds: ["2024-2-01", "2024-2-06", "2024-2-13", "2024-2-18", "2024-3-13", "2026-1-11", "2025-2-19", "2024-1-09"],
  },
  {
    id: "c", title: "C: 주소부터 연결 리스트까지", minutes: 120,
    instructions: ["20분 주소·배열 → 25분 이중 포인터 → 35분 구조체·리스트 → 20분 함수·재귀·서식 → 20분 재풀이.", "종이에 ‘자기 주소 | 변수 이름 | 저장값’을 쓰세요. p 이동과 *p 변경을 분리하고, next가 바뀔 때마다 화살표를 다시 그립니다.", "타입 → 현재 주소 → 대입 반영 → 출력 시점 값 → 서식 순서. 마지막 2025년 1회 18번은 앞 문제를 풀었을 때 도전하세요."],
    conceptIds: ["c-pointer", "c-array", "c-double-pointer", "c-pointer-array", "c-struct", "c-call", "c-control", "c-recursion", "c-function-pointer"],
    questionIds: ["2024-2-18", "2026-1-01", "2024-2-13", "2024-3-16", "2025-2-14", "2024-2-19", "2024-3-12", "2025-2-16", "2025-2-18", "2024-3-07", "2026-1-12", "2025-1-18"],
  },
  {
    id: "java", title: "Java: 객체와 호출 순서", minutes: 90,
    instructions: ["15분 참조 → 20분 필드·메서드 → 20분 생성자 → 15분 오버로드 → 20분 예외·재귀.", "‘선언 타입 / 실제 객체 / 인자 타입 / 선택 메서드’를 쓰세요. 필드·static은 선언 타입, 재정의 인스턴스 메서드는 실제 객체를 확인합니다.", "2025년 1회 20번 주의: 첫 String 호출 뒤 int 오버로드로 넘어갑니다. 이후 모든 호출이 n-3인 것은 아닙니다. 8분 막히면 규칙을 확인하고 답을 가려 재풀이하세요."],
    conceptIds: ["java-memory", "java-binding", "java-super", "java-overload", "java-generics", "java-lambda", "java-exception", "java-recursion", "java-output"],
    questionIds: ["2025-2-05", "2025-2-15", "2024-3-11", "2025-2-10", "2025-1-13", "2026-1-07", "2024-3-19", "2025-2-09", "2025-1-20"],
  },
  {
    id: "python", title: "Python: 슬라이싱·복사·메서드", minutes: 75,
    instructions: ["25분 슬라이싱 → 20분 얕은 복사 → 15분 문자열·순회 → 15분 dict·set.", "슬라이싱은 인덱스를 나열하고 끝은 제외하세요. 음수 step, 생략한 끝과 명시한 -1을 구분합니다. 연속 슬라이싱은 중간 결과에 인덱스를 다시 붙입니다.", "append/extend/pop/remove/sort/sorted/reverse/split/join/range/len/sum/enumerate/zip/map/filter/items/values/get을 우선. 입력·원본 변화·반환값을 구분하고 사전 전체 암기는 하지 마세요."],
    conceptIds: ["python-slice", "python-copy", "python-methods", "python-strings", "python-collections", "python-comprehension", "python-functions", "python-reference"],
    questionIds: ["2026-1-13", "2024-2-06", "2026-1-14", "2026-1-08", "2025-3-09", "2025-2-17"],
  },
  {
    id: "sql", title: "SQL: 아는 문제를 확실히", minutes: 45,
    instructions: ["10분 규칙 회상 → 25분 풀이 → 10분 오답. 조인 결과 행을 직접 만들어 개수를 세세요.", "COUNT(*)와 COUNT(열), NULL 제외, ON/WHERE, AND 우선, HAVING, 상관 서브쿼리를 확인하세요. 시간이 남으면 마지막 디비전 문제를 풉니다."],
    conceptIds: ["sql-join", "sql-null", "sql-order", "sql-subquery", "db-transaction"],
    questionIds: ["2026-1-09", "2026-1-10", "2026-1-18", "2024-3-03", "2025-3-20", "2025-3-14"],
  },
  {
    id: "theory", title: "테스트·설계·DB", minutes: 60,
    instructions: ["15분 테스트 → 10분 결합도·응집도 → 20분 패턴 → 15분 DB. 정의를 가리고 이름을 말하세요.", "Bridge/Observer/Adapter/Proxy/Iterator/Abstract Factory/Factory Method/Singleton 우선. UML은 삼각형·마름모 위치와 실선·점선을 구분합니다.", "키의 유일성·최소성, ACID, 1NF/2NF/3NF/BCNF를 확인하세요. 우연히 값이 같다는 이유만으로 함수 종속을 확정하지 않습니다."],
    conceptIds: ["testing", "coupling-cohesion", "patterns-uml", "db-normalization", "db-transaction"],
    questionIds: ["2026-1-02", "2026-1-03", "2026-1-19", "2026-1-20", "2024-2-09", "2024-2-10", "2024-2-16", "2024-3-13", "2024-3-14", "2024-3-15"],
  },
  {
    id: "network", title: "네트워크: 계산과 프로토콜", minutes: 45,
    instructions: ["20분 서브넷 → 25분 프로토콜. /26은 64개 단위, /23은 세 번째 옥텟 2개 단위입니다.", "192.168.4.70/26 → 망 .64, 방송 .127, 일반 호스트 62개. RIP=홉·거리 벡터, OSPF=링크 상태, ARP=IP→MAC. HDLC I/S/U와 ABM/ARM을 구분하세요."],
    conceptIds: ["network-subnet", "network-layers", "network-routing"],
    questionIds: ["2025-2-06", "2026-1-11", "2026-1-06", "2025-1-06"],
  },
  {
    id: "security", title: "보안: 공격 행동으로 구분", minutes: 45,
    instructions: ["25분 공격 구분 → 20분 인증·암호. 자주 가는 사이트=워터링홀, 표적 메시지=스피어피싱, 가짜 경고=스캐어웨어.", "도청/위조/세션 탈취, SQL Injection/XSS/CSRF/SSRF, TOCTOU를 행동으로 구분합니다. 소프트 링크는 심볼릭 링크의 다른 이름입니다.", "CIA·AAA·DAC/MAC/RBAC·IDS/IPS/WAF 확인. AES 블록 128비트, 개인키 서명·공개키 검증, OAuth는 권한 위임."],
    conceptIds: ["security-attacks", "security-web", "security-basics", "security-crypto"],
    questionIds: ["2025-1-01", "2025-1-04", "2025-2-19", "2025-3-13", "2025-3-18", "2026-1-15", "2026-1-16"],
  },
  {
    id: "os", title: "운영체제: 표로 계산", minutes: 30,
    instructions: ["15분 SRT → 10분 페이지 교체 → 5분 교착. 간트 차트와 프레임 표를 직접 그리세요.", "대기=완료-도착-실행. LRU는 적중해도 최근 사용 갱신, FIFO는 적재 순서. 빈 프레임 적재도 페이지 부재입니다.", "교착: 상호배제·점유대기·비선점·순환대기. 은행원=회피, 페이징=내부 단편화, 세그먼테이션=외부 단편화."],
    conceptIds: ["os-scheduling", "os-page", "os-deadlock"], questionIds: ["2024-2-12", "2024-1-09"],
  },
  {
    id: "mock", title: "2026년 2회 압축 점검", minutes: 90,
    instructions: ["2026년 2회 전체를 ‘시간 제한 없이 연습 시작’으로 열고, 별도 시계로 90분 동안 풉니다. 허브의 150분 모의고사 타이머와 다른 학습용 압축 시간입니다.", "처음 10분 훑기 → 아는 단답·SQL부터 → 코드 8분 막히면 표시 후 이동 → 마지막 10분 빈칸과 형식 확인.", "이 구간은 회차 전체를 제출하므로 미응답도 오답 처리됩니다. 앞 구간의 개별 제출과 구분하세요."],
    conceptIds: [], questionIds: [],
  },
  {
    id: "review", title: "오답 재풀이와 최종 회상", minutes: 90,
    instructions: ["20분 채점 확인 → 50분 점수로 바꿀 오답 재풀이 → 20분 빈 종이 회상. 틀린 이유와 다음에 적용할 규칙을 한 줄씩 적으세요.", "70점 이상: 불안한 코드·오답 안정화. 60~65점: 기본 코드·SQL·용어에서 두 문제 더. 55점 이하: 코드·SQL 기본 25분 + 이론 25분.", "답을 보고 이해한 것은 확보 점수가 아닙니다. 답을 가리고 다시 푸세요. 기존 오답 기록은 정답을 맞혀도 삭제하지 않습니다."],
    conceptIds: [], questionIds: [],
  },
];
