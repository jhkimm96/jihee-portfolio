import type { ExamSession } from "./types";

export const examSessions: ExamSession[] = [
  {
    "id": "2026-1",
    "label": "2026년 1회",
    "sourceUrl": "https://chobopark.tistory.com/561",
    "questions": [
      {
        "id": "2026-1-01",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "106.00",
        "acceptedAnswers": [
          "106.00"
        ],
        "explanation": "두 함수 모두 10개 원소의 합(530)을 개수(10)로 나눈 평균 53.0을 반환하며, 배열 인덱스 접근이든 포인터 연산이든 결과는 동일하다. 53.0+53.0=106.0, %.2f 서식이므로 소수점 두 자리까지 정확히 '106.00'이 출력된다(106, 106.0은 오답).",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "106.00",
        "code": "#include <stdio.h>\n \ndouble arr1(int p[], int len) {\n    double av = 0;\n    int i;\n    for (i = 0; i < len; i++) {\n        av += (double) p[i];\n    }\n    return av / len;\n}\n \ndouble arr2(int * p, int len) {\n    double av = 0;\n    int i;\n    for (i = 0; i < len; i++) {\n        av += (double)( * (p + i));\n    }\n    return av / len;\n}\n \nint main() {\n    int arr[10] = {\n        80,\n        20,\n        50,\n        55,\n        45,\n        95,\n        55,\n        10,\n        40,\n        80\n    };\n    int len = 10;\n \n    printf(\"%.2f\", arr1(arr, len) + arr2(arr, len));\n \n    return 0;\n}"
      },
      {
        "id": "2026-1-02",
        "prompt": "다음 설명에 해당하는 디자인 패턴의 유형을 괄호( ) 안에 쓰시오.\n\n• ( ㄱ ) 패턴은 기능의 클래스 계층과 구현의 클래스 계층을 연결 • ( ㄴ ) 패턴은 한 객체의 상태가 바뀌면 그 객체에 의존",
        "answer": "ㄱ. Bridge  ㄴ. Observer",
        "acceptedAnswers": [
          "ㄱ. Bridge  ㄴ. Observer",
          "ㄱ. Bridge ㄴ. Observer",
          "Bridge Observer"
        ],
        "explanation": "Bridge는 추상층(기능)과 구현층을 분리해 연결하는 구조 패턴, Observer는 상태 변화를 통지하는 행위 패턴 — 정의 문구 자체가 정답을 가리키는 대표 빈출 유형.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ. Bridge ㄴ. Observer"
      },
      {
        "id": "2026-1-03",
        "prompt": "데이터베이스(DB) 설계 절차를 순서대로 나타낸 것이다. 각 빈칸에 들어갈 알맞은 용어를 쓰시오.",
        "answer": "요구사항 분석\n개념적 설계\n논리적 설계\n물리적 설계\n구현",
        "acceptedAnswers": [
          "요구사항 분석\n개념적 설계\n논리적 설계\n물리적 설계\n구현",
          "ㄱ.요구사항 분석 ㄴ.개념적 설계 ㄷ.논리적 설계 ㄹ.물리적 설계 ㅁ.구현"
        ],
        "explanation": "요구사항 분석 → 개념적 설계 → 논리적 설계 → 물리적 설계 → 구현의 다섯 단계 전체를 순서대로 적는다.",
        "tags": [
          "DB설계"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ.요구사항 분석 ㄴ.개념적 설계 ㄷ.논리적 설계 ㄹ.물리적 설계 ㅁ.구현",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2026-1-03-1.png",
            "alt": "2026년 1회 3번 원문 입력 자료",
            "width": 585,
            "height": 754
          }
        ]
      },
      {
        "id": "2026-1-04",
        "prompt": "다음은 비기능적 요구사항에 대한 설명이다. 각 항목이 의미하는 요구사항 유형을 보기에서 골라 쓰시오. 1. 시스템 운영 중 로그 관리 및 모니터링 기능을 제공해야 한다. 2. 시스템 운영 시 최소 메모리 용량을 확보해야 하며, 자원 사용량은 제한 범위 내에 있어야 한다. 3. 사용자 요청에 대한 응답 시간은 최대 1분을 초과하지 않아야 한다.\n\n보기\n\n신뢰성, 가용성, 운영, 유지보수성, 자원, 성능, 이식성 ,보안, 품질",
        "answer": "1. 운영  2. 자원  3. 성능",
        "acceptedAnswers": [
          "1. 운영  2. 자원  3. 성능",
          "1. 운영 2. 자원 3. 성능",
          "운영 자원 성능"
        ],
        "explanation": "운영(시스템 가동 관리), 자원(CPU·메모리 등 리소스 제한), 성능(응답속도) — 보기(신뢰성/가용성/운영/유지보수성/자원/성능/이식성/보안/품질) 중 지문 키워드로 구분.",
        "tags": [
          "비기능요구사항"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 운영 2. 자원 3. 성능"
      },
      {
        "id": "2026-1-05",
        "prompt": "다음 용어의 영문 약자를 쓰시오.",
        "answer": "ISMS",
        "acceptedAnswers": [
          "ISMS"
        ],
        "explanation": "Information Security Management System — 조직의 정보보호 관리적·기술적 보호조치 인증제도.",
        "tags": [
          "영문약자"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ISMS"
      },
      {
        "id": "2026-1-06",
        "prompt": "HDLC는 비트 중심의 데이터 링크 제어 프로토콜로, 프레임 단위로 데이터를 전송하며 흐름 제어 및 오류 복구 기능을 제공한다. 다음 설명을 읽고 알맞은 용어를 쓰시오.\n\nHDLC 구성 요소",
        "answer": "1. 정보(프레임)  2. 감독(프레임)  3. 비번호(프레임)  4. 비동기균형모드  5. 비동기응답모드",
        "acceptedAnswers": [
          "1. 정보(프레임)  2. 감독(프레임)  3. 비번호(프레임)  4. 비동기균형모드  5. 비동기응답모드",
          "1. 정보 2. 감독 3. 비번호 4. 비동기 균형 모드 5. 비동기 응답 모드",
          "정보 감독 비번호 비동기 균형 모드 비동기 응답 모드"
        ],
        "explanation": "HDLC 프레임 3종(정보/감독/비번호)과 전송모드(정규응답모드NRM/비동기응답모드ARM/비동기균형모드ABM)를 묻는 문제로 라이브 특강 단골 주제.",
        "tags": [
          "HDLC"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 정보 2. 감독 3. 비번호 4. 비동기 균형 모드 5. 비동기 응답 모드"
      },
      {
        "id": "2026-1-07",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "2",
        "acceptedAnswers": [
          "2"
        ],
        "explanation": "A.g() 내부의 f(\"a\") 호출은 컴파일 시점에 A 타입 기준 f(Object)로 정적 결합되며, 오버로드 선택은 항상 컴파일타임에 고정된다. 실행 시에는 다형성으로 재정의된 B.f(Object)가 호출되어 \"2\"가 반환된다 — 오버로딩과 오버라이딩을 함께 묻는 함정 문제.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "2",
        "code": "class A {\n    String f(Object x) {\n        return \"1\";\n    }\n    \n    String g() {\n        return f(\"a\"); \n    }\n}\n \nclass B extends A {\n    String f(Object x) {\n        return \"2\";\n    }\n    \n    String f(String x) {\n        return \"3\";\n    }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        A a = new B();\n        System.out.println(a.g());\n    }\n}"
      },
      {
        "id": "2026-1-08",
        "prompt": "아래 파이썬 코드가 있다. 입력값으로 HumanDev를 주었을 때 출력되는 결과를 쓰시오.",
        "answer": "veDamuH",
        "acceptedAnswers": [
          "veDamuH"
        ],
        "explanation": "'HumanDev'를 뒤집으면 'veDnamuH'. 이 중 'o','n','g'에 해당하는 문자만 제거하면 'n' 한 글자가 빠져 'veDamuH'가 된다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "veDamuH",
        "code": "i = input()\nx = []\n \nfor word in i.split():\n    x.append(word)\n \ny = ''.join(x)\nz = ''.join(c for c in y[::-1] if c not in 'ong')\n \nprint(z)"
      },
      {
        "id": "2026-1-09",
        "prompt": "아래 조건을 참고하여 각 SQL 구문을 실행했을 때 반환되는 행(Row)의 수를 쓰시오. (단, DEPT 칼럼은 학과명이다.)\n\n테이블 조건\n\nSTUDENT 테이블에는 다음 세 학과의 학생 정보가 저장되어 있다. 컴퓨터과  50명  · 인터넷과  100명  · 사무자동화과  50 SQL 구문 1. SELECT DEPT FROM STUDENT; 2. SELECT DISTINCT DEPT FROM STUDENT; 3. SELECT COUNT(DISTINCT DEPT) FROM STUDENT WHERE DEPT = '컴퓨터과';",
        "answer": "① 200  ② 3  ③ 1",
        "acceptedAnswers": [
          "① 200  ② 3  ③ 1",
          "1. 200 2. 3 3. 1",
          "200 3 1"
        ],
        "explanation": "①은 전체 행(50+100+50=200), ②는 중복제거한 학과 종류(3), ③은 조건을 만족하는 학과가 1개뿐이므로 카운트도 1.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 200 2. 3 3. 1"
      },
      {
        "id": "2026-1-10",
        "prompt": "아래는 선수(PLAYER) 정보를 관리하는 테이블을 정의하는 SQL 문이다. 팀(TEAM) 테이블의 특정 칼럼을 참조하는 외래키 제약 조건을 추가하려 할 때, 괄호 ①~⑤에 들어갈 적절한 예약어(keyword) 또는 칼럼명을 아래 조건을 참고하여 쓰시오.\n\n조건\n\n외래키 제약 조건의 이름은 TEAM_TF 로 지정한다. PLAYER 테이블의 TEAM_ID 칼럼이 외래키 역할을 한다. TEAM 테이블의 TEAM_ID2 칼럼을 참조 대상으로 한다. SQL 문\n\nCREATE TABLE PLAYER ( PLAYER_ID  CHAR(7)     NOT NULL, PLAYER_NAME VARCHAR2(20) NOT NULL, TEAM_ID   CHAR(3)     NOT NULL, PRIMARY KEY (PLAYER_ID), ( 1 ) TEAM_TF ( 2 ) KEY ( 3 ) ( 4 ) TEAM ( 5 ) );",
        "answer": "① CONSTRAINT  ② FOREIGN  ③ TEAM_ID  ④ REFERENCES  ⑤ TEAM_ID2",
        "acceptedAnswers": [
          "① CONSTRAINT  ② FOREIGN  ③ TEAM_ID  ④ REFERENCES  ⑤ TEAM_ID2",
          "1. CONSTRAINT 2. FOREIGN 3. TEAM_ID 4. REFERENCES 5. TEAM_ID2",
          "CONSTRAINT FOREIGN TEAM_ID REFERENCES TEAM_ID2"
        ],
        "explanation": "CONSTRAINT 제약조건명 FOREIGN KEY(참조할 컬럼) REFERENCES 테이블명(참조되는 컬럼) 형식의 표준 FK 구문.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. CONSTRAINT 2. FOREIGN 3. TEAM_ID 4. REFERENCES 5. TEAM_ID2"
      },
      {
        "id": "2026-1-11",
        "prompt": "두 호스트 a, b의 IP 주소와 서브넷 마스크가 주어졌을 때, 각 호스트가 속한 네트워크 주소를 CIDR 표기법으로 쓰시오.\n\n조건 · 호스트 a의 IP 주소: 192.168.11.20 · 호스트 b의 IP 주소: 192.168.12.200 · 서브넷 마스크: 255.255.254.0 구하는 것 a. 호스트 a (192.168.11.20) 가 속한 네트워크 주소 b. 호스트 b (192.168.12.200) 가 속한 네트워크 주소",
        "answer": "a. 192.168.10.0/23   b. 192.168.12.0/23",
        "acceptedAnswers": [
          "a. 192.168.10.0/23   b. 192.168.12.0/23",
          "a. 192.168.10.0/23 b. 192.168.12.0/23",
          "192.168.10.0/23 192.168.12.0/23"
        ],
        "explanation": "/23은 3번째 옥텟이 2단위로 묶인다. 11은 10~11 묶음이라 네트워크 주소는 192.168.10.0, 12는 12~13 묶음이라 192.168.12.0.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "a. 192.168.10.0/23 b. 192.168.12.0/23"
      },
      {
        "id": "2026-1-12",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "20",
        "acceptedAnswers": [
          "20"
        ],
        "explanation": "dummy(n)은 n+1, 즉 n의 다음 int 원소(n[1]=32)의 주소를 반환한다. *mine.fn(n)은 그 주소를 역참조해 n[1]=32를 얻고, %x로 16진수 출력하면 32(10진)=0x20이므로 '20'.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "20",
        "code": "struct fns {\n    int* (*fn)(int*);\n} mine;\n \nint* dummy(int *d) {\n    return d + 1;\n}\n \nint main() {\n    struct fns mine;\n    int n[] = {16, 32};\n    mine.fn = dummy;\n    printf(\"%x\", *mine.fn(n));\n    return 0;\n}"
      },
      {
        "id": "2026-1-13",
        "prompt": "다음은 파이썬에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "9A7A5A3A1A",
        "acceptedAnswers": [
          "9A7A5A3A1A"
        ],
        "explanation": "range(10)=[0..9]에서 -2 스텝으로 끝에서부터 두 칸씩 건너뛰며 9,7,5,3,1을 얻고 각 값 뒤에 'A'를 붙여 출력한다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "9A7A5A3A1A",
        "code": "lst = list(range(10))\nfor c in lst[::-2]:\n    print(c, end='A')\nprint()"
      },
      {
        "id": "2026-1-14",
        "prompt": "아래 파이썬 코드를 실행했을 때 출력되는 값을 쓰시오.",
        "answer": "10",
        "acceptedAnswers": [
          "10"
        ],
        "explanation": "m[:]는 얕은 복사라 b의 각 원소는 m과 같은 리스트 객체를 참조한다. b[i+1]+=b[i]는 리스트 결합(extend)이라 원본 m의 리스트들도 함께 길어진다. 최종적으로 m의 각 리스트 길이 합은 4개 원소가 누적되어 10이 된다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "10",
        "code": "def f(a):\n    m = [[x] for x in a]\n    b = m[:]\n    for i in range(len(b) - 1):\n        b[i+1] += b[i]\n    return sum(len(x) for x in m)\n \nprint(f([1, 2, 3, 4]))"
      },
      {
        "id": "2026-1-15",
        "prompt": "다음은 특정 공격 기법에 대한 설명이다. 아래 내용을 읽고 해당하는 공격 기법을 [보기]에서 골라 쓰시오.\n\n원본 데이터 파일은 별도로 존재하며, 공격자는 해당 파일의 경로를 가리키는 특수 파일을 생성한다. 프로그램이 임시 파일을 생성하는 순간을 틈타 해당 임시 파일을 미리 준비한 특수 파일로 교체한다. 이후 프로그램이 임시 파일의 존재를 확인하면 교체된 파일을 정상으로 인식하고 동작하게 된다. 공격 절차 1. 공격자는 실제 파일이 아닌, 특정 파일의 경로를 참조하는 특수 파일을 미리 준비한다. 2. 프로그램이 임시 파일을 생성하는 시점을 노려 해당 임시 파일을 준비한 특수 파일로 교체한다. 3. 프로그램이 임시 파일의 존재 여부를 확인할 때, 조건에 부합하면 정상으로 판단하고 동작하며 부합하지 않으면 임시 파일을 삭제한다.\n\n[보기] 하드링크 / 심볼릭링크 / 소프트링크 / 정적링크 / 동적링크",
        "answer": "심볼릭링크",
        "acceptedAnswers": [
          "심볼릭링크"
        ],
        "explanation": "임시파일 존재 확인(check)과 실제 사용(use) 사이의 시간차를 노려 심볼릭링크로 바꿔치기하는 TOCTOU 계열 공격.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "심볼릭링크"
      },
      {
        "id": "2026-1-16",
        "prompt": "다음은 특정 보안 공격 기법에 대한 설명이다. 해당하는 공격 기법의 명칭을 쓰시오.\n\n공격자는 목표 대상이 업무 또는 관심사로 인해 자주 방문하는 합법적인 웹사이트를 사전에 파악한다.\n\n해당 사이트에 악성코드를 삽입하여 감염시켜 놓고, 피해자가 해당 사이트에 접속하는 순간 피해자의 시스템에 악성 프로그램이 자동으로 설치되도록 유도한다. 공격자는 불특정 다수를 노리는 것이 아니라 특정 조직이나 인물을 겨냥하며, 접속자의 IP나 환경 조건을 확인하여 목표 대상에게만 선택적으로 악성코드가 실행되도록 설계하는 경우도 있다.\n\n피해자는 정상적인 사이트를 방문했을 뿐이므로 감염 사실을 인지하기 어렵다는 특징이 있다.",
        "answer": "워터링 홀(Watering Hole)",
        "acceptedAnswers": [
          "워터링 홀(Watering Hole)",
          "워터링 홀 (Watering Hole)",
          "워터링 홀",
          "워터링홀",
          "Watering Hole",
          "워터링 홀",
          "워터링홀",
          "Watering Hole"
        ],
        "explanation": "불특정 다수가 아닌 특정 조직·인물을 겨냥해 자주 가는 사이트를 오염시켜 노리는 표적형 공격.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "워터링 홀 (Watering Hole)"
      },
      {
        "id": "2026-1-17",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "1123",
        "acceptedAnswers": [
          "1123"
        ],
        "explanation": "x1+x2는 둘 다 int라 정수덧셈으로 11이 되고, 이후 문자열 \"2\"를 만나는 순간부터 문자열 연결로 전환되어 \"11\"+\"2\"+\"3\"=\"1123\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "1123",
        "code": "public class Main {\n    public static void main(String[] args) {\n        int x1 = 9;\n        int x2 = 2;\n        String x3 = \"3\";\n        System.out.println(x1 + x2 + \"2\" + x3);\n    }\n}"
      },
      {
        "id": "2026-1-18",
        "prompt": "다음은 SQL에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.\n\nSELECT COUNT(*) FROM employee e JOIN dept d ON e.dep_id = d.dept_id WHERE d.budget > ( SELECT AVG(budget) FROM dept );",
        "answer": "2",
        "acceptedAnswers": [
          "2"
        ],
        "explanation": "서브쿼리로 평균예산을 구한 뒤 WHERE budget &gt; 평균 조건을 만족하는 부서 소속 직원 수를 COUNT — 2건.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "2",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2026-1-18-1.png",
            "alt": "2026년 1회 18번 원문 입력 자료",
            "width": 579,
            "height": 154
          }
        ]
      },
      {
        "id": "2026-1-19",
        "prompt": "다음은 통합 테스트에서 사용되는 더미 모듈에 대한 설명이다. 괄호 안에 들어갈 알맞은 용어를 쓰시오.\n\n( 1 ) 은/는 하위 모듈을 대신하여 단순한 결과값만 반환하도록 임시로 작성된 더미 모듈로, 하향식 통합 테스트 수행 시 필요하다. ( 2 ) 은/는 상위 모듈을 대신하여 하위 모듈의 데이터 입력과 출력을 확인하기 위한 더미 모듈로, 상향식 통합 테스트 수행 시 필요하다.",
        "answer": "1. 스텁(Stub)  2. 드라이버(Driver)",
        "acceptedAnswers": [
          "1. 스텁(Stub)  2. 드라이버(Driver)",
          "1. 스텁 2. 드라이버",
          "스텁 드라이버"
        ],
        "explanation": "하향식 통합테스트엔 스텁(아직 구현 안 된 하위모듈 대역), 상향식엔 드라이버(상위모듈 대역)가 필요.",
        "tags": [
          "테스트"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 스텁 2. 드라이버"
      },
      {
        "id": "2026-1-20",
        "prompt": "다음은 응집도의 유형에 대한 설명이다. 괄호 안에 들어갈 알맞은 용어를 쓰시오.\n\n( 1 ) 은/는 모듈이 다수의 관련 기능을 가질 때, 모듈 안의 구성요소들이 그 기능을 순차적으로 수행하는 경우의 응집도이다. ( 2 ) 은/는 동일한 입력과 출력을 사용하여 서로 다른 기능을 수행하는 활동들이 모여 있는 경우의 응집도이다. ( 3 ) 은/는 모듈 내부의 모든 기능이 단일한 목적을 위해 수행되는 경우의 응집도이다.",
        "answer": "1. 절차적  2. 교환적  3. 기능적",
        "acceptedAnswers": [
          "1. 절차적  2. 교환적  3. 기능적",
          "1. 절차 2. 교환 3. 기능",
          "절차 교환 기능"
        ],
        "explanation": "절차적(순서대로 실행), 교환적(입출력 동일, 기능 다름), 기능적(응집도 최상, 단일 목적).",
        "tags": [
          "응집도"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 절차 2. 교환 3. 기능"
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2025-3",
    "label": "2025년 3회",
    "sourceUrl": "https://chobopark.tistory.com/558",
    "questions": [
      {
        "id": "2025-3-01",
        "prompt": "다음은 UML (    ) 다이어그램이다. 아래 내용을 보고 다이어그램의 관계를 확인하여 명칭을 작성하시오.\n\n(   ) 다이어그램이란\n\n시스템을 폴더 모양의 (   ) 단위로 구분하여 구성 요소 간의 관계를 표현하는 UML 구조 다이어그램이다 .\n\n하나의 (   ) 안에는 여러 클래스나 하위 (   ) 가 포함될 수 있으며 ,\n\n(   ) 간에는 «import», «access», «merge» 등의 관계를 통해 의존성 (Dependency) 을 표현한다 .\n\n이 다이어그램은 코드의 실제 구조 ( 폴더 구조 ) 와 비슷하게 표현되기 때문에\n\n소프트웨어의 모듈화 , 재사용성 , 의존 관계를 시각적으로 설계할 때 자주 사용된다 .",
        "answer": "패키지 다이어그램",
        "acceptedAnswers": [
          "패키지 다이어그램",
          "패키지"
        ],
        "explanation": "코드의 실제 폴더 구조와 유사하게 모듈화·재사용성·의존관계를 시각화하는 UML 구조 다이어그램.",
        "tags": [
          "UML"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "패키지"
      },
      {
        "id": "2025-3-02",
        "prompt": "다음은 소프트웨어 테스트 기법 중 하나에 대한 설명이다.\n\n소프트웨어 테스트의 구조 기반 ( 화이트박스 ) 기법 중 하나로 ,\n\n결정 포인트 (Decision Point) 내에 존재하는 모든 개별 조건식 (Atomic Condition) 을 대상으로 하는 커버리지 기준이 있다 .\n\n하나의 결정문 ( 예 : if (A && B) 또는 if (X > 10 || Y == 0)) 안에는\n\n여러 개의 조건식이 포함될 수 있는데 이 커버리지는\n\n각각의 조건식이 True 와 False 두 가지 경우를 모두 한 번 이상 만족하도록\n\n테스트 케이스를 설계해야 한다 .\n\n즉 , 모든 개별 조건이 두 방향의 결과를 거쳐야 “ 커버되었다 ” 고 판단하지만\n\n그렇다고 해서 전체 결정식 (Decision Expression) 의 결과 (True/False) 가\n\n모두 수행된다고 보장하지는 않는다 .\n\n[보기]\n\nㄱ . 경로 (Path)\n\nㄴ . 결정 (Decision)\n\nㄷ . 조건 / 결정 (Condition/Decision)\n\nㄹ . 변경 조건 / 결정 (Modified Condition/Decision, MC/DC)\n\nㅁ . 다중 조건 (Multiple Condition)\n\nㅂ . 문장 (Statement)\n\nㅅ . 분기 (Branch)\n\nㅇ . 조건 (Condition)\n\nㅈ . 루프 (Loop)",
        "answer": "조건(Condition) 커버리지",
        "acceptedAnswers": [
          "조건(Condition) 커버리지",
          "ㅇ"
        ],
        "explanation": "결정 커버리지(전체 식의 참/거짓)와 달리, 조건 커버리지는 개별 원자조건 각각의 참/거짓만 만족하면 되므로 전체식 결과는 보장되지 않는다는 점이 핵심 구분 포인트.",
        "tags": [
          "테스트기법"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㅇ"
      },
      {
        "id": "2025-3-03",
        "prompt": "다음은 유닉스 (Unix) 또는 리눅스 (Linux) 환경에서 자주 사용하는 기본 명령어에 대한 설명이다 .\n\n각 설명에 맞는 명령어를 보기에서 골라 연결하시오 .",
        "answer": "1. pwd  2. ls  3. cd  4. cp",
        "acceptedAnswers": [
          "1. pwd  2. ls  3. cd  4. cp"
        ],
        "explanation": "pwd(print working directory), ls(list), cd(change directory), cp(copy) — 유닉스 최기본 명령어.",
        "tags": [
          "Unix/Linux"
        ],
        "gradingMode": "theory",
        "sourceAnswer": null,
        "verificationNote": "블로그에는 이 문항의 접힌 정답 영역이 없다. 기존 자료의 pwd, ls, cd, cp를 지문과 직접 대조해 확인한다."
      },
      {
        "id": "2025-3-04",
        "prompt": "파일을 복사한다 . ( )\n\n[보기]\n\nls, cd, cp, pwd\n\n( ① ) 코드는 전송 데이터에 여러 개의 검사 비트를 추가하여 오류를 검출하고 수정까지 가능한 방법이다 .\n\n이 코드는 재전송 없이 수신 측에서 자체 수정하는 ( ② ) 방식에 속한다 .\n\n이에 반해 오류 발생 시 송신 측에 재전송을 요구하는 방식은 ( ③ ) 이라 하며 , 여기에 포함되는 대표적 검출 기법으로 ( ④ ) 검사와 ( ⑤ ) 검사가 있다 .\n\n( ④ ) 검사는 데이터 블록 끝에 1 비트 검사 비트를 추가하여 오류를 검출한다 .\n\n( ⑤ ) 검사는 송신측과 수신측이 동일한 특정 다항식을 사용하여 오류를 검출한다 .\n\n[보기]\n\n㉠ CRC ㉡ FEC ㉢ BEC ㉣ NAK ㉤ Parity ㉥ MD5 ㉦ BCD ㉧ Hamming",
        "answer": "① Hamming  ② FEC  ③ BEC  ④ Parity  ⑤ CRC",
        "acceptedAnswers": [
          "① Hamming  ② FEC  ③ BEC  ④ Parity  ⑤ CRC",
          "1.pwd 2.ls 3.cd 4.cp",
          "pwd ls cd cp",
          "① ㉧ Hamming ② ㉡ FEC ③ ㉢ BEC ④ ㉤ Parity ⑤ ㉠ CRC",
          "㉧ Hamming ㉡ FEC ㉢ BEC ㉤ Parity ㉠ CRC"
        ],
        "explanation": "전진오류수정(FEC, 해밍코드)과 후진오류수정(BEC, 재전송요구 - 패리티/CRC검사)의 구분.",
        "tags": [
          "오류검출"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① ㉧ Hamming ② ㉡ FEC ③ ㉢ BEC ④ ㉤ Parity ⑤ ㉠ CRC"
      },
      {
        "id": "2025-3-05",
        "prompt": "다음은 C코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "C",
        "acceptedAnswers": [
          "C"
        ],
        "explanation": "p는 {2,\"DC\"}를 가리키므로 p-&gt;i=2, p-&gt;g=\"DC\". p-&gt;g+(2-1)은 문자열 \"DC\"에서 1글자 뒤로 이동한 포인터, 즉 \"C\"부터 출력되어 결과는 'C'.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "C",
        "code": "#include <stdio.h>\n \nstruct Test {\n    int i;\n    const char *g;\n};\n \nint main() {\n    struct Test test[] = {{1, \"AB\"}, {2, \"DC\"}, {3, \"EB\"}}; \n    struct Test *p = &test[1]; \n    printf(\"%s\", p->g + (p->i - 1));\n    return 0;\n}"
      },
      {
        "id": "2025-3-06",
        "prompt": "다음은 C코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "E",
        "acceptedAnswers": [
          "E"
        ],
        "explanation": "문자열 길이는 15(인덱스 0~14). a=15이므로 str[13]. 뒤에서 두 번째 문자 'E'.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "E",
        "code": "#include <stdio.h>\n \nint main(void) {\n    char str[] = \"REPUBLICOFKOREA\";\n    int a = 0;\n \n    while (str[a] != '\\0')\n        ++a;\n \n    putchar(str[a - 2]);\n    return 0;\n}\n "
      },
      {
        "id": "2025-3-07",
        "prompt": "다음은 C코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "187",
        "acceptedAnswers": [
          "187"
        ],
        "explanation": "sum: 0→11→11*3+7=40→40*3+5=125. 125(01111101)^42(00101010)=87(01010111). 87+100=187.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "187",
        "code": "#include <stdio.h>\n \nstruct Node {\n    struct Node* next;\n    unsigned int x;\n};\n \nint main() {\n    struct Node t1 = { 0, 5u };\n    struct Node t2 = { 0, 7u };\n    struct Node t3 = { 0, 11u };\n \n    t3.next = &t2;\n    t2.next = &t1;\n \n    struct Node* curr = &t3;\n    int sum = 0;\n \n    while (curr) {\n        sum = sum * 3 + curr->x;\n        curr = curr->next;\n    }\n \n    sum = (sum ^ 42u) + 100u;\n \n    printf(\"%u\\n\", sum);\n}\n "
      },
      {
        "id": "2025-3-08",
        "prompt": "아래 코드는 Machine 이라는 인터페이스를 정의하고 WashingMachine 클래스에서 해당 인터페이스를 사용하고자 한다 . 빈칸에 들어갈 올바른 키워드를 작성하시오.",
        "answer": "implements",
        "acceptedAnswers": [
          "implements"
        ],
        "explanation": "클래스가 인터페이스를 구현할 때는 implements, 클래스를 상속할 때는 extends를 사용한다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "implements",
        "code": "interface Machine {\n    void run();\n}\n \nclass WashingMachine (____빈칸____) Machine {  \n    private String name;\n \n    public WashingMachine() {\n        this.name = \"LG Washer\";\n    }\n \n    public void run() {\n        System.out.println(\"Washing machine running\");\n    }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        WashingMachine wm = new WashingMachine();\n        wm.run();\n    }\n}"
      },
      {
        "id": "2025-3-09",
        "prompt": "다음은 파이썬에 대한 문제이다. 아래 코드를 확인하여 출력값에 알맞는 값을 작성하시오.\n\n[ 출력값 ]\n\n{0: ( ① , ② ), 1: ( ③ , ④ ), 2: ( ⑤ , ⑥ ), 3: ( ⑦ , ⑧ )}",
        "answer": "15\n5\n10\n3\n18\n5\n9\n2",
        "acceptedAnswers": [
          "15\n5\n10\n3\n18\n5\n9\n2",
          "① =15, ② =5, ③ =10, ④ =3, ⑤ =18, ⑥ =5, ⑦ =9, ⑧ =2",
          "15, 5, 10, 3, 18, 5, 9, 2"
        ],
        "explanation": "각 리스트의 sum과 len을 그대로 계산: [3,5,2,4,1]→15,5 / [4,5,1]→10,3 / [4,4,1,5,4]→18,5 / [4,5]→9,2.",
        "tags": [
          "Python"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① =15, ② =5, ③ =10, ④ =3, ⑤ =18, ⑥ =5, ⑦ =9, ⑧ =2",
        "code": "data = [\n    [3, 5, 2, 4, 1],\n    [4, 5, 1],\n    [4, 4, 1, 5, 4],\n    [4, 5]\n]\n \nresult = {}\n \nfor index, lis in enumerate(data):\n    list_sum = sum(lis)\n    list_len = len(lis)\n \n    result[index] = (list_sum, list_len)\n \nprint(result)\n ",
        "verificationNote": "출력값을 쓰는 문항이 아니라 출력된 딕셔너리의 빈칸 8개를 채우는 문항이다. ①부터 ⑧까지 순서대로 한 줄씩 입력한다."
      },
      {
        "id": "2025-3-10",
        "prompt": "다음은 테이블에서 조건값을 실행한 화면이다. 이에 대한 알맞는 결과값을 작성하시오.",
        "answer": "4",
        "acceptedAnswers": [
          "4"
        ],
        "explanation": "원문의 표/이미지를 기반으로 한 결과값 문제 — 정답은 4 (표 이미지는 원본 게시글에서 확인).",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "4",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-3-10-1.png",
            "alt": "2025년 3회 10번 원문 입력 자료",
            "width": 502,
            "height": 241
          }
        ]
      },
      {
        "id": "2025-3-11",
        "prompt": "다음 설명에 해당하는 인증 기술을 쓰시오 .\n\n한 번 사용하면 즉시 폐기되어 재사용이 불가능하다 .\n\n서버와 토큰 ( 또는 앱 ) 은 시간 동기화나 카운터 기반 방식으로 매번 새로운 값을 생성하고 , 내부 검증은 해시 함수를 이용한 방식으로 서버에 평문을 저장하지 않고도 유효성을 확인할 수 있다 .\n\n이 특성 때문에 은행 인증 등 고보안 영역에서 널리 사용되며 재전송 공격 방지와 사용자 편의성을 동시에 만족한다 .",
        "answer": "OTP",
        "acceptedAnswers": [
          "OTP"
        ],
        "explanation": "재전송 공격 방지와 사용자 편의성을 동시에 만족하는 일회용 비밀번호 방식으로 은행 인증 등 고보안 영역에서 활용.",
        "tags": [
          "인증기술"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "OTP"
      },
      {
        "id": "2025-3-12",
        "prompt": "다음은 Java 의 상속과 생성자 호출에 관한 코드이다 . 밑줄에 알맞은 단어를 작성하시오 .",
        "answer": "super",
        "acceptedAnswers": [
          "super"
        ],
        "explanation": "자식 클래스 생성자에서 부모 클래스 생성자를 명시적으로 호출할 때 super(인자...)를 사용.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "super",
        "code": "class Rectangle {\n \n    int width, height;\n \n    Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n}\n \nclass Square extends Rectangle {\n \n    Square(int a) {\n        ____(a,a);\n    }\n \n    int getSquareArea() {\n        return width * height;\n    }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        Square sq = new Square(10);\n        System.out.println(sq.getSquareArea());\n    }\n}\n "
      },
      {
        "id": "2025-3-13",
        "prompt": "다음은 인증 및 자원 접근 방식에 대한 설명이다 . 알맞은 단어를 작성하시오 .\n\n사용자가 새로운 사이트에 가입하지 않고 평소에 이용하던 서비스의 계정으로 로그인할 수 있게 해주는 기술이다 .\n\n사용자의 비밀번호는 절대 전달되지 않으며 사용자가 승인한 범위에 대해서만 접근 권한이 위임된다 .\n\n이 방식은 직접 인증 (Authentication) 을 수행하지 않고 \" 인가 (Authorization)\" 절차를 통해 접근 권한을 제 3 자에게 부여한다 .\n\n인증 완료 후 , 서비스 제공자는 Access Token 을 발급하며 애플리케이션은 이 토큰을 이용해 API 를 호출하여 필요한 정보에 접근한다 .\n\n대표적인 예는 소셜 로그인이며 SSO(Single Sign-On) 과 달리 동일 시스템 내 인증이 아니라 서로 다른 서비스 간의 권한 위임에 초점이 맞춰져 있다 .",
        "answer": "OAuth",
        "acceptedAnswers": [
          "OAuth"
        ],
        "explanation": "직접 인증이 아닌 '인가' 절차로 제3자에게 접근권한을 위임 — SSO(동일 시스템 내 인증)와 구분되는 포인트.",
        "tags": [
          "인증/인가"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "OAuth"
      },
      {
        "id": "2025-3-14",
        "prompt": "다음 아래의 테이블을 확인하여 R%S 의 결과를 테이블 형태로 기재하시오 .",
        "answer": "결과 테이블에 A 컬럼, 값 a1 한 행",
        "acceptedAnswers": [
          "결과 테이블에 A 컬럼, 값 a1 한 행",
          "A a1"
        ],
        "explanation": "나누기 연산은 R의 속성 중 S의 모든 값과 짝지어지는 튜플만 남기는 연산 — 표 이미지는 원본 게시글 참고.",
        "tags": [
          "관계대수"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "A a1",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-3-14-1.png",
            "alt": "2025년 3회 14번 원문 입력 자료",
            "width": 305,
            "height": 133
          }
        ]
      },
      {
        "id": "2025-3-15",
        "prompt": "다음은 C코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "0",
        "acceptedAnswers": [
          "0"
        ],
        "explanation": "y%3=1&lt;3 참→z=2. z&amp;(z&gt;&gt;1): 2(10)&amp;1(01)=0. x&gt;5(참)&amp;&amp;z&lt;=3(참) → z*x = 0*7 = 0.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "0",
        "code": "#include <stdio.h>\nint main() {\n    int x=7, y=4, z;\n    z = y%3<3 ? 2 : 1;\n    z = z & z >> 1;\n    z = x>5 && z<=3 ? z*x : z/x;\n    printf(\"%d\", z);\n    return 0;\n}"
      },
      {
        "id": "2025-3-16",
        "prompt": "관계형 데이터베이스 개념에 대한 설명이다 . 빈칸에 들어갈 용어를 < 보기 > 에서 골라 순서대로 쓰시오 .\n\nㄱ. 테이블에서 한 행 (Row) 을 의미하며 , 하나의 레코드를 구성하는 요소\n\nㄴ. 실제 데이터가 저장되어 있는 테이블의 내용 전체를 의미하며 , 데이터의 상태를 나타낸다 .\n\nㄷ. 테이블에 저장된 행 (Row) 의 총 개수를 의미한다 .\n\n[보기]\n\n스키마 (Structure) 속성 (Attribute) 튜플 (Tuple)\n\n차수 (Degree) 인스턴스 (Instance) 카디널리티 (Cardinality)",
        "answer": "ㄱ. 튜플  ㄴ. 인스턴스  ㄷ. 카디널리티",
        "acceptedAnswers": [
          "ㄱ. 튜플  ㄴ. 인스턴스  ㄷ. 카디널리티",
          "ㄱ . 튜플 ㄴ . 인스턴스 ㄷ . 카디널리티",
          "튜플 인스턴스 카디널리티"
        ],
        "explanation": "튜플(행), 인스턴스(현재 저장된 실제 데이터 상태), 카디널리티(행의 개수) — 스키마/차수(속성개수)와 혼동 주의.",
        "tags": [
          "DB개념"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ . 튜플 ㄴ . 인스턴스 ㄷ . 카디널리티"
      },
      {
        "id": "2025-3-17",
        "prompt": "다음은 Java에 대한 코드이다. 알맞는 출력값을 작성하시오.",
        "answer": "AB",
        "acceptedAnswers": [
          "AB"
        ],
        "explanation": "Tri.A.name()은 문자열 \"A\", 길이는 1. values()[1]은 B이므로 B.code()=\"AB\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "AB",
        "code": "enum Tri {\n    A(\"A\"), B(\"AB\"), C(\"ABC\");\n \n    private String code;\n \n    Tri(String code) {\n        this.code = code;\n    }\n \n    public String code() {\n        return code;\n    }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        Tri t = Tri.values()[Tri.A.name().length()];\n        System.out.print(t.code());\n    }\n}\n "
      },
      {
        "id": "2025-3-18",
        "prompt": "다음은 정보보안에서 사용하는 접근통제 (Access Control) 방식에 대한 설명이다 .\n\n설명에 해당하는 접근통제 모델을 < 보기 > 에서 골라 빈칸에 작성하시오 .\n\n[보기]\n\nDAC     MAC      RBAC",
        "answer": "ㄱ. MAC  ㄴ. RBAC  ㄷ. DAC",
        "acceptedAnswers": [
          "ㄱ. MAC  ㄴ. RBAC  ㄷ. DAC",
          "ㄱ. MAC ㄴ. RBAC ㄷ. DAC",
          "MAC RBAC DAC"
        ],
        "explanation": "MAC(강제접근통제, 등급기반)/RBAC(역할기반)/DAC(임의접근통제, 소유자 기반)의 정의 구분.",
        "tags": [
          "접근통제"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ. MAC ㄴ. RBAC ㄷ. DAC"
      },
      {
        "id": "2025-3-19",
        "prompt": "다음은 테스트케이스의 구성요소에 대한 설명이다. 괄호 ( ) 안에 들어갈 알맞는 보기를 고르시오.\n\n[보기]\n\nㄱ . 테스트 조건 ㄴ . 테스트 환경 ㄷ . 테스트 유형 ㄹ . 테스트 데이터\n\nㅁ . 예상 결과 ㅂ . 수행 단계 ㅅ . 성공 / 실패 기준",
        "answer": "ㄱ 테스트 조건 → ㄹ 테스트 데이터 → ㅁ 예상 결과",
        "acceptedAnswers": [
          "ㄱ 테스트 조건 → ㄹ 테스트 데이터 → ㅁ 예상 결과",
          "(왼쪽순으로) ㄱ ㄹ ㅁ"
        ],
        "explanation": "테스트케이스의 핵심 3요소(조건-데이터-예상결과) 순서를 묻는 문제.",
        "tags": [
          "테스트케이스"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(왼쪽순으로) ㄱ ㄹ ㅁ",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-3-19-1.png",
            "alt": "2025년 3회 19번 원문 입력 자료",
            "width": 597,
            "height": 135
          }
        ]
      },
      {
        "id": "2025-3-20",
        "prompt": "다음은 SQL 에 관한 문제이다 . 아래 A 테이블을 참고하여 쿼리의 결과를 작성하시오 .\n\n[ SQL ]\n\nSELECT count(col2) FROM A WHERE col1 IN (2, 3) OR col2 IN (3, 5)",
        "answer": "4",
        "acceptedAnswers": [
          "4"
        ],
        "explanation": "OR 조건으로 col1이 2/3이거나 col2가 3/5인 행을 모두 카운트 — 표 데이터 기준 4건.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "4",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-3-20-1.png",
            "alt": "2025년 3회 20번 원문 입력 자료",
            "width": 168,
            "height": 169
          }
        ]
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2025-2",
    "label": "2025년 2회",
    "sourceUrl": "https://chobopark.tistory.com/554",
    "questions": [
      {
        "id": "2025-2-01",
        "prompt": "다음은 파일 구조와 관련된 설명이다 . 설명을 읽고 괄호 안에 들어갈 가장 알맞은 용어를 작성하시오 .\n\n데이터베이스의 물리 설계 시 , 레코드에 접근하는 방법은 순차 접근 방법 , [ ] 방법 , 해싱 방법 등이 있다 .\n\n이 중 [ ] 방법은 레코드의 키 값과 포인터를 쌍으로 묶어 저장하며 검색 시 키 값을 기준으로 빠르게 탐색할 수 있도록 설계되어 있다 .\n\n이 방식은 검색 속도가 빠르며 < 키 값 , 포인터 > 쌍으로 구성된 자료 구조를 사용하여 해당 키가 가리키는 주소를 통해 원하는 레코드를 직접 찾을 수 있다 .",
        "answer": "인덱스(색인) 접근",
        "acceptedAnswers": [
          "인덱스(색인) 접근",
          "인덱스 or 색인",
          "인덱스",
          "색인",
          "인덱스 접근",
          "색인 접근",
          "인덱스",
          "색인",
          "인덱스 접근",
          "색인 접근"
        ],
        "explanation": "키-값 쌍 구조를 이용해 순차 탐색보다 빠르게 레코드를 찾는 물리적 접근 방법.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "인덱스 or 색인"
      },
      {
        "id": "2025-2-02",
        "prompt": "다음은 데이터베이스 릴레이션의 구성 요소 중 하나에 대한 설명이다 . 설명을 읽고 보기에서 알맞은 기호를 골라 작성하시오 .\n\n릴레이션 (Relation) 에서 열 (Column) 을 의미하며 데이터 항목의 속성 (Attribute) 또는 특성을 나타낸다 .\n\n각 열은 고유한 이름을 가지며 특정 도메인 (Domain) 에서 정의된 값을 갖는다 .\n\n예를 들어 \" 학생 \" 릴레이션에서 학번 , 이름 , 전공 등은 각각 하나의 열이며 이 열들은 학생의 고유한 속성을 나타낸다 .\n\n이 개념은 파일 구조에서의 필드 (Field) 에 해당하며 릴레이션에서 행 (Row, Tuple) 의 구성 요소가 된다 .\n\n[ 보기 ]\n\nㄱ . Cardinality\n\nㄴ . Domain\n\nㄷ . Attribute\n\nㅁ . Degree\n\nㅂ . Schema\n\nㅅ . Tuple",
        "answer": "Attribute",
        "acceptedAnswers": [
          "Attribute",
          "ㄷ. Attribute"
        ],
        "explanation": "파일 구조의 필드(Field)에 대응되는 개념으로, 하나의 열을 의미.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄷ. Attribute"
      },
      {
        "id": "2025-2-03",
        "prompt": "다음은 정보보안 관련 문제이다. 아래 내용을 보고 알맞는 단어를 작성하시오.\n\n원격 접속과 관련된 보안 프로토콜이며 암호화된 통신을 제공하는 보안 접속용 프로토콜이다 .\n\n공개키 기반의 인증 방식을 사용하며 암호화된 데이터 전송을 지원한다 .\n\n주로 원격 서버에 안전하게 접속할 때 사용되며 기본 포트 번호는 22 번이다 .\n\nTelnet 의 보안 취약점을 보완한 대안으로 널리 사용된다 .",
        "answer": "SSH",
        "acceptedAnswers": [
          "SSH"
        ],
        "explanation": "암호화된 통신으로 원격 서버 접속 시 사용하는 보안 프로토콜.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "SSH"
      },
      {
        "id": "2025-2-04",
        "prompt": "스케줄링 알고리즘에 관한 다음 설명을 읽고 (1) 과 (2) 에 알맞은 스케줄링 알고리즘의 명칭을 각각 쓰시오 .\n\n(1) CPU burst 시간이 짧은 프로세스를 우선적으로 처리하는 스케줄링 방식이다 . \"Shortest Next CPU Burst\" 라고도 불리며 선점형 또는 비선점형으로 구현될 수 있다 .\n\n(2) 위의 스케줄링 방식을 선점형으로 구현한 형태로 실행 중인 프로세스보다 더 짧은 burst 시간을 가진 프로세스가 도착하면 현재 CPU 를 선점한다 .",
        "answer": "(1) SJF  (2) SRT",
        "acceptedAnswers": [
          "(1) SJF  (2) SRT",
          "(1) SJF (Shortest Job First) (2) SRT (Shortest Remaining Time)"
        ],
        "explanation": "SJF는 비선점 가능, SRT(Shortest Remaining Time)는 실행 중에도 더 짧은 작업이 오면 선점하는 SJF의 선점형 버전.",
        "tags": [
          "스케줄링"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) SJF (Shortest Job First) (2) SRT (Shortest Remaining Time)"
      },
      {
        "id": "2025-2-05",
        "prompt": "다음은 Java의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "BB",
        "acceptedAnswers": [
          "BB"
        ],
        "explanation": "배열은 참조로 전달되어 data[0]이 실제로 \"B\"로 바뀌지만, String s는 값(참조값) 전달이라 메서드 내부의 재할당이 바깥 변수에 영향을 주지 않는다. 따라서 바깥의 s는 그대로 \"B\", 결과는 \"BB\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "BB",
        "code": "public class Main {\n    public static void change(String[] data, String s){\n        data[0] = s;\n        s = \"Z\";\n    }\n    \n    public static void main(String[] args) {\n        String data[] = { \"A\" };\n        String s = \"B\";\n        \n        change(data, s);\n        System.out.print(data[0] + s);\n    }\n}"
      },
      {
        "id": "2025-2-06",
        "prompt": "다음은 IP 주소와 서브넷 마스크에 관한 문제이다 . 주어진 정보를 참고하여 괄호 안에 들어갈 알맞은 값을 쓰시오 .\n\n호스트의 IP 주소가 223.13.234.132 이고 서브넷 마스크가 255.255.255.192 일 때 다음 물음에 답하시오 .\n\n이 호스트가 속한 네트워크 주소는 223.13.234.( ① ) 이다 .\n\n이 네트워크에서 사용 가능한 호스트 수는 ( ② ) 개이다 .\n\n( 단 , 네트워크 주소와 브로드캐스트 주소는 제외한다 .)",
        "answer": "① 128  ② 62",
        "acceptedAnswers": [
          "① 128  ② 62",
          "① 128 ② 62",
          "128 62"
        ],
        "explanation": "/26은 마지막 옥텟이 64단위 블록. 132는 128~191 블록에 속해 네트워크주소는 ...128, 호스트 비트 6개이므로 2^6-2=62개 사용 가능.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① 128 ② 62"
      },
      {
        "id": "2025-2-07",
        "prompt": "다음은 디자인 패턴에 관한 문제이다. 아래 내용을 보고 알맞는 단어를 작성하시오.\n\n어떤 객체에 대한 접근을 제어하거나 추가적인 기능을 부여하기 위해 해당 객체의 대리 객체를 사용하는 방식의 디자인 패턴이다 .\n\n실제 객체에 대한 접근 전에 필요한 작업을 수행할 수 있으며 실제 객체의 생성을 지연시켜 메모리와 자원을 절약할 수 있 다 .\n\n또한 , 실제 객체를 감추어 정보은닉을 강화할 수 있다는 장점이 있다 .",
        "answer": "Proxy",
        "acceptedAnswers": [
          "Proxy"
        ],
        "explanation": "실제 객체 앞단에서 접근 통제·지연 로딩·정보 은닉을 담당하는 구조 패턴.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "Proxy"
      },
      {
        "id": "2025-2-08",
        "prompt": "다음은 웹 데이터 교환 방식에 관한 문제이다 . 아래 설명을 읽고 괄호 안에 들어갈 알맞은 용어를 작성하시오 .\n\n( ) 은 / 는 웹 페이지 전체를 다시 불러오지 않고 JavaScript 와 XML( 또는 JSON) 을 이용하여 일부 콘텐츠만 비동기적으로 갱신할 수 있는 기술이다 .\n\n( ) 은 / 는 HTML 만으로는 구현하기 어려운 동적인 기능들을 가능하게 하여 사용자가 웹 페이지와 보다 자유롭게 상호작용할 수 있도록 해주는 웹 개발 기법이다 .",
        "answer": "AJAX",
        "acceptedAnswers": [
          "AJAX"
        ],
        "explanation": "HTML만으로 어려운 동적 갱신을 가능케 하는 비동기 웹 통신 기법.",
        "tags": [
          "웹기술"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "AJAX"
      },
      {
        "id": "2025-2-09",
        "prompt": "다음은 Java언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "19",
        "acceptedAnswers": [
          "19"
        ],
        "explanation": "첫 번째 run(f): apply(3)에서 x&gt;2가 참이라 예외 발생 → catch에서 7 반환. 두 번째 run(다른 람다): 예외 없이 3+9=12 반환. 7+12=19.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "19",
        "code": "public class Main {\n \n    static interface F {\n        int apply(int x) throws Exception;\n    }\n \n    public static int run(F f) {\n        try {\n            return f.apply(3);\n        } catch (Exception e) {\n            return 7;\n        }\n    }\n \n    public static void main(String[] args) {\n \n        F f = (x) -> {\n            if (x > 2) {\n                throw new Exception();\n            }\n            return x * 2;\n        };\n \n        System.out.print(run(f) + run((int n) -> n + 9));\n    }\n \n}"
      },
      {
        "id": "2025-2-10",
        "prompt": "다음은 Java언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "5P",
        "acceptedAnswers": [
          "5P"
        ],
        "explanation": "인스턴스 메서드 x(int)는 동적바인딩되어 Child.x(2)=5가 호출되지만, static 메서드 id()는 오버라이딩 대상이 아니라 선언(참조) 타입 Parent 기준으로 정적 결합되어 \"P\"가 나온다. 결과 \"5P\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "5P",
        "code": "public class Main{\n \n    public static class Parent {\n \n        public int x(int i) { return i + 2; }\n        public static String id() { return \"P\";}\n        \n    }\n \n    public static class Child extends Parent {\n        \n        public int x(int i) { return i + 3; }\n        public String x(String s) { return s + \"R\"; }\n        public static String id() { return \"C\"; }\n        \n    }\n \n    public static void main(String[] args) {\n \n        Parent ref = new Child();\n        System.out.println(ref.x(2) + ref.id());\n        \n    }\n    \n}"
      },
      {
        "id": "2025-2-11",
        "prompt": "다음 아래 제어 흐름 그래프가 분기 커버리지를 만족하기 위한 테스팅 순서를 쓰시오.",
        "answer": "1234561, 124567  또는  1234567, 124561",
        "acceptedAnswers": [
          "1234561, 124567",
          "1234567, 124561"
        ],
        "explanation": "모든 분기(if의 참/거짓)를 최소 1회 지나가도록 두 개의 경로 조합을 구성하면 되는 문제.",
        "tags": [
          "테스트"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1234561, 124567  or 1234567, 124561",
        "verificationNote": "원문도 두 가지 결과를 병기한다. 평가 순서에 영향을 받는 코드이므로 단일한 표준 C 정답으로 일반화하지 않는다.",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-2-11-1.png",
            "alt": "2025년 2회 11번 원문 입력 자료",
            "width": 678,
            "height": 405
          }
        ]
      },
      {
        "id": "2025-2-12",
        "prompt": "다음은 C언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "2 그리고 3",
        "acceptedAnswers": [
          "2 그리고 3"
        ],
        "explanation": "enq(1),enq(2) 후 큐는 [1,2]. deq()로 1이 빠지고 [2]. enq(3)으로 [2,3]. 이후 deq() 두 번이면 2, 3 순서로 나온다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "2 그리고 3",
        "code": "#include <stdio.h>\n#define SIZE 3\n \ntypedef struct {\n    int a[SIZE];\n    int front;\n    int rear;\n} Queue;\n \nvoid enq(Queue* q, int val){\n    q->a[q->rear] = val; \n    q->rear = (q->rear + 1) % SIZE;\n}\n \nint deq(Queue* q) {\n    int val = q->a[q->front];\n    q->front = (q->front + 1) % SIZE;\n    return val;\n}\n \nint main() {\n    Queue q = {{0}, 0, 0};\n \n    enq(&q,1); enq(&q,2); deq(&q); enq(&q, 3);\n    \n    int first = deq(&q);\n    int second = deq(&q);\n    printf(\"%d 그리고 %d\", first, second);\n    \n    return 0;\n}\n "
      },
      {
        "id": "2025-2-13",
        "prompt": "라운드로빈(RR) 방식을 이용하고 아래 내용을 참고하여 평균대기시간을 구하시오.\n\n운영체제에서 라운드로빈 (Round Robin, RR) 스케줄링은 각 프로세스에 동일한 시간 할당량 ( 타임 퀀텀 ) 을 순차적으로 부여하며 CPU 를 할당하는 방식이다 .\n\n다음은 4 개의 프로세스가 서로 다른 시간에 도착하며 각기 다른 실행 시간을 가지는 상황이다 . 이때 시간 할당량은 4ms 이고 컨텍스트 스위칭 시간은 무시한다고 가정한다 .\n\n아래 정보를 바탕으로 라운드로빈 (RR) 방식으로 CPU 스케줄링을 수행할 경우 모든 프로세스의 평균 대기시간 (Average Waiting Time) 은 얼마인가 ?",
        "answer": "11.75ms",
        "acceptedAnswers": [
          "11.75ms",
          "75ms"
        ],
        "explanation": "각 프로세스가 4ms씩 번갈아 실행되며 발생하는 대기시간을 모두 합산해 4로 나눈 값.",
        "tags": [
          "스케줄링"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "11.75ms"
      },
      {
        "id": "2025-2-14",
        "prompt": "다음은 C언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "5 그리고 6",
        "acceptedAnswers": [
          "5 그리고 6"
        ],
        "explanation": "(*pptr)는 ptr과 같으므로 (*pptr)[1]은 a[1]을 의미한다. a[1]에 a[2]의 값을 그대로 대입하는 것이므로 a[1]={5,6}이 된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "5 그리고 6",
        "code": "#include <stdio.h>\n \nstruct dat {\n    int x;\n    int y;\n};\n \nint main() {\n    struct dat a[] = {{1, 2}, {3, 4}, {5, 6}};\n    struct dat* ptr = a;\n    struct dat** pptr = &ptr;\n \n    (*pptr)[1] = (*pptr)[2];\n    printf(\"%d 그리고 %d\", a[1].x, a[1].y);\n \n    return 0;\n}\n "
      },
      {
        "id": "2025-2-15",
        "prompt": "다음은 Java언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "1a3b3",
        "acceptedAnswers": [
          "1a3b3"
        ],
        "explanation": "배열 원소를 교환해도 a,b,c 객체 자체(v값)는 안 바뀌고 배열 안의 참조 위치만 바뀐다. 교환 후 arr[0]은 원래 c(v=3)를 가리키므로 arr[1].v=3이 되어 b.v가 3으로 바뀐다. 최종 a.v=1, b.v=3, c.v=3 → \"1a3b3\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "1a3b3",
        "code": "public class Main{\n    public static class BO {\n        public int v;\n        public BO(int v) {\n            this.v = v;\n        }\n    }\n    public static void main(String[] args) {\n        BO a = new BO(1);\n        BO b = new BO(2);\n        BO c = new BO(3);\n        BO[] arr = {a, b, c};\n        BO t = arr[0];\n        arr[0] = arr[2];\n        arr[2] = t;\n        arr[1].v = arr[0].v;\n        System.out.println(a.v + \"a\" + b.v + \"b\" + c.v);\n    }\n}\n "
      },
      {
        "id": "2025-2-16",
        "prompt": "다음은 C언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "3 1 2",
        "acceptedAnswers": [
          "3 1 2"
        ],
        "explanation": "마지막에 재배선된 연결 순서를 그대로 따라가면 head(c=3)→a(1)→b(2) 순서로 출력된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "3 1 2",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n \nstruct node {\n    int p;\n    struct node* n;\n};\n \nint main() {\n    struct node a = {1, NULL};\n    struct node b = {2, NULL};\n    struct node c = {3, NULL};\n \n    a.n = &b; b.n = &c; c.n = NULL;\n    c.n = &a; a.n = &b; b.n = NULL;\n    struct node* head = &c;\n    printf(\"%d %d %d\", head->p, head->n->p, head->n->n->p);\n    return 0;\n}\n "
      },
      {
        "id": "2025-2-17",
        "prompt": "다음은 Pyhon언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "2",
        "acceptedAnswers": [
          "2"
        ],
        "explanation": "s는 애초에 {2,4,6}로 고정된 집합이고, 이후 lst나 dst를 바꿔도 s 자체는 영향받지 않는다(단 s.add(99)로 99가 추가됨). dst.values()는 dst[2]=7로 바뀌어 {2,4,7}이 된다. s={2,4,6,99} &amp; {2,4,7} = {2,4} → 길이 2.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "2",
        "code": "lst = [1,2,3]\ndst = {i : i* 2 for i in lst}\ns = set(dst.values())\nlst[0] = 99 \ndst[2]=7\ns.add(99)\nprint(len(s & set(dst.values())))"
      },
      {
        "id": "2025-2-18",
        "prompt": "다음은 C언어의 문제이다. 아래 코드를 보고 알맞는 출력값을 작성하시오.",
        "answer": "TSEB",
        "acceptedAnswers": [
          "TSEB"
        ],
        "explanation": "매번 새 노드를 head 앞에 꽂는 방식이라 마지막에 들어간 문자가 맨 앞이 되어, 입력 순서(B,E,S,T)와 반대인 T,S,E,B 순서로 출력된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "TSEB",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n \nstruct node {\n    char c;\n    struct node* p;\n};\n \nstruct node* func(char* s) {\n    struct node* h = NULL, *n;\n    \n    while(*s) {\n        n = malloc(sizeof(struct node));\n        n->c = *s++;\n        n->p = h;\n        h = n;\n    }\n    \n    return h;\n}\n \nint main() {\n    struct node* n = func(\"BEST\");\n    \n    while(n) {\n        putchar(n->c);\n        struct node* t = n;\n        n = n->p;\n        free(t);\n    }\n    \n    return 0;\n}"
      },
      {
        "id": "2025-2-19",
        "prompt": "다음은 TCP 통신 과정에서 발생할 수 있는 보안 취약점에 대한 설명이다 . 이를 이용한 공격 기법으로 옳은 것은 ?\n\nTCP 는 연결을 수립하기 위해 클라이언트가 서버에 SYN 패킷을 보내고 서버는 SYN-ACK 패킷으로 응답한 후 클라이언트가 다시 ACK 패킷을 보내는 3-way-handshake 과정을 거친다 .\n\n이때 공격자는 클라이언트 역할로 수많은 SYN 패킷을 서버에 전송한 뒤 마지막 ACK 를 고의로 보내지 않아 서버가 연결 대기 상태를 계속 유지하게 만든다 .\n\n이로 인해 서버의 연결 대기 큐가 가득 차면서 정상적인 접속 요청을 처리하지 못하게 되어 서비스 거부 상태가 발생한다 .",
        "answer": "SYN Flooding",
        "acceptedAnswers": [
          "SYN Flooding"
        ],
        "explanation": "반열림 연결을 대량으로 만들어 정상 접속을 처리하지 못하게 만드는 대표적 DoS 공격.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "SYN Flooding"
      },
      {
        "id": "2025-2-20",
        "prompt": "다음 테이블에서 πTTL(employee)에 대한 연산 결과 값을 작성하시오.\n\n[employee테이블]",
        "answer": "TTL\n부장\n대리\n과장\n차장",
        "acceptedAnswers": [
          "TTL\n부장\n대리\n과장\n차장",
          "1. TTL 2. 부장 3. 대리 4. 과장 5. 차장"
        ],
        "explanation": "조회 결과의 열 이름은 TTL이다. 원문 표에 제시된 출력 순서대로 부장, 대리, 과장, 차장을 적는다.",
        "tags": [
          "관계대수"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. TTL 2. 부장 3. 대리 4. 과장 5. 차장",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-2-20-1.png",
            "alt": "2025년 2회 20번 원문 입력 자료",
            "width": 1085,
            "height": 278
          }
        ]
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2025-1",
    "label": "2025년 1회",
    "sourceUrl": "https://chobopark.tistory.com/540",
    "questions": [
      {
        "id": "2025-1-01",
        "prompt": "다음은 네트워크 보완에 관련된 문제이다. 괄호안에 알맞는 용어를 작성하시오.\n\n(   )은/는 '세션을 가로채다.' 라는 의미로 다른 사람의 세션 상태를 훔치거나 도용하여 액세스하는 해킹 기법이다.\n\nTCP (   )은/는 TCP의 3-way 핸드셰이크가 완료된 후에 공격자가 시퀀스 번호 등을 조작하여 정상적인 세션을 가로채고 인증 없이 통신을 탈취하는 공격 공격이다.",
        "answer": "세션 하이재킹",
        "acceptedAnswers": [
          "세션 하이재킹"
        ],
        "explanation": "'세션을 가로채다'라는 의미 그대로, 이미 인증된 세션을 훔쳐 도용하는 해킹 기법.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "세션 하이재킹"
      },
      {
        "id": "2025-1-02",
        "prompt": "다음은 제약조건과 관련된 문제이다. 괄호안에 알맞는 용어를 보기에 골라 작성하시오.\n\n[보기]\n\n개체, 참조, 도메인",
        "answer": "ㄱ. 도메인  ㄴ. 개체  ㄷ. 참조",
        "acceptedAnswers": [
          "ㄱ. 도메인  ㄴ. 개체  ㄷ. 참조",
          "ㄱ. 도메인 ㄴ. 개체 ㄷ. 참조",
          "도메인 개체 참조"
        ],
        "explanation": "도메인 무결성(속성값 범위), 개체 무결성(기본키 규칙), 참조 무결성(외래키 일관성)의 정의 구분.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ. 도메인 ㄴ. 개체 ㄷ. 참조",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-1-02-1.png",
            "alt": "2025년 1회 2번 원문 입력 자료",
            "width": 999,
            "height": 282
          }
        ]
      },
      {
        "id": "2025-1-03",
        "prompt": "아래의 내용에서 설명 글의 괄호안의 용어를 영문 약자로 작성하시오.\n\n(        ) 은/는 3글자의 영어 약자로 이루어진 오류 기법으로 데이터를 전송하거나 저장할 때 데이터의 오류를 감지하는 데 사용되는 오류 검출 코드이다.\n\n(        ) 은/는 데이터에 체크섬을 추가하여 데이터를 전송하거나 저장한 후, 수신 또는 읽을 때 이 체크섬을 다시 계산하여 데이터가 변경되었는지 확인하는 기법이다.\n\n(        ) 은/는 데이터 전송의 안정성을 높이는 데 중요한 역할을 한다.\n\n데이터는 이진수(0과 1)로 표현되며 정해진 다항식(x³ + x + 1)을 기반으로 데이터를 2진수 나눗셈하고나머지를 (       ) 값으로 삼는다.",
        "answer": "CRC",
        "acceptedAnswers": [
          "CRC"
        ],
        "explanation": "체크섬을 추가해 송수신 시 재계산·비교로 오류를 검출하는 순환중복검사 기법.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "CRC"
      },
      {
        "id": "2025-1-04",
        "prompt": "다음은 악성코드 관련된 문제이다. 아래 내용을 확인하여 보기에 골라 작성하시오. 사용자가 원치 않는 소프트웨어를 구매하도록 조작하기 위해 사회 공학을 사용하여 충격, 불안 또는 위협에 대한 인식을 유발하는 악성 소프트웨어의 한 형태이다. ‘겁을 주다’라는 영어 단어에서 유래한 것으로 공포를 이용하여 피해자를 속여 대가를 지불 하거나 특정 행동을 유도하는 랜섬웨어이다. 가짜 바이러스 경고나 시스템 문제를 표시하여 사용자가 돈을 지불하거나 특정 소프트웨어를 설치하도록 속이는 방식으로 작동한다.\n\n보기\n\nㄱ. 컴포넌트 웨어  ㄴ. 유즈웨어  ㄷ. 셔블웨어  ㄹ. 스캐어 웨어  ㅁ. 안티 스파이 웨어  ㅂ. 네트웨어  ㅅ. 그룹웨어  ㅇ. 애드웨어",
        "answer": "스캐어웨어",
        "acceptedAnswers": [
          "스캐어웨어",
          "ㄹ"
        ],
        "explanation": "'겁을 주다(scare)'에서 유래, 거짓 경고로 결제나 설치를 유도하는 사회공학적 악성코드.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄹ"
      },
      {
        "id": "2025-1-05",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "출력1출력5",
        "acceptedAnswers": [
          "출력1출력5"
        ],
        "explanation": "0으로 나누면 ArithmeticException이 발생해 해당 catch 블록(\"출력1\")이 실행되고, finally는 예외 발생 여부와 상관없이 항상 실행되어 \"출력5\"가 뒤에 붙는다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "출력1출력5",
        "code": "public class Main {\n \n  public static void main(String[] args) {\n \n    int a=5,b=0;\n \n    try{\n      System.out.print(a/b);\n    }catch(ArithmeticException e){\n      System.out.print(\"출력1\");\n    }catch(ArrayIndexOutOfBoundsException e) {\n      System.out.print(\"출력2\");\n    }catch(NumberFormatException e) {\n      System.out.print(\"출력3\");\n    }catch(Exception e){\n      System.out.print(\"출력4\");\n    }finally{\n      System.out.print(\"출력5\");\n    }\n  }\n}"
      },
      {
        "id": "2025-1-06",
        "prompt": "아래 내용은 ARP/RARP에 대한 설명이다. 각 설명에 해당하는 것을 작성하시오.\n\n( 1 ) 은/는 네트워크상에서 IP 주소를 MAC 주소로 변환하는 프로토콜이고,\n\n( 2 ) 은/는 MAC 주소를 IP 주소로 변환하는 프로토콜이다.",
        "answer": "(1) ARP  (2) RARP",
        "acceptedAnswers": [
          "(1) ARP  (2) RARP",
          "(1) ARP (2) RARP"
        ],
        "explanation": "ARP는 IP→MAC, RARP는 그 반대 방향으로 주소를 변환한다.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) ARP (2) RARP"
      },
      {
        "id": "2025-1-07",
        "prompt": "다음은 SQL 문제이다. 아래 두 테이블을 참고하여 보기에 쿼리 실행 결과를 작성하시오.\n\n[보기]\n\nSELECT name, incentive FROM emp, sal WHERE emp.id = sal.id and incentives >= 500",
        "answer": "이순신 | 1000",
        "acceptedAnswers": [
          "이순신 | 1000",
          "name  |  incentives 이순신 | 1000"
        ],
        "explanation": "조인 결과 중 인센티브가 500 이상인 행이 이순신(1000) 하나뿐이므로 그 행만 반환된다.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "name  |  incentives 이순신 | 1000",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-1-07-1.png",
            "alt": "2025년 1회 7번 원문 입력 자료",
            "width": 462,
            "height": 161
          }
        ]
      },
      {
        "id": "2025-1-08",
        "prompt": "아래는 데이터베이스에 관련된 설명이다. 알맞는 용어를 보기에서 골라 괄호를 작성하시오. 1. 릴레이션에서 속성의 개수를 의미 : ( 1 ) 2. 릴레이션에서 튜플의 개수를 의미 : ( 2 ) 3. 한 릴레이션의 속상이 다른 릴레이션의 기본 키를 참조할 때, 참조하는 속성을 의미 : ( 3 ) 4. 특정 속성에 대해 입력될 수 있는 값의 유형이나 범위를 의미하고 무결성을 보장하는 기준 : ( 4 )\n\n[보기]\n\nㄱ. domain   ㄴ. primary   ㄷ. degree    ㄹ. candidate   ㅁ. cardinality   ㅂ. attribute   ㅅ. foreign",
        "answer": "1. degree  2. cardinality  3. foreign(key)  4. domain",
        "acceptedAnswers": [
          "1. degree  2. cardinality  3. foreign(key)  4. domain",
          "(1) ㄷ (2) ㅁ (3) ㅅ (4) ㄱ"
        ],
        "explanation": "차수(속성수)-degree, 카디널리티(튜플수), 외래키(참조속성), 도메인(허용값범위)의 정의 구분.",
        "tags": [
          "DB개념"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) ㄷ (2) ㅁ (3) ㅅ (4) ㄱ"
      },
      {
        "id": "2025-1-09",
        "prompt": "IP 주소가 192.168.35.10, 서브넷 255.255.252.0인 PC에서 브로드캐스팅으로 다른 IP로 정보를 전달한다고 할 때 수신할 수 있는 알맞는 IP를 보기에서 골라 모두 작성하시오.\n\n[보기] ㄱ. 192.168.34.1 ㄴ. 192.168.32.19 ㄷ. 192.168.35.200 ㄹ. 192.168.33.138 ㅁ. 192.168.35.50",
        "answer": "ㄱ,ㄴ,ㄷ,ㄹ,ㅁ (보기 전부)",
        "acceptedAnswers": [
          "ㄱ,ㄴ,ㄷ,ㄹ,ㅁ (보기 전부)",
          "ㄱ,ㄴ,ㄷ,ㄹ,ㅁ"
        ],
        "explanation": "/22는 4개의 클래스C 블록을 묶으므로 192.168.32.0~192.168.35.255 범위가 모두 같은 네트워크 — 보기의 모든 IP가 이 범위 안에 들어가 전부 수신 가능.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ,ㄴ,ㄷ,ㄹ,ㅁ"
      },
      {
        "id": "2025-1-10",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "4\nBACDE",
        "acceptedAnswers": [
          "4\nBACDE"
        ],
        "explanation": "'E'-'A'(아스키 4,69 차이 아님 - 문자코드 차이)=4. 이후 배열에서 'C'보다 큰 첫 문자('D')를 찾아 'C'로 바꾸고, 원래 있던 값들을 뒤로 한 칸씩 밀어 최종 'B','A','C','D','E' 순서가 된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "4 BACDE",
        "code": "#include <stdio.h>\nchar Data[5] = {'B', 'A', 'D', 'E'};\nchar c;\n \nint main(){\n    int i, temp, temp2;\n \n    c = 'C';\n    printf(\"%d\\n\", Data[3]-Data[1]);\n \n    for(i=0;i<5;++i){\n        if(Data[i]>c)\n            break;\n    }\n \n    temp = Data[i];\n    Data[i] = c;\n    i++;\n \n    for(;i<5;++i){\n        temp2 = Data[i];\n        Data[i] = temp;\n        temp = temp2;\n    }\n \n    for(i=0;i<5;i++){\n        printf(\"%c\", Data[i]);\n    }\n}"
      },
      {
        "id": "2025-1-11",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "13",
        "acceptedAnswers": [
          "13"
        ],
        "explanation": "함수가 (i+1)%rows, (i+1)%cols 인덱스 규칙으로 data를 배열에 재배치한 뒤, 짝수 인덱스는 +, 홀수 인덱스는 -로 부호를 바꿔 누적한 값.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "13",
        "code": "#include <stdio.h>\n#include <stdlib.h>\n \nvoid set(int** arr, int* data, int rows, int cols) {\n    for (int i = 0; i < rows * cols; ++i) {\n        arr[((i + 1) / rows) % rows][(i + 1) % cols] = data[i];\n    }\n}\n \nint main() {\n    int rows = 3, cols = 3, sum = 0;\n    int data[] = {5, 2, 7, 4, 1, 8, 3, 6, 9}; \n    int** arr;\n    arr = (int**) malloc(sizeof(int*) * rows);\n    for (int i = 0; i < cols; i++) {\n        arr[i] = (int*) malloc(sizeof(int) * cols);\n    }\n \n    set(arr, data, rows, cols);\n \n    for (int i = 0; i < rows * cols; i++) {\n        sum += arr[i / rows][i % cols] * (i % 2 == 0 ? 1 : -1);\n    }\n \n    for(int i=0; i<rows; i++) {\n        free(arr[i]);\n    }\n    free(arr);\n \n    printf(\"%d\", sum);\n}"
      },
      {
        "id": "2025-1-12",
        "prompt": "다음은 결합도와 관련된 내용이다. 보기에 알맞는 답을 골라 작성하시오. (1) 다른 모듈 내부에 있는 변수나 기능을 다른 모듈에서 사용하는 경우의 결합도 (2) 모듈 간의 인터페이스로 배열이나 오브젝트, 자료구조 등이 전달되는 경우의 결합도 (3) 파라미터가 아닌 모듈 밖에 선언되어 있는 전역 변수를 참조하고 전역 변수를 갱신하는 식으로 상호작용하는 경우의 결합도 [보기] ㄱ. 자료 결합도  ㄴ. 스탬프 결합도 ㄷ. 제어 결합도  ㄹ. 공통 결합도  ㅁ. 내용 결합도  ㅂ. 외부 결합도",
        "answer": "(1) 내용결합도  (2) 스탬프결합도  (3) 공통결합도",
        "acceptedAnswers": [
          "(1) 내용결합도  (2) 스탬프결합도  (3) 공통결합도",
          "(1) ㅁ (2) ㄴ (3) ㄹ"
        ],
        "explanation": "내용결합도(가장 나쁨, 내부 직접접근), 스탬프결합도(구조체 통째 전달), 공통결합도(전역변수 공유)의 정의 구분.",
        "tags": [
          "결합도"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) ㅁ (2) ㄴ (3) ㄹ"
      },
      {
        "id": "2025-1-13",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "54",
        "acceptedAnswers": [
          "54"
        ],
        "explanation": "부모 생성자(total+=++v)가 먼저 실행되고, 자식 생성자에서 v를 증가시키며 total에 다시 누적하고, 오버라이딩된 show()가 total을 배로 늘리는 과정이 겹치며 최종 54가 된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "54",
        "code": "public class Main {\n    public static void main(String[] args) {\n        new Child();\n        System.out.println(Parent.total);\n    }\n}\n \n \nclass Parent {\n    static int total = 0;\n    int v = 1;\n \n    public Parent() {\n        total += (++v);\n        show();    \n    }\n \n    public void show() {\n        total += total;\n    }\n}\n \n \nclass Child extends Parent {\n    int v = 10;\n \n    public Child() {\n        v += 2;\n        total += v++;\n        show();\n    }\n \n    @Override\n    public void show() {\n        total += total * 2;\n    }\n}\n \n "
      },
      {
        "id": "2025-1-14",
        "prompt": "아래는 디자인 패턴에 대한 설명이다. 알맞는 답을 보기에 골라 작성하시오. 서로 다른 인터페이스를 가진 클래스들을 연결해 사용 가능하게 한다. 기존 클래스(Adaptee)를 원하는 인터페이스(Target)에 맞게 변환하는 어댑터(Adapter)를 만든다. 기존 클래스를 감싸서(wrapper) 인터페이스를 변환해주는 역할을 한다.",
        "answer": "Adapter",
        "acceptedAnswers": [
          "Adapter"
        ],
        "explanation": "서로 다른 인터페이스를 가진 클래스들을 연결해 함께 쓸 수 있게 해주는 구조 패턴.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "Adapter",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-1-14-1.png",
            "alt": "2025년 1회 14번 원문 입력 자료",
            "width": 587,
            "height": 159
          }
        ]
      },
      {
        "id": "2025-1-15",
        "prompt": "문장(Statement) 커버리지 테스트를 수행하려고 한다. 코드를 아래의 제어 흐름도 빈칸에 연결되도록 작성하고 문장 커버리지 순서대로 작성하시오.\n\n[흐름도]\n\n문장 커버리지 순서 1 → 2 → (          ⑦           )",
        "answer": "(1) int a = 0 (2) a < m || b[a] < x (3) b[a] < 0 (4) b[a] = -b[a]; (5) a++; (6) return 1; (7) ③ → ④ → ⑤ → ② → ⑥",
        "acceptedAnswers": [
          "(1) int a = 0 (2) a < m || b[a] < x (3) b[a] < 0 (4) b[a] = -b[a]; (5) a++; (6) return 1; (7) ③ → ④ → ⑤ → ② → ⑥"
        ],
        "explanation": "모든 문장을 한 번 이상 지나야 하므로 조건이 참일 때 한 번, 거짓일 때 한 번(루프탈출) 경로가 필요.",
        "tags": [
          "테스트"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) int a = 0 (2) a < m || b[a] < x (3) b[a] < 0 (4) b[a] = -b[a]; (5) a++; (6) return 1; (7) ③ → ④ → ⑤ → ② → ⑥",
        "code": "int Main(int b[], int m, int x) {\n    int a = 0;\n    while (a < m || b[a] < x) {\n        if (b[a] < 0)\n            b[a] = -b[a];\n        a++;\n    }\n    return 1;\n}",
        "verificationNote": "기존 요약은 실행 순서만 담았지만 원문은 코드 빈칸과 실행 순서를 함께 요구한다. 아래 복원 답안을 기준으로 확인한다.",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2025-1-15-1.png",
            "alt": "2025년 1회 15번 원문 입력 자료",
            "width": 476,
            "height": 736
          }
        ]
      },
      {
        "id": "2025-1-16",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "20",
        "acceptedAnswers": [
          "20"
        ],
        "explanation": "배열을 절반씩 나눠 각 구간의 최댓값 경로를 재귀로 비교하며 mid 값을 누적하는 분할정복 방식으로, 최종 20이 반환된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "20",
        "code": "public class Main {\n \n    public static void main(String[] args) {\n        int[] data = {3, 5, 8, 12, 17};\n        System.out.println(func(data, 0, data.length - 1));\n    }\n \n    static int func(int[] a, int st, int end) {\n        if (st >= end) return 0;\n        int mid = (st + end) / 2;\n        return a[mid] + Math.max(func(a, st, mid), func(a, mid + 1, end));\n    } \n \n}"
      },
      {
        "id": "2025-1-17",
        "prompt": "다음은 파이썬에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "13",
        "acceptedAnswers": [
          "13"
        ],
        "explanation": "루트(레벨0)는 제외, 레벨1 노드(5,8)의 값 5+8=13이 홀수 레벨 합계가 된다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "13",
        "code": "class Node:\n    def __init__(self, value):\n        self.value = value\n        self.children = []\n \ndef tree(li):\n    nodes = [Node(i) for i in li]\n    for i in range(1, len(li)):\n        nodes[(i - 1) // 2].children.append(nodes[i])\n    return nodes[0]\n \ndef calc(node, level=0):\n    if node is None:\n        return 0\n    return (node.value if level % 2 == 1 else 0) + sum(calc(n, level + 1) for n in node.children)\n \nli = [3, 5, 8, 12, 15, 18, 21]\n \nroot = tree(li)\n \nprint(calc(root)) "
      },
      {
        "id": "2025-1-18",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "35421",
        "acceptedAnswers": [
          "35421"
        ],
        "explanation": "값이 3인 노드를 리스트에서 떼어내 head로 옮기고 나머지는 원래 순서를 유지한 채 이어붙이면 3,5,4,2,1 순서가 된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "35421",
        "code": "#include <stdio.h>   \n#include <stdlib.h>  \n \ntypedef struct Data {\n    int value;\n    struct Data *next;\n} Data;\n \nData* insert(Data* head, int value) {\n    Data* new_node = (Data*)malloc(sizeof(Data));\n    new_node->value = value;\n    new_node->next = head;\n    return new_node;\n}\n \nData* reconnect(Data* head, int value) {\n    if (head == NULL || head->value == value) return head;\n    Data *prev = NULL, *curr = head;\n    while (curr != NULL && curr->value != value) {\n        prev = curr;\n        curr = curr->next;\n    }\n \n    if (curr != NULL && prev != NULL) {\n        prev->next = curr->next;\n        curr->next = head;\n        head = curr;\n    }\n    return head;\n}\n \nint main() {\n \n    Data *head = NULL, *curr;\n    for (int i = 1; i <= 5; i++)\n        head = insert(head, i);\n    head = reconnect(head, 3);\n    for (curr = head; curr != NULL; curr = curr->next)\n        printf(\"%d\", curr->value);\n    return 0; \n}"
      },
      {
        "id": "2025-1-19",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "908",
        "acceptedAnswers": [
          "908"
        ],
        "explanation": "각 점수를 0xA5와 XOR 연산해 원래 값으로 복원한 뒤 두 학생의 점수 6개를 모두 더한 값.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "908",
        "code": "#include <stdio.h>\n \ntypedef struct student {\n    char* name;\n    int score[3];\n} Student;\n \nint dec(int enc) {\n    return enc & 0xA5;\n}\n \nint sum(Student* p) {\n    return dec(p->score[0]) + dec(p->score[1]) + dec(p->score[2]);\n}\n \nint main() {\n    Student s[2] = { \"Kim\", {0xA0, 0xA5, 0xDB}, \"Lee\", {0xA0, 0xED, 0x81} };\n    Student* p = s;\n    int result = 0;\n \n    for (int i = 0; i < 2; i++) {\n        result += sum(&s[i]);\n    }\n    printf(\"%d\", result);\n    return 0;\n}"
      },
      {
        "id": "2025-1-20",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "4",
        "acceptedAnswers": [
          "4"
        ],
        "explanation": "calc(String)이 호출되어 정수로 변환한 값을 기준으로 (value-1)+(value-3) 재귀식을 계속 타고 내려가며 base case(value&lt;=1)에 도달, 최종 합산값은 4.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "4",
        "code": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(calc(\"5\"));\n  }\n \n  static int calc(int value) {\n    if (value <= 1) return value;\n    return calc(value - 1) + calc(value - 2);\n  }\n \n  static int calc(String str) {\n    int value = Integer.valueOf(str);\n    if (value <= 1) return value;\n    return calc(value - 1) + calc(value - 3);\n  }\n}"
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2024-3",
    "label": "2024년 3회",
    "sourceUrl": "https://chobopark.tistory.com/495",
    "questions": [
      {
        "id": "2024-3-01",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "OOAAA",
        "acceptedAnswers": [
          "OOAAA"
        ],
        "explanation": "equals()는 값 비교이므로 s[2]가 new String으로 만들어졌어도 값이 같으면 true(O). 인접 비교 두 번 모두 O가 되고, 그 뒤 원소 3개를 그대로 출력해 \"OOAAA\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "OOAAA",
        "code": "public class Main{\n  static String[] s = new String[3];\n \n  static void func(String[]s, int size){\n    for(int i=1; i<size; i++){\n      if(s[i-1].equals(s[i])){\n        System.out.print(\"O\");\n      }else{\n        System.out.print(\"N\");\n      }\n    }\n      for (String m : s){\n        System.out.print(m);\n      }\n    }\n  \n \n  public static void main(String[] args){\n    s[0] = \"A\";\n    s[1] = \"A\";\n    s[2] = new String(\"A\");\n \n    func(s, 3);\n  }\n}"
      },
      {
        "id": "2024-3-02",
        "prompt": "다음은 파이썬에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "3",
        "acceptedAnswers": [
          "3"
        ],
        "explanation": "반전 후 [6,5,4,3,2,1]에서 짝수 인덱스 합(6+4+2=12)과 홀수 인덱스 합(5+3+1=9)의 차 12-9=3.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "3",
        "code": "def func(lst):\n  for i in range(len(lst) //2):\n    lst[i], lst[-i-1] = lst[-i-1], lst[i]\n \nlst = [1,2,3,4,5,6] \nfunc(lst)\nprint(sum(lst[::2]) - sum(lst[1::2]))"
      },
      {
        "id": "2024-3-03",
        "prompt": "아래의 employee테이블과 project테이블을 참고하여 보기의 SQL명령어에 알맞는 출력 값을 작성하시오.",
        "answer": "1",
        "acceptedAnswers": [
          "1"
        ],
        "explanation": "프로젝트별 인원수를 센 뒤 2명 미만인 프로젝트명을 뽑고, 그 프로젝트에 속한 직원 수를 다시 세면 1명.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1",
        "code": "SELECT \n    count(*) \nFROM employee AS e JOIN project AS p ON e.project_id = p.project_id \nWHERE p.name IN (\n    SELECT name FROM project p WHERE p.project_id IN (\n        SELECT project_id FROM employee GROUP BY project_id HAVING count(*) < 2\n    )\n);",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-3-03-1.png",
            "alt": "2024년 3회 3번 원문 입력 자료",
            "width": 400,
            "height": 342
          }
        ]
      },
      {
        "id": "2024-3-04",
        "prompt": "다음은 운영체제 페이지 순서를 참고하여 할당된 프레임의 수가 3개일 때  LRU 알고리즘의 페이지 부재 횟수를 작성하시오.\n\n페이지 참조 순서 : 7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1",
        "answer": "12",
        "acceptedAnswers": [
          "12"
        ],
        "explanation": "각 참조 시점마다 가장 오래전에 사용된 페이지를 교체하는 LRU 규칙을 그대로 시뮬레이션하면 부재가 12회 발생한다.",
        "tags": [
          "OS"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "12"
      },
      {
        "id": "2024-3-05",
        "prompt": "다음은 네트워크 취약점에 대한 문제이다. 아래 내용을 보고 알맞는 용어를 작성하시오.\n\n- IP나 ICMP의 특성을 악용하여 엄청난 양의 데이터를 한 사이트에 집중적으로 보냄으로써 네트워크의 일부를 불능 상태로 만드는 공격이다. - 여러 호스트가 특정 대상에게 다량의 ICMP Echo Reply 를 보내게 하여 서비스거부(DoS)를 유발시키는 보안공격이다. - 공격 대상 호스트는 다량으로 유입되는 패킷으로 인해 서비스 불능 상태에 빠진다.",
        "answer": "스머프(Smurf)",
        "acceptedAnswers": [
          "스머프(Smurf)",
          "스머프(Smurf) 또는 스머핑(Smurfing)",
          "스머프",
          "스머핑",
          "Smurf",
          "Smurfing",
          "스머프",
          "스머핑",
          "Smurf",
          "Smurfing"
        ],
        "explanation": "다수의 호스트를 이용해 특정 대상에 트래픽이 집중되도록 유도하는 증폭형 DoS 공격.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "스머프(Smurf) 또는 스머핑(Smurfing)"
      },
      {
        "id": "2024-3-06",
        "prompt": "다음은 GoF 디자인 패턴과 관련된 문제이다. 괄호안에 알맞는 용어를 작성하시오.\n\n(        ) 패턴은 클래스나 객체들이 서로 상호작용하는 방법이나 책임 분배 방법을 정의하는 패턴이다. (        ) 패턴은 객체들 간의 통신 방법을 정의하고 알고리즘을 캡슐화하여 객체 간의 결합도를 낮춘다. (        ) 패턴은 Chain of Responsibility나 Command 또는 Observer 패턴이 있다.",
        "answer": "행위 패턴",
        "acceptedAnswers": [
          "행위 패턴",
          "행위"
        ],
        "explanation": "객체들 간의 상호작용 방식과 역할 분담을 다루는 GoF 패턴의 3대 분류(생성/구조/행위) 중 하나.",
        "tags": [
          "GoF패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "행위"
      },
      {
        "id": "2024-3-07",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "20",
        "acceptedAnswers": [
          "20"
        ],
        "explanation": "static 변수는 호출 간 값이 유지되어 호출마다 2씩 늘어난다(2,4,6,8), 4회 호출 합이 20.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "20",
        "code": "#include <stdio.h>\n \nint func(){\n static int x =0; \n  x+=2; \n  return x;\n}\n \nint main(){\n  int x = 1; \n  int sum=0; \n  for(int i=0;i<4;i++) {\n    x++; \n    sum+=func();\n  } \n  printf(\"%d\", sum);\n \n  return 0;\n}"
      },
      {
        "id": "2024-3-08",
        "prompt": "다음은 무결성제약조건에 대한 문제이다. 아래 표에서 어떠한 (       ) 무결성을 위반하였는지 작성하시오.",
        "answer": "개체 무결성",
        "acceptedAnswers": [
          "개체 무결성",
          "개체"
        ],
        "explanation": "기본키는 중복이나 NULL을 허용하지 않는데 이를 어긴 경우에 해당.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "개체",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-3-08-1.png",
            "alt": "2024년 3회 8번 원문 입력 자료",
            "width": 471,
            "height": 265
          }
        ]
      },
      {
        "id": "2024-3-09",
        "prompt": "다음은 URL 구조에 관한 문제이다 . 아래  보기의 순서대로 URL에 해당하는 번호를 작성하시오.\n\nquery : 서버에 전달할 추가 데이터 path : 서버 내의 특정 자원을 가리키는 경로\n\nscheme : 리소스에 접근하는 방법이나 프로토콜\n\nauthority : 사용자 정보, 호스트명, 포트 번호\n\nfragment : 특정 문서 내의 위치",
        "answer": "43125",
        "acceptedAnswers": [
          "43125"
        ],
        "explanation": "scheme://authority/path?query#fragment 순서를 그림에 매칭한 결과.",
        "tags": [
          "웹"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "43125",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-3-09-1.png",
            "alt": "2024년 3회 9번 원문 입력 자료",
            "width": 678,
            "height": 144
          }
        ]
      },
      {
        "id": "2024-3-10",
        "prompt": "다음은 파이썬에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "45",
        "acceptedAnswers": [
          "45"
        ],
        "explanation": "a는 문자열이라 len('100.0')=5, b는 float이라 type 비교상 int와 달라 20, c는 튜플이라 20... 실제로는 b가 float이므로 100과 타입 불일치로 20 처리, 계산하면 a(5)+b(20)+c(20)=45가 되는 타입 함정 문제.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "45",
        "code": "def func(value):\n    if type(value) == type(100):\n        return 100\n    elif type(value) == type(\"\"):\n        return len(value) \n    else:\n        return 20\n \n \na = '100.0'\nb = 100.0\nc = (100, 200)\n \nprint(func(a) + func(b) + func(c))\n "
      },
      {
        "id": "2024-3-11",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "52",
        "acceptedAnswers": [
          "52"
        ],
        "explanation": "a는 Base 타입, b는 Derivate 타입으로 선언되었다. 두 getX()는 실제 Derivate 구현을 실행해 각각 21이다. 필드 a.x는 Base의 3, b.x는 Derivate의 7이다. 21+3+21+7=52다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "52",
        "code": "public class Main{\n  public static void main(String[] args){\n    Base a =  new Derivate();\n    Derivate b = new Derivate();\n    \n    System.out.print(a.getX() + a.x + b.getX() + b.x);\n  }\n}\n \n \nclass Base{\n  int x = 3;\n \n  int getX(){\n     return x * 2; \n  }\n}\n \nclass Derivate extends Base{\n  int x = 7;\n  \n  int getX(){\n     return x * 3;\n  }\n}"
      },
      {
        "id": "2024-3-12",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "312",
        "acceptedAnswers": [
          "312"
        ],
        "explanation": "n1과 n3의 값을 교환한 뒤 다음 노드(n2)로 넘어가는 방식으로, 최종 순회 결과는 3,1,2.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "312",
        "code": "#include <stdio.h>\n \nstruct Node {\n int value;\n struct Node* next;\n};\n \nvoid func(struct Node* node){\n  while(node != NULL && node->next != NULL){\n     int t = node->value;\n     node->value = node->next->value;\n     node->next->value = t;\n     node = node->next->next;\n  }\n}\n \nint main(){\n  struct Node n1 = {1, NULL};\n  struct Node n2 = {2, NULL};\n  struct Node n3 = {3, NULL};\n  \n  n1.next = &n3;\n  n3.next = &n2;\n \n  func(&n1);  \n \n  struct Node* current = &n1;\n \n  while(current != NULL){\n    printf(\"%d\", current->value);\n    current = current->next;\n }\n \n return 0;\n \n}"
      },
      {
        "id": "2024-3-13",
        "prompt": "다음은 테스트 커버리지에 대한 문제이다. 아래 내용에 알맞는 답을 보기에서 골라 작성하시오. 1. 테스트를 통해 프로그램의 모든 문장을 최소한 한 번씩 실행했는지를 측정 2. 프로그램 내의 모든 분기(조건문)의 각 분기를 최소한 한 번씩 실행했는지를 측정 3. 복합 조건 내의 각 개별 조건이 참과 거짓으로 평가되는 경우를 모두 테스트했는지를 측정\n\nㄱ. 조건     ㄴ. 경로      ㄷ. 결정      ㄹ. 분기      ㅁ.함수          ㅂ. 문장      ㅅ. 루프",
        "answer": "1. 문장  2. 분기  3. 조건",
        "acceptedAnswers": [
          "1. 문장  2. 분기  3. 조건",
          "1. 문장 2. 분기 3. 조건",
          "문장 분기 조건"
        ],
        "explanation": "문장·분기·조건 커버리지의 정의를 순서대로 매칭.",
        "tags": [
          "테스트커버리지"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1. 문장 2. 분기 3. 조건"
      },
      {
        "id": "2024-3-14",
        "prompt": "아래는 UML클래스의 관계에 관한 문제이다. 보기를 보고 알맞는 관계를 선택하여 작성하시오.\n\nㄱ. 의존         ㄴ. 연관         ㄷ. 일반화",
        "answer": "(1) 연관  (2) 일반화  (3) 의존",
        "acceptedAnswers": [
          "(1) 연관  (2) 일반화  (3) 의존",
          "(1) 연관 (2) 일반화 (3) 의존"
        ],
        "explanation": "단순 참조는 연관, 상속은 일반화, 일시적 사용관계는 의존.",
        "tags": [
          "UML"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) 연관 (2) 일반화 (3) 의존",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-3-14-1.png",
            "alt": "2024년 3회 14번 원문 입력 자료",
            "width": 783,
            "height": 590
          }
        ]
      },
      {
        "id": "2024-3-15",
        "prompt": "다음은 데이터베이스에 관한 문제이다. 아래 내용을 읽고 알맞는 답을 보기에서 찾아 골라 작성하시오.\n\n(1) 다른 테이블, 릴레이션의 기본 키를 참조하는 속성 또는 속성들의 집합 (2) 테이블에서 각 행을 유일하게 식별할 수 있는 최소한의 속성들의 집합 (3) 후보 키 중에서 선정된 기본 키를 제외한 나머지 후보 키 (4) 테이블에서 각 행을 유일하게 식별할 수 있는 속성들의 집합 ㄱ. 슈퍼키         ㄴ. 외래키            ㄷ. 대체키             ㄹ. 후보키",
        "answer": "(1) 외래키  (2) 후보키  (3) 대체키  (4) 슈퍼키",
        "acceptedAnswers": [
          "(1) 외래키  (2) 후보키  (3) 대체키  (4) 슈퍼키",
          "(1) 외래키 (2) 후보키 (3) 대체키 (4) 슈퍼키"
        ],
        "explanation": "슈퍼키⊇후보키(최소성O)⊇대체키(PK 제외 후보키), 외래키는 다른 테이블 참조용 키.",
        "tags": [
          "DB키"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) 외래키 (2) 후보키 (3) 대체키 (4) 슈퍼키"
      },
      {
        "id": "2024-3-16",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "1",
        "acceptedAnswers": [
          "1"
        ],
        "explanation": "인덱스2 원소 4에 인덱스2를 더한 6을 배열크기 5로 나눈 나머지 1이 arr[2]에 저장된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "1",
        "code": "#include <stdio.h>\n \nvoid func(int** arr, int size){\n  for(int i=0; i<size; i++){\n     *(*arr + i) = (*(*arr+i) + i) % size;\n  }\n}\n \nint main(){\n  int arr[] = {3,1, 4, 1, 5};\n  int* p = arr;\n  int** pp = &p;\n  int num = 6;\n  \n  func(pp, 5);  \n  num = arr[2];\n  printf(\"%d\", num);  \n \n  return 0;\n}"
      },
      {
        "id": "2024-3-17",
        "prompt": "다음 아래 내용을 보고 알맞는 용어를 작성하시오. (3글자로 작성)\n\n- 공용 네트워크를 통해 사설 네트워크를 확장하는 기술이다. - 사용자의 IP 주소를 숨기고, 사용자가 어디에서 접속하는지를 추적하기 어렵게 만든다. - 종류로는 IPsec 또는 SSL, L2TP 등이 있다.",
        "answer": "VPN",
        "acceptedAnswers": [
          "VPN"
        ],
        "explanation": "가상사설망으로 공용 네트워크 위에 암호화된 사설 통신로를 구성하는 기술.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "VPN"
      },
      {
        "id": "2024-3-18",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "101",
        "acceptedAnswers": [
          "101"
        ],
        "explanation": "NullPointerException이므로 첫 catch가 실행되어 sum=1, finally에서 +100이 항상 실행되어 최종 101.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "101",
        "code": "public class ExceptionHandling {\n  public static void main(String[] args) {\n      int sum = 0;\n      try {\n          func();\n      } catch (NullPointerException e) {\n          sum = sum + 1;\n      } catch (Exception e) {\n          sum = sum + 10;\n      } finally {\n          sum = sum + 100;\n      }\n      System.out.print(sum);\n  }\n \n  static void func() throws Exception {\n      throw new NullPointerException(); \n  }\n}"
      },
      {
        "id": "2024-3-19",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "B0",
        "acceptedAnswers": [
          "B0"
        ],
        "explanation": "제네릭은 컴파일 시 타입 소거(erasure)되어 T가 Object로 취급되므로, 오버로드 선택이 print(Object)로 결정되어 \"B0\"이 출력된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "B0",
        "code": "class Main {\n \n  public static class Collection<T>{\n    T value;\n \n    public Collection(T t){\n        value = t;\n    }\n \n    public void print(){\n       new Printer().print(value);\n    }\n \n   class Printer{\n      void print(Integer a){\n        System.out.print(\"A\" + a);\n      }\n      void print(Object a){\n        System.out.print(\"B\" + a);\n      } \n      void print(Number a){\n        System.out.print(\"C\" + a);\n      }\n   }\n }\n \n  public static void main(String[] args) {\n      new Collection<>(0).print();\n  }\n  \n}\n "
      },
      {
        "id": "2024-3-20",
        "prompt": "다음은 네트워크에 대한 문제이다.  아래 내용을 보고 알맞는 용어를 작성하시오. - 중앙 관리나 고정된 인프라 없이 임시로 구성되는 네트워크이다. - 일반적으로 무선 통신을 통해 노드들이 직접 연결되어 데이터를 주고받는다. - 긴급 구조, 긴급 회의, 군사적인 상황 등에서 유용하게 활용될 수 있다. ㄱ.Infrastructure Network        ㄴ. Firmware Network        ㄷ. Peer-to-Peer Network        ㄹ. Ad-hoc Network         ㅁ. Mesh Network        ㅂ.Sensor Network        ㅅ.Virtual Private Network",
        "answer": "Ad-hoc Network",
        "acceptedAnswers": [
          "Ad-hoc Network",
          "ㄹ. ( Ad-hoc Network )",
          "( Ad-hoc Network )"
        ],
        "explanation": "고정 기지국 없이 단말끼리 임시로 연결을 구성하는 무선 네트워크 방식.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄹ. ( Ad-hoc Network )"
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2024-2",
    "label": "2024년 2회",
    "sourceUrl": "https://chobopark.tistory.com/483",
    "questions": [
      {
        "id": "2024-2-01",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "NNN",
        "acceptedAnswers": [
          "NNN"
        ],
        "explanation": "배열은 객체라 ==는 참조(주소) 비교다. 값이 같아도 서로 다른 배열 객체이므로 세 번 모두 다르다고 판정되어 \"NNN\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "NNN",
        "code": "class Main {\n    public static void main(String[] args) {\n        int[] a = new int[]{1, 2, 3, 4};\n        int[] b = new int[]{1, 2, 3, 4};\n        int[] c = new int[]{1, 2, 3};\n        \n        check(a, b);\n        check(a, c); \n        check(b, c); \n    }\n \n    public static void check(int[] a, int[] b) {\n        if (a==b) {\n            System.out.print(\"O\");\n        }else{\n            System.out.print(\"N\");\n        }\n        \n    }\n}"
      },
      {
        "id": "2024-2-02",
        "prompt": "다음 문제에서 설명하는 용어를 작성하시오.\n\n데이터를 중복시켜 성능을 향상시키기 위한 기법으로 데이터를 중복 저장하거나\n\n테이블을 합치는 등으로 성능을 향상시키지만 데이터 무결성이 저하될 수 있는 기법",
        "answer": "반정규화",
        "acceptedAnswers": [
          "반정규화"
        ],
        "explanation": "정규화의 반대 방향으로, 성능을 위해 의도적으로 중복을 허용하는 설계 기법.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "반정규화"
      },
      {
        "id": "2024-2-03",
        "prompt": "다음은 SQL에 관한 문제이다. 아래 SQL 구문의 빈칸을 작성하시오.\n\n테이블\n\n사원 [사원번호(PK), 이름, 나이, 부서]\n\n부서 [사원번호(PK), 이름, 주소, 나이]\n\n신입 사원이 들어와서 사원 테이블에 추가\n\nINSERT INTO 사원 (사원번호, 이름, 주소, 부서)   [ ①     ] (32431, '정실기', '서울', '영업');\n\n위에 신입사원을 검색하면서 부서 테이블에 추가\n\nINSERT INTO 부서 (사원번호, 이름, 나이, 부서)\n\n[ ② ] 사원번호, 이름, 나이, 23 FROM 사원 WHERE 이름 = '정실기';\n\n전체 사원 테이블 조회\n\nSELECT  *   [ ③ ]   사원;\n\n퇴사로 인해 부서에 해당하는 값을 '퇴사'로 변경\n\nUPDATE 사원   [ ④ ]   부서  =  '퇴사'  WHERE 사원번호  = 32431;",
        "answer": "① VALUES  ② SELECT  ③ FROM  ④ SET",
        "acceptedAnswers": [
          "① VALUES  ② SELECT  ③ FROM  ④ SET",
          "① : VALUES ② : SELECT ③ : FROM ④ : SET",
          ": VALUES : SELECT : FROM : SET"
        ],
        "explanation": "INSERT...VALUES(직접값), INSERT...SELECT(조회결과삽입), SELECT...FROM(조회), UPDATE...SET(갱신) 각 구문의 필수 키워드.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① : VALUES ② : SELECT ③ : FROM ④ : SET"
      },
      {
        "id": "2024-2-04",
        "prompt": "다음 릴레이션의 Cardinality와 Degree를 작성하시오.\n\nCardinality : (  ①  )\n\nDegree : (  ②  )",
        "answer": "Cardinality 5, Degree 4",
        "acceptedAnswers": [
          "Cardinality 5, Degree 4",
          "① : 5 ② : 4",
          ": 5 : 4"
        ],
        "explanation": "표에 나온 행의 개수와 열(속성)의 개수를 각각 세면 된다.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① : 5 ② : 4",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-2-04-1.png",
            "alt": "2024년 2회 4번 원문 입력 자료",
            "width": 304,
            "height": 151
          }
        ]
      },
      {
        "id": "2024-2-05",
        "prompt": "다음은 프로토콜에 대한 내용이다. 아래 내용을 읽고 알맞는 답을 작성하시오.\n\n- Network layer에서 IP패킷을 암호화하고 인증하는 등의 보안을 위한 표준이다.\n\n- 기업에서 사설 인터넷망으로 사용할 수 있는 VPN을 구현하는데 사용되는 프로토콜이다. - AH(Authentication Header)와 ESP(Encapsulating Security Payload)라는 두 가지 보안 프로토콜을 사용한다.",
        "answer": "IPSec",
        "acceptedAnswers": [
          "IPSec"
        ],
        "explanation": "네트워크 계층에서 보안을 제공해 사설 인터넷망(VPN)을 구현하는 대표 프로토콜.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "IPSec"
      },
      {
        "id": "2024-2-06",
        "prompt": "다음은 Python에 대한 문제이다. 아래 코드를 읽고 알맞는 출력 값을 작성하시오.",
        "answer": "ab3ca3",
        "acceptedAnswers": [
          "ab3ca3"
        ],
        "explanation": "문자열 a 안에서 \"ab\"가 등장하는 횟수와 \"ca\"가 등장하는 횟수를 각각 세면 3, 3이 나온다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "ab3ca3",
        "code": "def fnCalculation(x,y):\n    result = 0;\n    for i in range(len(x)):\n     temp = x[i:i+len(y)] \n     if temp == y:\n       result += 1;\n    return result\n \na = \"abdcabcabca\"\np1 = \"ab\";\np2 = \"ca\";\n \nout = f\"ab{fnCalculation(a,p1)}ca{fnCalculation(a,p2)}\"\nprint(out)"
      },
      {
        "id": "2024-2-07",
        "prompt": "아래 설명하는 내용을 확인하여 알맞는 알고리즘을 작성하시오.\n\n- 대칭키 알고리즘으로 1997년 NIST(미국 국립기술표준원)에서 DES를 대체하기 위해 생성되었다. - 128비트, 192비트 또는 256비트의 가변 키 크기와 128비트의 고정 블록 크기를 사용한다. - 높은 안전성과 효율성, 속도 등으로 인해 DES 대신 전 세계적으로 많이 사용되고 있다.",
        "answer": "AES",
        "acceptedAnswers": [
          "AES"
        ],
        "explanation": "현재 가장 널리 쓰이는 대칭키 블록 암호 표준.",
        "tags": [
          "암호"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "AES"
      },
      {
        "id": "2024-2-08",
        "prompt": "패킷 교환 방식 중에 연결형과 비연결형에 해당하는 방식을 작성하시오.\n\n① 연결형 교환 방식\n\n② 비연결형 교환 방식",
        "answer": "① 가상회선  ② 데이터그램",
        "acceptedAnswers": [
          "① 가상회선  ② 데이터그램",
          "① 가상회선 ② 데이터그램",
          "가상회선 데이터그램"
        ],
        "explanation": "가상회선은 경로를 먼저 확립하는 연결형, 데이터그램은 패킷마다 독립적으로 라우팅되는 비연결형.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "① 가상회선 ② 데이터그램"
      },
      {
        "id": "2024-2-09",
        "prompt": "아래 내용을 확인하고 보기에서 알맞는 답을 고르시오.\n\n실행 순서가 밀접한 관계를 갖는 기능을 모아 모듈로 구성한다. 한 모듈 내부의 한 기능 요소에 의한 출력 자료가 다음 기능 원소의 입력 자료로서 제공되는 형태이다.\n\n보기\n\nㄱ.  기능적(functional)           ㄴ.  우연적(Coincidental)          ㄷ.  통신적(Communication)       ㄹ.  절차적(Procedural)         ㅁ.  시간적(Temporal)           ㅂ.  순차적(sequential)              ㅅ.    논리적(Logical)",
        "answer": "순차적(Sequential)",
        "acceptedAnswers": [
          "순차적(Sequential)",
          "ㅂ"
        ],
        "explanation": "기능적 응집도 다음으로 좋은 응집도로, 데이터 흐름이 순서대로 이어지는 구조.",
        "tags": [
          "응집도"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㅂ"
      },
      {
        "id": "2024-2-10",
        "prompt": "아래는 디자인 패턴에 관한 설명이다. 아래 설명을 읽고 보기에서 알맞는 용어를 작성하시오.\n\n- 컬렉션 객체의 내부 구조를 노출하지 않고 순차적으로 접근할 수 있게 하는 패턴이다. - 이 패턴은 객체의 내부 표현 방식에 독립적으로 요소에 접근할 수 있도록 해준다 - 반복 프로세스를 캡슐화하여 클라이언트 코드에서는 컬렉션의 구체적인 구현에 종속되지 않도록 한다.\n\n보기",
        "answer": "Iterator",
        "acceptedAnswers": [
          "Iterator"
        ],
        "explanation": "컬렉션의 구체적 구현에 종속되지 않고 반복 처리를 표준화하는 행위 패턴.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "Iterator"
      },
      {
        "id": "2024-2-11",
        "prompt": "아래 그림을 바탕으로 RIP을 구성하여 최단 경로 비용을 계산하여 흐름에 맞게 작성하시오.\n\n예제\n\nA  →",
        "answer": "A → D → C → F",
        "acceptedAnswers": [
          "A → D → C → F"
        ],
        "explanation": "표면적으로 짧아 보이는 다른 경로가 있어도, 실제 링크 비용을 모두 더해 비교하면 이 경로가 최소 비용이다.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "A → D → C → F",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-2-11-1.png",
            "alt": "2024년 2회 11번 원문 입력 자료",
            "width": 866,
            "height": 397
          }
        ]
      },
      {
        "id": "2024-2-12",
        "prompt": "아래의 표를 확인하여 SRT 스케줄링의 평균 대기시간을 계산하여 작성하시오.",
        "answer": "6.5",
        "acceptedAnswers": [
          "6.5",
          "5"
        ],
        "explanation": "매 순간 남은 실행시간이 가장 짧은 프로세스를 선점 실행하는 SRT 규칙을 적용해 계산한 평균 대기시간.",
        "tags": [
          "스케줄링"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "6.5"
      },
      {
        "id": "2024-2-13",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "21",
        "acceptedAnswers": [
          "21"
        ],
        "explanation": "parr[1]은 arr[2]={7,8,9}. parr[1][1]=8, *(parr[1]+2)=9, **parr는 parr[0](=arr[1]={4,5,6})의 첫값 4. 8+9+4=21.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "21",
        "code": "#include <stdio.h>\n \nint main() {\n    int arr[3][3] = {1, 2, 3, 4, 5, 6, 7, 8, 9};\n    int* parr[2] = {arr[1], arr[2]};\n    printf(\"%d\", parr[1][1] + *(parr[1]+2) + **parr);\n    \n    return 0;\n}"
      },
      {
        "id": "2024-2-14",
        "prompt": "다음은 Java 언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "25, 20",
        "acceptedAnswers": [
          "25, 20"
        ],
        "explanation": "홀수(1+3+5+7+9=25)와 짝수(2+4+6+8=20)의 합을 각각 계산.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "25, 20",
        "code": "class Main {\n    public static void main(String[] args) {\n        int a[] = {1, 2, 3, 4, 5, 6, 7, 8, 9};\n        ODDNumber OE = new ODDNumber();\n        System.out.print(OE.sum(a, true) + \", \" + OE.sum(a, false));\n    }\n}\n \ninterface Number {\n    int sum(int[] a, boolean odd);\n}\n \nclass ODDNumber implements Number {\n    public int sum(int[] a, boolean odd) {\n        int result = 0;\n        for(int i=0; i < a.length; i++){\n            if((odd && a[i] % 2 != 0) || (!odd && a[i] % 2 == 0))\n                result += a[i];\n        }        \n        return result;\n    }    \n}"
      },
      {
        "id": "2024-2-15",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "10",
        "acceptedAnswers": [
          "10"
        ],
        "explanation": "\"first\"는 5글자이므로 인덱스 0+1+2+3+4=10.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "10",
        "code": "#include <stdio.h>\n#include <string.h>\n \nvoid sumFn(char* d, const char* s) {\n \n    while (*s) {\n        *d = *s;\n        d++;\n        s++;\n    }\n    *d = '\\0'; \n}\n \nint main() {\n   const char* str1 = \"first\";\n    char str2[50] = \"teststring\";  \n    int result=0;\n    sumFn(str2, str1);\n \n    for (int i = 0; str2[i] != '\\0'; i++) {\n        result += i;\n    }\n    printf(\"%d\", result);\n    \n    return 0;\n}"
      },
      {
        "id": "2024-2-16",
        "prompt": "아래는 소프트웨어 설계에 대한 내용이다. 내용을 읽고 괄호안에 알맞는 답을 작성하시오.\n\n- 어떤 모듈이 다른 모듈 내부의 논리적인 흐름을 제어하기 위해, 제어를 통신하거나 제어 요소를 전달하는 결합도이다. - 한 모듈이 다른 모듈의 상세한 처리 절차를 알고 있어 이를 통제하는 경우나 처리 기능이 두 모듈에 분리되어 설계된 경우에 발생한다.\n\n(              ) Coupling",
        "answer": "제어(Control) 결합도",
        "acceptedAnswers": [
          "제어(Control) 결합도",
          "제어  or  Control"
        ],
        "explanation": "단순 자료가 아닌 처리 절차를 통제하는 신호를 주고받을 때 발생하는 결합도.",
        "tags": [
          "결합도"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "제어  or  Control"
      },
      {
        "id": "2024-2-17",
        "prompt": "다음은 Java에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력 값을 작성하시오.",
        "answer": "dcba",
        "acceptedAnswers": [
          "dcba"
        ],
        "explanation": "뒤에서부터 처리하며 이미 등장한 문자는 건너뛰므로 마지막에 나온 순서대로 유니크한 문자만 남아 \"dcba\"가 된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "dcba",
        "code": "class Main {\n    public static void main(String[] args) {\n        String str = \"abacabcd\";\n        boolean[] seen = new boolean[256];\n        System.out.print(calculFn(str, str.length()-1, seen));\n    }\n \n    public static String calculFn(String str, int index, boolean[] seen) {\n        if(index < 0) return \"\";\n        char c = str.charAt(index);\n        String result = calculFn(str, index-1, seen);\n        if(!seen[c]) {\n            seen[c] = true;\n            return c + result;\n        }\n        return result;\n    }\n}"
      },
      {
        "id": "2024-2-18",
        "prompt": "다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력 값을 작성하시오.",
        "answer": "-13",
        "acceptedAnswers": [
          "-13"
        ],
        "explanation": "값 전달이라 swap은 원본에 영향 없음(a=11 유지). switch는 case 11부터 시작해 default까지 fall-through로 b에 2와 3이 더해진다(19+2+3=24). a-b=11-24=-13.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "-13",
        "code": "#include <stdio.h>\n \nvoid swap(int a, int b) {\n    int t = a;\n    a = b;\n    b = t;\n}\n \nint main() {\n    \n    int a = 11;\n    int b = 19;\n    swap(a, b);\n    \n    switch(a) {\n        case 1:\n            b += 1;\n        case 11:\n            b += 2;\n        default:\n            b += 3;\n        break;\n    }\n    \n    printf(\"%d\", a-b);\n}"
      },
      {
        "id": "2024-2-19",
        "prompt": "다음은 C언어의 구조체에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력 값을 작성하시오.",
        "answer": "20",
        "acceptedAnswers": [
          "20"
        ],
        "explanation": "head-&gt;n2는 b를 가리키므로 b.n1인 20이 출력된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "20",
        "code": "#include <stdio.h>\n \nstruct node {\n    int n1;\n    struct node *n2;\n};\n \nint main() {\n \n    struct node a = {10, NULL};\n    struct node b = {20, NULL};\n    struct node c = {30, NULL};\n \n    struct node *head = &a;\n    a.n2 = &b;\n    b.n2 = &c;\n \n    printf(\"%d\\n\", head->n2->n1);\n \n    return 0;\n}"
      },
      {
        "id": "2024-2-20",
        "prompt": "다음은 Java에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력 값을 작성하시오.",
        "answer": "S",
        "acceptedAnswers": [
          "S"
        ],
        "explanation": "'T'를 구분자로 나누면 [\"I\",\"IS\",\"ES\",\"S\",\"RING\"]이 되고 인덱스3(네 번째 요소)은 \"S\".",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "S",
        "code": "class Main {\n    public static void main(String[] args) {\n        String str = \"ITISTESTSTRING\";\n        String[] result = str.split(\"T\");\n        System.out.print(result[3]);\n    }\n}"
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2024-1",
    "label": "2024년 1회",
    "sourceUrl": "https://chobopark.tistory.com/476",
    "questions": [
      {
        "id": "2024-1-01",
        "prompt": "다음 Java 코드에서 알맞는 출력 값을 작성하시오.",
        "answer": "4",
        "acceptedAnswers": [
          "4"
        ],
        "explanation": "싱글톤이라 conn1,conn2,conn3 모두 같은 인스턴스를 가리키므로 count() 호출 4번이 모두 같은 count 필드에 누적된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "4",
        "code": "class Connection {\n \n    private static Connection _inst = null;\n    private int count = 0;\n    \n    static public Connection get() {\n        if(_inst == null) {\n            _inst = new Connection();\n            return _inst;\n        }\n        return _inst;\n    }\n    \n    public void count() {\n         count++; \n    }\n    \n    public int getCount() {\n         return count; \n    }\n}\n \n \npublic class main {  \n \n    public static void main(String[] args) {\n \n        Connection conn1 = Connection.get();\n        conn1.count();\n \n        Connection conn2 = Connection.get();\n        conn2.count();\n \n        Connection conn3 = Connection.get();\n        conn3.count();\n        \n        conn1.count();\n        System.out.print(conn1.getCount());\n    }\n \n}"
      },
      {
        "id": "2024-1-02",
        "prompt": "다음 C언어 코드에서 알맞는 출력 값을 작성하시오.",
        "answer": "151",
        "acceptedAnswers": [
          "151"
        ],
        "explanation": "v1&gt;v2가 거짓이므로 삼항연산자는 v1(0)을 반환하고, if(0)은 거짓이라 else가 실행되어 v3&lt;&lt;=2(29*4=116). v2(35)+v3(116)=151.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "151",
        "code": "#include <stdio.h>\n \nint main() {\n \n    int v1 = 0, v2 = 35, v3 = 29;\n    \n    if(v1 > v2 ? v2 : v1) {\n        v2 = v2 << 2;\n    }else{\n        v3 = v3 << 2;\n    }\n    \n    printf(\"%d\", v2+v3);\n \n}"
      },
      {
        "id": "2024-1-03",
        "prompt": "다음은 응집도와 관련해서 보기에서 응집도가 높은 순으로 나열하시오.\n\n보기",
        "answer": "기능, 교환, 시간, 우연",
        "acceptedAnswers": [
          "기능, 교환, 시간, 우연",
          "ㄱ, ㄴ, ㄹ, ㄷ"
        ],
        "explanation": "응집도 강도 순서: 기능적 &gt; 순차적 &gt; 교환적 &gt; 절차적 &gt; 시간적 &gt; 논리적 &gt; 우연적.",
        "tags": [
          "응집도"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄱ, ㄴ, ㄹ, ㄷ"
      },
      {
        "id": "2024-1-04",
        "prompt": "다음은 C언어에 대한 문제이다. 알맞는 출력 값을 작성하시오.",
        "answer": "GECA",
        "acceptedAnswers": [
          "GECA"
        ],
        "explanation": "\"ABCDEFGH\"를 반전하면 \"HGFEDCBA\", 이 중 인덱스 1,3,5,7의 문자(G,E,C,A)만 출력된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "GECA",
        "code": "#include <stdio.h>\n#include <string.h>\n \nvoid reverse(char* str){\n    int len = strlen(str);\n    char temp;\n    char*p1 = str;\n    char*p2 = str + len - 1;\n    while(p1<p2){\n        temp = *p1;\n        *p1 = *p2;\n        *p2 = temp;\n        p1++;\n        p2--;\n    }\n}\n \nint main(int argc, char* argv[]){\n    char str[100] = \"ABCDEFGH\";\n \n    reverse(str);\n \n    int len = strlen(str);\n \n    for(int i=1; i<len; i+=2){\n        printf(\"%c\",str[i]);\n    }\n \n    printf(\"\\n\");\n \n    return 0;\n \n}"
      },
      {
        "id": "2024-1-05",
        "prompt": "아래 그림에서의 네트워크에서 라우터을 통한 할당 가능한 2번, 4번, 5번의 IP를 작성하시오.\n\n보기\n\n192.168.35.0\n\n192.168.35.72\n\n192.168.36.0\n\n192.168.36.249\n\n129.200.8.0\n\n129.200.8.249",
        "answer": "2. 192.168.35.72  4. 129.200.8.249  5. 192.168.36.249",
        "acceptedAnswers": [
          "2. 192.168.35.72  4. 129.200.8.249  5. 192.168.36.249",
          "2)192.168.35.72 4)129.200.8.249 5)192.168.36.249"
        ],
        "explanation": "각 서브넷 대역에 속하면서 네트워크·브로드캐스트 주소가 아닌 사용 가능한 호스트 IP를 고르는 문제.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "2)192.168.35.72 4)129.200.8.249 5)192.168.36.249",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-1-05-1.png",
            "alt": "2024년 1회 5번 원문 입력 자료",
            "width": 1125,
            "height": 208
          }
        ]
      },
      {
        "id": "2024-1-06",
        "prompt": "아래 표에서 나타나고 있는 정규형을 작성하시오.",
        "answer": "제3정규형",
        "acceptedAnswers": [
          "제3정규형",
          "제 3정규형"
        ],
        "explanation": "이행함수종속(강사번호→강좌명 등)까지 제거된 상태이므로 3NF.",
        "tags": [
          "DB"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "제 3정규형"
      },
      {
        "id": "2024-1-07",
        "prompt": "아래의 내용에서 설명하는 네트워크 용어를 영문 약자로 작성하시오.",
        "answer": "OSPF",
        "acceptedAnswers": [
          "OSPF",
          "OSPF (Open Shortest Path First)"
        ],
        "explanation": "Open Shortest Path First — 단일 자율시스템 내에서 최단경로 라우팅을 계산하는 프로토콜.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "OSPF (Open Shortest Path First)"
      },
      {
        "id": "2024-1-08",
        "prompt": "아래 내용의 각각의 설명에 대한 답을 작성하시오.\n\n(1) 조인에 참여하는 두 릴레이션의 속성 값을 비교하여 조건을 만족하는 튜플만 반환한다. (2) 조건이 정확하게 '=' 등호로 일치하는 결과를 반환한다. (3) ( (2) ) 조인에서 조인에 참여한 속성이 두 번 나오지 않도록 중복된 속성을 제거한 결과를 반환한다.",
        "answer": "(1) 세타 조인  (2) 동등 조인  (3) 자연 조인",
        "acceptedAnswers": [
          "(1) 세타 조인  (2) 동등 조인  (3) 자연 조인",
          "(1) 세타 조인 (2) 동등 조인 (3) 자연 조인"
        ],
        "explanation": "세타조인(비교연산 전체)⊃동등조인(=조건)⊃자연조인(동등조인+중복속성 제거).",
        "tags": [
          "DB조인"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) 세타 조인 (2) 동등 조인 (3) 자연 조인"
      },
      {
        "id": "2024-1-09",
        "prompt": "다음은 운영체제 페이지 순서를 참고하여 할당된 프레임의 수가 3개일 때 LRU와 LFU 알고리즘의 페이지 부재 횟수를 작성하시오.\n\n페이지 참조 순서 : 1, 2, 3, 1, 2, 4, 1, 2, 5, 7\n\n(1) LRU : (2) LFU :",
        "answer": "LRU: 6, LFU: 6",
        "acceptedAnswers": [
          "LRU: 6, LFU: 6",
          "(1) : 6 (2) : 6"
        ],
        "explanation": "각 알고리즘의 교체 규칙(LRU=가장 오래 안 쓴 것, LFU=참조 횟수가 가장 적은 것)을 그대로 시뮬레이션한 결과.",
        "tags": [
          "OS"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "(1) : 6 (2) : 6"
      },
      {
        "id": "2024-1-10",
        "prompt": "아래 JAVA언어 코드의 실행 순서를 중복 번호없이 작성하시오.\n\n실행 순서 : 5 → ( ) → ( ) → ( ) → ( ) → ( )",
        "answer": "6 3 1 7 2",
        "acceptedAnswers": [
          "6 3 1 7 2",
          "6 3 1 7 2"
        ],
        "explanation": "문제에서 5번은 이미 실행한 시작 위치로 주어졌다. 답에는 이후 실행한 6 → 3 → 1 → 7 → 2만 적는다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "6 3 1 7 2",
        "code": "class Parent {\n    int x, y;\n \n    Parent(int x, int y) { ①\n        this.x=x;\n        this y=y;\n    }\n \n    int getT() { ②\n        return x*y;\n    }\n}\n \n \n \n​class Child extend Parent {\n    int x;\n \n    Child (int x) { ③\n        super(x+1, x);\n        this.x=x;\n    }\n \n    int getT(int n){ ④\n        return super.getT()+n;\n    }\n}\n \n \n \nclass Main {\n    public static void main(String[] args) { ⑤\n        Parent parent = new Child(3); ⑥\n        System.out.println(parent.getT()); ⑦\n    }\n}\n "
      },
      {
        "id": "2024-1-11",
        "prompt": "다음 C언어의 알맞는 출력값을 작성하시오.",
        "answer": "9981 and 2795.10",
        "acceptedAnswers": [
          "9981 and 2795.10"
        ],
        "explanation": "100을 출금 조건에 맞게 차감한 뒤(2200-100=2100), 3년 복리(1.1³=1.331)를 적용하면 2100*1.331=2795.1.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "9981 and 2795.10",
        "code": "#include <stdio.h>\n \n \ntypedef struct{\n    int accNum;\n    double bal;\n}BankAcc;\n \n \n \ndouble sim_pow(double base, int year){\n    int i;\n    double r = 1.0;\n \n    for(i=0; i<year; i++){\n        r = r*base;\n    }\n    return r;\n} \n \n \n \nvoid initAcc(BankAcc *acc, int x, double y){\n    acc -> accNum = x;\n    acc -> bal = y;\n}\n \n \n \nvoid xxx(BankAcc *acc, double *en){\n    if (*en > 0 && *en < acc -> bal) {\n        acc -> bal = acc -> bal-*en;\n    }else{\n        acc -> bal = acc -> bal+*en;\n    }\n}\n \n \n \nvoid yyy(BankAcc *acc){\n    acc -> bal = acc -> bal * sim_pow((1+0.1),3);\n}\n \n \nint main(){\n \n    BankAcc myAcc;\n    initAcc(&myAcc, 9981, 2200.0);\n    double amount = 100.0;\n    xxx(&myAcc, &amount);\n    yyy(&myAcc);\n    printf(\"%d and %.2f\", myAcc.accNum, myAcc.bal);\n    return 0;\n \n}\n "
      },
      {
        "id": "2024-1-12",
        "prompt": "다음 파이썬 코드에 대한 알맞는 출력 값을 작성하시오.",
        "answer": "Seynaau",
        "acceptedAnswers": [
          "Seynaau"
        ],
        "explanation": "'Seoul','Kyeonggi','Incheon','Daejun','Daegu','Pusan' 각각의 인덱스1 문자를 이어붙이면 e,y,n,a,a,u → 'S'에 이어붙여 'Seynaau'.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "Seynaau",
        "code": "a = [\"Seoul\", \"Kyeonggi\", \"Incheon\", \"Daejun\", \"Daegu\", \"Pusan\"] \nstr = \"S\"\n \nfor i in a:\n    str = str + i[1]\n \nprint(str)"
      },
      {
        "id": "2024-1-13",
        "prompt": "아래 보기의 SQL 문장과 테이블을 참고하여 출력 값을 표로 작성하시오.\n\n보기",
        "answer": "B 컬럼 값 a, b",
        "acceptedAnswers": [
          "B 컬럼 값 a, b",
          "B a b"
        ],
        "explanation": "R2에서 D='k'인 행의 C값을 구한 뒤, 그 C값과 일치하는 R1의 B값을 조회한 결과.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "B a b",
        "code": "SELECT\n    B\nFROM\n    R1\nWHERE\n    C IN (SELECT C FROM R2 WHERE D=\"k\");",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-1-13-1.png",
            "alt": "2024년 1회 13번 원문 입력 자료",
            "width": 525,
            "height": 148
          }
        ]
      },
      {
        "id": "2024-1-14",
        "prompt": "아래는 애플리케이션 테스트 관리에 대한 내용이다. 설명하는 답을 보기에서 골라 작성하시오.\n\n보기\n\nㄱ. 구문 커버리지      ㄴ. 결정 커버리지    ㄷ. 조건 커버리지    ㄹ. 변경 조건/결정 커버리지     ㅁ.다중 조건 커버리지      ㅂ.경로 커버리지    ㅅ.조건/결정 커버리지",
        "answer": "1. MC/DC(변경 조건/결정 커버리지)",
        "acceptedAnswers": [
          "1. MC/DC(변경 조건/결정 커버리지)",
          "ㄹ.변경 조건/결정 커버리지",
          "변경 조건/결정 커버리지"
        ],
        "explanation": "모든 조합 대신 핵심 조합만으로 커버리지를 만족시키는 효율적 기법.",
        "tags": [
          "테스트"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㄹ.변경 조건/결정 커버리지"
      },
      {
        "id": "2024-1-15",
        "prompt": "다음 아래 내용을 보고  보기에서 알맞는 용어를 골라 작성하시오.\n\n인터넷 공격자의 존재를 숨기면서 이 공격자에게 시스템에 대한 무제한 접근 권한을 부여하는 악성 프로그램이다. 해커가 자신의 존재를 숨기면서 허가되지 않은 컴퓨터나 소프트웨어에 접근할 수 있도록 설계된 도구이다. 일반적으로 펌웨어, 가상화 계층 등의 다양한 시스템 영역에서 작동하며, 운영체제의 시스템콜을 해킹하여 악성코드의 실행여부를 숨겨 안티바이러스 탐지를 우회할 수 있다.\n\n보기",
        "answer": "Rootkit",
        "acceptedAnswers": [
          "Rootkit",
          "ㅅ"
        ],
        "explanation": "펌웨어·가상화계층 등 다양한 영역에서 은닉 접근권한을 제공하는 대표적 은닉형 악성코드.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㅅ"
      },
      {
        "id": "2024-1-16",
        "prompt": "다음 Java 코드를 보고 알맞는 출력 값을 작성하시오.",
        "answer": "9",
        "acceptedAnswers": [
          "9"
        ],
        "explanation": "print()가 오버라이딩되어 있으므로 classTwo의 print()(po*po=3*3=9)가 호출된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "9",
        "code": "class classOne {\n    int a, b;\n \n    public classOne(int a, int b) {\n        this.a = a;\n        this.b = b;\n    }\n \n    public void print() {\n        System.out.println(a + b);\n    }\n \n}\nclass classTwo extends classOne {\n    int po = 3;\n    \n    public classTwo(int i) {\n        super(i, i+1);\n    }\n \n    public void print() {\n        System.out.println(po*po);\n    }\n}\n \npublic class main {  \n    public static void main(String[] args) {\n        classOne one = new classTwo(10);\n        one.print();\n    }\n}"
      },
      {
        "id": "2024-1-17",
        "prompt": "다음 아래 내용을 보고  보기에서 알맞는 용어를 골라 작성하시오.\n\n보기",
        "answer": "APT",
        "acceptedAnswers": [
          "APT",
          "ㅅ"
        ],
        "explanation": "Advanced Persistent Threat — 특정 대상을 장기간 은밀하게 노리는 지능형 지속 위협.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "ㅅ"
      },
      {
        "id": "2024-1-18",
        "prompt": "아래의 SQL 코드와 테이블을 참고하여 결과 값을 작성하시오.",
        "answer": "1",
        "acceptedAnswers": [
          "1"
        ],
        "explanation": "AND가 OR보다 먼저 계산되어 (EMPNO&gt;100 AND SAL&gt;=3000) OR EMPNO=200 조건이 되고, 표 데이터 기준 이를 만족하는 행이 1건.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "1",
        "code": "SELECT \n    COUNT(*) \nFROM \n    TABLE \nWHERE \n    EMPNO > 100 \nAND \n    SAL >= 3000 OR EMPNO = 200",
        "figures": [
          {
            "src": "/certifications/information-processing-engineer/2024-1-18-1.png",
            "alt": "2024년 1회 18번 원문 입력 자료",
            "width": 169,
            "height": 132
          }
        ]
      },
      {
        "id": "2024-1-19",
        "prompt": "다음 C언어 코드의 알맞는 출력 값을 작성하시오.",
        "answer": "Nd sc 1",
        "acceptedAnswers": [
          "Nd sc 1"
        ],
        "explanation": "대문자/소문자/숫자 각각 규칙에 맞춰 한 글자씩 이동시키는 치환암호 결과.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "sourceAnswer": "Nd sc 1",
        "code": "#include<stdio.h>\n#include<ctype.h>\n \nint main(){\n    char*p = \"It is 8\";\n    char result[100];\n    int i;\n \n    for(i=0; p[i]!='\\0'; i++){\n        if(isupper(p[i]))\n            result[i] = (p[i]-'A'+5)% 25 + 'A';\n        else if(islower(p[i]))\n            result[i] = (p[i]-'a'+10)% 26 + 'a';\n        else if(isdigit(p[i]))\n            result[i] = (p[i]-'0'+3)% 10 + '0';\n        else if(!(isupper(p[i]) || islower(p[i]) || isdigit(p[i])))    \n            result[i] = p[i];\n    }\n \n    result[i] = '\\0';\n    printf(\"%s\\n\",result);\n \n    return 0;\n}"
      },
      {
        "id": "2024-1-20",
        "prompt": "다음 아래의 내용을 보고 알맞는 용어를 작성하시오.\n\n구체적인 클래스에 의존하지 않고 서로 연관되거나 의존적인 객체들의 조합을 만드는 인터페이스를 제공하는 패턴이다. 연관성이 있는 객체 군이 여러개 있을 경우 이들을 묶어 추상화하고, 어떤 구체적인 상황이 주어지면 팩토리 객체에서 집합으로 묶은 객체 군을 구현화 하는 생성 패턴이다 관련성 있는 여러 종류의 객체를 일관된 방식으로 생성하는 경우에 유용하다. kit라고도 불린다.",
        "answer": "Abstract Factory",
        "acceptedAnswers": [
          "Abstract Factory"
        ],
        "explanation": "관련성 있는 여러 객체를 일관되게 생성해야 할 때 쓰는 생성 패턴.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory",
        "sourceAnswer": "Abstract Factory"
      }
    ],
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06"
  },
  {
    "id": "2026-2",
    "label": "2026년 2회",
    "sourceUrl": "https://chobopark.tistory.com/562",
    "sourceAuthor": "Life-Journey",
    "sourceLicenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "sourceCheckedAt": "2026-10-06",
    "questions": [
      {
        "id": "2026-2-restored-01",
        "prompt": "다음은 블랙박스 테스트 기법에 대한 설명이다 . 괄호 ( ) 안에 들어갈 말을 보기에서 골라 쓰시오 .\n\n(   )은 프로그램의 입력 조건을 유효한 값과 유효하지 않은 값의 영역으로 나누고, 각 영역을 대표할 수 있는 값을 선정하여 테스트 케이스를 설계하는 명세 기반(블랙박스) 테스트 기법이다.\n\n위 표에서 테스트 값으로 60을 입력하였을 때, 예상 결과와 실제 결과가 모두 등급 D로 일치하였다. 이는 (   ) 기법을 적용하여 각 등급 구간의 대표값을 테스트한 사례이다.\n\n보기\n\nㄱ. 동치분할 (Equivalence Partitioning) ㄴ. 경계값분석 (Boundary Value Analysis) ㄷ. 결정테이블 테스트 (Decision Table Testing) ㄹ. 상태전이 테스트 (State Transition Testing)",
        "answer": "ㄱ",
        "acceptedAnswers": [
          "ㄱ",
          "ㄱ.",
          "동치분할",
          "동치 분할",
          "동등 분할",
          "Equivalence Partitioning"
        ],
        "explanation": "입력 구간을 나누고 각 구간의 대표값을 고르는 동치 분할이다. 경계 바로 전후를 고르는 경계값 분석과 구분한다.",
        "tags": [
          "테스트"
        ],
        "gradingMode": "theory",
        "tables": [
          {
            "title": "점수별 등급 기준",
            "columns": [
              "점수",
              "등급"
            ],
            "rows": [
              [
                "90~100",
                "A"
              ],
              [
                "80~89",
                "B"
              ],
              [
                "70~79",
                "C"
              ],
              [
                "60~69",
                "D"
              ]
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-02",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "10a20b",
        "acceptedAnswers": [
          "10a20b"
        ],
        "explanation": "B.print()가 먼저 super.print()를 호출해 10a를 출력한다. 이후 B의 b=20을 이어 출력해 10a20b가 된다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "code": "class A {\n    private int a;\n \n    public A(int a) {\n        this.a = a;\n    }\n \n    void print() {\n        System.out.print(a + \"a\");\n    }\n}\n \nclass B extends A {\n    private int b;\n \n    B(int a, int b) {\n        super(a);\n        this.b = b;\n    }\n \n    void print() {\n        super.print();\n        System.out.print(b + \"b\");\n    }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        B obj = new B(10, 20);\n        obj.print();\n    }\n}"
      },
      {
        "id": "2026-2-restored-03",
        "prompt": "다음은 소프트웨어 모듈 간의 결합도(Coupling)에 대한 설명이다. 괄호 안에 들어갈 말을 보기에서 골라 기호로 쓰시오.\n\n( )는 한 모듈이 다른 모듈 내부에 있는 변수나 기능을 직접 참조하거나 사용하는 경우에 발생하는 결합도로, 결합도 종류 중 결합 강도가 가장 높은 형태이다.\n\n보기\n\nㄱ. 자료결합도 (Data Coupling)\n\nㄴ. 스탬프결합도 (Stamp Coupling)\n\nㄷ. 제어결합도 (Control Coupling)\n\nㄹ. 외부결합도 (External Coupling)\n\nㅁ. 내용결합도 (Content Coupling)\n\nㅂ. 공통결합도 (Common Coupling)",
        "answer": "ㅁ",
        "acceptedAnswers": [
          "ㅁ",
          "ㅁ.",
          "내용 결합도",
          "내용결합도",
          "Content Coupling"
        ],
        "explanation": "다른 모듈 내부 변수나 기능을 직접 참조하는 것은 내용 결합도다. 보기에선 ㅁ이다.",
        "tags": [
          "결합도"
        ],
        "gradingMode": "theory"
      },
      {
        "id": "2026-2-restored-04",
        "prompt": "다음은 라우팅 프로토콜에 대한 설명이다. 괄호 안에 들어갈 알맞은 용어를 쓰시오. ( )는 링크 상태(Link State) 알고리즘을 사용하는 대표적인 내부 라우팅 프로토콜(IGP)이다. 다익스트라(Dijkstra) 알고리즘을 이용하여 최단 경로를 탐색하며, 대규모 네트워크에 적합하고 멀티캐스트를 지원한다.",
        "answer": "OSPF",
        "acceptedAnswers": [
          "OSPF",
          "Open Shortest Path First"
        ],
        "explanation": "링크 상태 정보와 다익스트라 알고리즘을 사용하는 대표 내부 라우팅 프로토콜은 OSPF다.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory",
        "verificationNote": "원문은 OSPF를 제시한다. 링크 상태와 다익스트라라는 설명을 기준으로 확인했다. 다른 복원본과 혼용하지 않는다."
      },
      {
        "id": "2026-2-restored-05",
        "prompt": "다음은 파이썬 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "CNNLRPYT",
        "acceptedAnswers": [
          "CNNLRPYT"
        ],
        "explanation": "삽입 순서대로 각 키의 마지막 문자와 도시명의 첫 문자를 연결한다. CN, NL, RP, YT를 이어 CNNLRPYT다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "code": "class LocationDict:\n    locations = {\n        \"NYC\": \"New York\",\n        \"LON\": \"London\",\n        \"PAR\": \"Paris\",\n        \"TKY\": \"Tokyo\"\n    }\n \ntmpdict = LocationDict()\nstr01 = \"\"\nfor key, location in tmpdict.locations.items():\n    keyk = key[-1]\n    locationk = location[0]\n    str01 += keyk + locationk\n \nprint(str01, end=\"\")"
      },
      {
        "id": "2026-2-restored-06",
        "prompt": "다음은 파이썬 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "_THIISING",
        "acceptedAnswers": [
          "_THIISING"
        ],
        "explanation": "a[:4]는 _THI, a[6:8]은 IS, a[18:]는 ING다. 이를 연결하면 _THIISING이다.",
        "tags": [
          "Python"
        ],
        "gradingMode": "code-output",
        "code": "a = \"_THIS_IS_KIM_SPEAKING\"\nb = a[:4]      \nc = a[6:8]     \nd = a[18:]     \ne = b + c + d  \nprint(e)"
      },
      {
        "id": "2026-2-restored-07",
        "prompt": "다음은 C언어 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "12",
        "acceptedAnswers": [
          "12",
          "12\n"
        ],
        "explanation": "후위 순회 방문 순서는 35 → 53 → 12 → 64 → 21이다. 세 번째 방문에서 ans=12가 된다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "code": "#include <stdio.h>\n \ntypedef struct N {\n    int v;\n    struct N* a;\n    struct N* b;\n} N;\n \nint c = 0;\nint ans = 0;\n \nvoid pst(N *n) {\n    if (!n) return;\n    pst(n->a);\n    pst(n->b);\n    if (++c == 3) ans = n->v;\n}\n \nint main() {\n    N ne = {35, 0, 0};\n    N nd = {64, 0, 0};\n    N nc = {53, 0, 0};\n    N nb = {12, &ne, &nc};\n    N na = {21, &nb, &nd};\n \n    pst(&na);\n    printf(\"%d\\n\", ans);\n    return 0;\n}"
      },
      {
        "id": "2026-2-restored-08",
        "prompt": "다음 프로세스들을 SRT(Shortest Remaining Time) 스케줄링 기법으로 처리할 때, 평균 대기시간을 구하시오. (단위: ms)",
        "answer": "6.5",
        "acceptedAnswers": [
          "6.5",
          "6.5ms",
          "6.5 ms"
        ],
        "explanation": "SRT 실행 구간은 P1(0~1), P2(1~5), P4(5~10), P1(10~17), P3(17~26)이다. 대기시간은 각각 9, 0, 15, 2이고 평균은 26/4=6.5ms다.",
        "tags": [
          "운영체제"
        ],
        "gradingMode": "theory",
        "tables": [
          {
            "title": "프로세스",
            "columns": [
              "프로세스",
              "도착시간",
              "버스트시간"
            ],
            "rows": [
              [
                "P1",
                "0",
                "8"
              ],
              [
                "P2",
                "1",
                "4"
              ],
              [
                "P3",
                "2",
                "9"
              ],
              [
                "P4",
                "3",
                "5"
              ]
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-09",
        "prompt": "다음은 C언어 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "1. 50\n2. 50\n3. 2\n4. 8",
        "acceptedAnswers": [
          "1. 50\n2. 50\n3. 2\n4. 8",
          "1. 50\n2. 50\n3. 2\n4. 8\n"
        ],
        "explanation": "fn1은 주소를 받아 i를 50으로 바꾼다. fn2는 복사본만 바꾸므로 i는 50이다. 배열 첫 원소는 2, 네 번째 원소는 8이다. 출력의 번호와 줄바꿈도 확인한다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "code": "#include <stdio.h>\n \nvoid fn1(int* i) { *i = 50; }\nvoid fn2(int i) { i = 60; }\n \nvoid fn34(int* p) {\n    printf(\"3. %d\\n\", *p);\n    printf(\"4. %d\\n\", *(p + 3));\n}\n \nint main() {\n    int i = 30;\n    int list[] = {2, 4, 6, 8, 10};\n \n    fn1(&i);\n    printf(\"1. %d\\n\", i);\n \n    fn2(i);\n    printf(\"2. %d\\n\", i);\n \n    fn34(list);\n \n    return 0;\n}"
      },
      {
        "id": "2026-2-restored-10",
        "prompt": "다음은 네트워크 A, B, C에 속한 호스트의 IP 주소 목록이다. 괄호 안에 들어갈 수 있는 IP 주소를 각각 하나씩 쓰시오.",
        "answer": "192.168.35.72\n129.200.8.249\n192.168.36.249",
        "acceptedAnswers": [
          "192.168.35.72\n129.200.8.249\n192.168.36.249"
        ],
        "explanation": "2번은 192.168.35.0/24, 4번은 129.200.8.0/22, 5번은 192.168.36.0/24의 사용 가능한 호스트여야 한다. 제시된 답은 예시이므로 조건을 만족하는 다른 IP도 정답 처리한다.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "subnet-hosts",
        "tables": [
          {
            "title": "호스트 IP / 서브넷",
            "columns": [
              "번호",
              "IP 주소 / 서브넷"
            ],
            "rows": [
              [
                "1",
                "192.168.35.3/24"
              ],
              [
                "2",
                "(     )"
              ],
              [
                "3",
                "129.200.10.72/22"
              ],
              [
                "4",
                "(     )"
              ],
              [
                "5",
                "(     )"
              ],
              [
                "6",
                "192.168.36.16/24"
              ]
            ]
          }
        ],
        "verificationNote": "복원본에 2·4·5번 서브넷이 별도로 적혀 있지 않다. 각각 1·3·6번 호스트와 같은 네트워크라는 복원 의도를 전제로 채점한다. IP는 2, 4, 5번 순서로 한 줄씩 입력한다.",
        "subnetChecks": [
          {
            "networkAddress": "192.168.35.0",
            "prefixLength": 24,
            "excludedAddresses": [
              "192.168.35.3"
            ]
          },
          {
            "networkAddress": "129.200.8.0",
            "prefixLength": 22,
            "excludedAddresses": [
              "129.200.10.72"
            ]
          },
          {
            "networkAddress": "192.168.36.0",
            "prefixLength": 24,
            "excludedAddresses": [
              "192.168.36.16"
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-11",
        "prompt": "다음은 GoF(Gang of Four) 디자인 패턴에 대한 설명이다. 괄호 안에 들어갈 알맞은 용어를 쓰시오.\n\n( )는 서로 관련 있는 여러 객체(제품군)를 생성하기 위한 인터페이스를 제공하는 생성 패턴으로, Kit이라고도 불린다. 이 패턴을 사용하면 구체적인 클래스를 지정하지 않고도 연관된 제품군 전체를 한 번에 변경할 수 있다.",
        "answer": "Abstract Factory",
        "acceptedAnswers": [
          "Abstract Factory",
          "추상 팩토리",
          "추상팩토리",
          "AbstractFactory"
        ],
        "explanation": "구체 클래스를 고정하지 않고 관련된 제품군을 만들 수 있는 추상 팩토리 패턴이다.",
        "tags": [
          "디자인패턴"
        ],
        "gradingMode": "theory"
      },
      {
        "id": "2026-2-restored-12",
        "prompt": "다음 <학생> 테이블에서 성이 '이'씨인 학생의 정보를 조회하되, 학번을 기준으로 내림차순 정렬하여 출력하고자 한다. SQL문의 괄호 안에 들어갈 알맞은 내용을 각각 쓰시오.",
        "answer": "이%\nDESC",
        "acceptedAnswers": [
          "이%\nDESC",
          "이%, DESC",
          "이% DESC",
          "1. 이%\n2. DESC",
          "'이%'\nDESC"
        ],
        "explanation": "성이 이로 시작하는 이름은 이% 패턴으로 찾는다. 학번 내림차순은 DESC다. 두 답을 순서대로 한 줄씩 입력한다.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "code": "SELECT * FROM 학생\nWHERE 성명 LIKE '( 1 )'\nORDER BY 학번 ( 2 );",
        "tables": [
          {
            "title": "학생",
            "columns": [
              "학번",
              "성명",
              "학과"
            ],
            "rows": [
              [
                "2020001",
                "이몽룡",
                "컴퓨터공학과"
              ],
              [
                "2020002",
                "김철수",
                "전자공학과"
              ],
              [
                "2020003",
                "이순신",
                "정보통신공학과"
              ],
              [
                "2020004",
                "박영희",
                "컴퓨터공학과"
              ]
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-13",
        "prompt": "다음 <A>, <B> 테이블과 SQL문을 참고하여, SQL문을 실행했을 때 출력되는 RESULT 값을 구하시오.",
        "answer": "3",
        "acceptedAnswers": [
          "3"
        ],
        "explanation": "x=10의 내부 조회는 빈 집합이어서 AVG가 NULL이다. x=20,30,40의 비교 평균은 각각 10, 40/3, 75/4다. 세 행만 조건을 만족해 COUNT는 3이다.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "code": "SELECT COUNT(*) AS RESULT\nFROM A\nWHERE x > (\n  SELECT AVG(y)\n  FROM B\n  WHERE B.id IN (\n    SELECT A2.id\n    FROM A AS A2\n    WHERE A2.x < A.x\n  )\n);",
        "tables": [
          {
            "title": "A",
            "columns": [
              "id",
              "x"
            ],
            "rows": [
              [
                "1",
                "10"
              ],
              [
                "2",
                "20"
              ],
              [
                "3",
                "30"
              ],
              [
                "4",
                "40"
              ]
            ]
          },
          {
            "title": "B",
            "columns": [
              "id",
              "y"
            ],
            "rows": [
              [
                "1",
                "5"
              ],
              [
                "1",
                "15"
              ],
              [
                "2",
                "20"
              ],
              [
                "3",
                "35"
              ],
              [
                "5",
                "50"
              ]
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-14",
        "prompt": "다음 <A>, <B> 테이블과 SQL문을 참고하여, SQL문을 실행했을 때 출력되는 결과값을 구하시오.",
        "answer": "2",
        "acceptedAnswers": [
          "2"
        ],
        "explanation": "오른쪽 B의 id=1,3,4를 유지한다. id=1은 A의 두 행과 일치하지만 WHERE A.id IS NULL에서 빠진다. 미일치 id=3,4만 남아 2다.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "code": "SELECT COUNT(*)\nFROM A\nRIGHT OUTER JOIN B\n  ON A.id = B.id\nWHERE A.id IS NULL;",
        "tables": [
          {
            "title": "A",
            "columns": [
              "id",
              "v"
            ],
            "rows": [
              [
                "1",
                "10"
              ],
              [
                "1",
                "20"
              ],
              [
                "2",
                "30"
              ]
            ]
          },
          {
            "title": "B",
            "columns": [
              "id",
              "w"
            ],
            "rows": [
              [
                "1",
                "100"
              ],
              [
                "3",
                "300"
              ],
              [
                "4",
                "400"
              ]
            ]
          }
        ]
      },
      {
        "id": "2026-2-restored-15",
        "prompt": "다음은 Java 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "509",
        "acceptedAnswers": [
          "509"
        ],
        "explanation": "aaa.hap()은 1+5+3=9다. bbb.hap()은 오버라이딩된 B의 메서드로 a*c=10*50=500이다. 출력은 509다.",
        "tags": [
          "Java"
        ],
        "gradingMode": "code-output",
        "code": "class A {\n    int a;\n    private int b;\n    protected int c;\n \n    void set(int aa, int bb, int cc) {\n        a = aa;\n        b = bb;\n        c = cc;\n    }\n \n    int hap() { return a + b + c; }\n}\n \nclass B extends A {\n    public int hap() { return a * c; }\n}\n \npublic class Main {\n    public static void main(String[] args) {\n        A aaa = new A();\n        B bbb = new B();\n \n        aaa.set(1, 5, 3);\n        bbb.set(10, 30, 50);\n \n        System.out.print(aaa.hap() + bbb.hap());\n    }\n}"
      },
      {
        "id": "2026-2-restored-16",
        "prompt": "다음은 IP 주소 서브네팅(Subnetting)에 대한 설명이다. 물음에 답하시오.\n\n10.0.0.0/27 네트워크를 동일한 크기의 2개 서브넷으로 분할하였다.\n\n- 첫 번째 서브넷: 10.0.0.0 ~ 10.0.0.15\n\n- 두 번째 서브넷: 10.0.0.16 ~ 10.0.0.31\n\n이때 10.0.0.1이 속한 서브넷의 프리픽스 길이(비트 수)를 구하시오.",
        "answer": "28",
        "acceptedAnswers": [
          "28"
        ],
        "explanation": "/27을 둘로 나누므로 네트워크 비트를 하나 더 쓴다. 주소 16개짜리 서브넷은 /28이다.",
        "tags": [
          "네트워크"
        ],
        "gradingMode": "theory"
      },
      {
        "id": "2026-2-restored-17",
        "prompt": "다음 설명에 해당하는 보안 기술 용어를 쓰시오.\n\n입력값의 길이와 상관없이 항상 정해진 길이의 결과값을 만들어내는 암호 기술이 있다.\n\n이 기술은 단방향성을 가지고 있어 결과값만으로는 원래의 입력값을 알아낼 수 없으며, 서로 다른 두 입력값이 같은 결과값을 만들어내는 경우가 최대한 발생하지 않도록 설계되어야 한다.\n\n이러한 성질을 가진 암호 기술을 무엇이라 하는가?",
        "answer": "해시",
        "acceptedAnswers": [
          "해시",
          "해시 함수",
          "해시함수",
          "Hash",
          "Hash Function"
        ],
        "explanation": "고정 길이 결과, 단방향성, 충돌 저항성 설명이므로 암호학적 해시다.",
        "tags": [
          "보안"
        ],
        "gradingMode": "theory"
      },
      {
        "id": "2026-2-restored-18",
        "prompt": "다음은 C언어 코드에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.",
        "answer": "1",
        "acceptedAnswers": [
          "1"
        ],
        "explanation": "종료 조건 n<=1에는 음수도 포함된다. c(-1)=-1, c(0)=0, c(1)=1, c(2)=0, c(3)=0, c(4)=1, c(5)=1이다.",
        "tags": [
          "C"
        ],
        "gradingMode": "code-output",
        "code": "#include <stdio.h>\n \nint c(int n) {\n    if (n <= 1) return n;\n    return c(n - 1) + c(n - 3);\n}\n \nint main() {\n    printf(\"%d\", c(5));\n    return 0;\n}"
      },
      {
        "id": "2026-2-restored-19",
        "prompt": "다음은 SEASON이라는 도메인을 정의하면서, 입력 가능한 값을 봄/여름/가을/겨울로 제한하는 SQL문이다. 괄호 안에 들어갈 알맞은 키워드를 쓰시오",
        "answer": "CHECK",
        "acceptedAnswers": [
          "CHECK"
        ],
        "explanation": "도메인에 허용할 값을 조건으로 제한하는 키워드는 CHECK다.",
        "tags": [
          "SQL"
        ],
        "gradingMode": "theory",
        "code": "CREATE DOMAIN SEASON AS VARCHAR(6)\n  (     ) (VALUE IN ('spring', 'summer', 'autumn', 'winter'));"
      },
      {
        "id": "2026-2-restored-20",
        "prompt": "아래 표에서 나타나고 있는 정규형을 작성하시오.",
        "answer": "제3정규형",
        "acceptedAnswers": [
          "제3정규형",
          "제 3정규형",
          "3NF",
          "3정규형",
          "제3 정규형"
        ],
        "explanation": "복원 게시글은 제3정규형을 제시한다. 강사번호→강좌명과 (고객아이디, 강좌명)→강사번호라는 업무 종속을 가정하면 강좌명은 후보키 구성 속성이므로 3NF이지만 BCNF는 아니다. 표의 현재 값만으로 모든 함수 종속을 확정할 수는 없다.",
        "tags": [
          "정규화"
        ],
        "gradingMode": "theory",
        "tables": [
          {
            "title": "수강 정보",
            "columns": [
              "고객아이디",
              "강좌명",
              "강사번호"
            ],
            "rows": [
              [
                "apple",
                "영어회화",
                "P001"
              ],
              [
                "banana",
                "기초토익",
                "P002"
              ],
              [
                "carrot",
                "영어회화",
                "P001"
              ],
              [
                "carrot",
                "기초토익",
                "P004"
              ],
              [
                "orange",
                "영어회화",
                "P003"
              ],
              [
                "orange",
                "기초토익",
                "P004"
              ]
            ]
          }
        ],
        "verificationNote": "공식 정답이 아닌 복원 답안이다. 함수 종속과 후보키 조건이 원문에 명시되지 않아 정규형을 표만으로 유일하게 확정할 수 없다."
      }
    ]
  }
];
