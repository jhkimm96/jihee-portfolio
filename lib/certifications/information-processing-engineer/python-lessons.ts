import type { ProgrammingLesson } from "./types";

export const pythonLessons: ProgrammingLesson[] = [
  {
    id: "py-slices", conceptId: "python-slice", language: "Python", priority: 1, title: "슬라이싱의 방향과 경계",
    rule: "현재 시퀀스에 인덱스를 붙이고 step 방향을 정한다. 시작은 포함, 끝은 제외한다.",
    trap: "음수 step에서 생략한 start는 맨 끝, 생략한 stop은 맨 앞 바깥이다. 직접 적은 -1은 마지막 원소다. 음수 step은 start > stop, 양수 step은 start < stop이어야 결과가 나온다. 연속 슬라이싱은 중간 결과에 인덱스를 0부터 다시 붙인다.",
    examples: [
      { id: "py-slice-basic", title: "범위와 양수 간격", code: "s = 'ABCDEFG'\nprint(s[1:6:2])", output: "BDF", steps: [{ line: 1, explanation: "0~6과 -7~-1을 원소에 붙인다.", bindings: ["s → ABCDEFG"] }, { line: 2, explanation: "1에서 시작해 2칸씩, 6 전에 멈춘다.", bindings: ["선택 인덱스 1 → 3 → 5"], output: "BDF" }] },
      { id: "py-slice-negative", title: "음수 인덱스", code: "s = 'ABCDEFG'\nprint(s[-5:-1])", output: "CDEF", steps: [{ line: 1, explanation: "길이는 7이다.", bindings: ["-5 → 2", "-1 → 6"] }, { line: 2, explanation: "2~5를 선택하고 끝 6은 제외한다.", bindings: ["2 → 3 → 4 → 5"], output: "CDEF" }] },
      { id: "py-slice-reverse", title: "생략한 끝과 -1", code: "s = 'ABCDEFG'\nprint(s[::-1])\nprint(repr(s[:-1:-1]))", output: "GFEDCBA\n''", steps: [
        { line: 1, explanation: "원소마다 양수 번호와 음수 번호를 함께 붙인다. 음수 번호는 길이 7을 더하면 양수 번호가 된다.", bindings: ["A B C D E F G", "0 1 2 3 4 5 6", "-7 -6 -5 -4 -3 -2 -1"] },
        { line: 2, explanation: "step이 음수면 생략한 값의 뜻이 바뀐다. 생략한 start는 맨 끝 6, 생략한 stop은 0보다 앞의 바깥 위치다. 이 바깥 위치는 숫자로 적을 방법이 없어 생략으로만 표현한다.", bindings: ["start 생략 → 6", "stop 생략 → 맨 앞 바깥", "6 → 5 → 4 → 3 → 2 → 1 → 0"], output: "GFEDCBA" },
        { line: 3, explanation: "start는 또 생략했으니 6이다. stop은 직접 적은 -1이다. -1은 '맨 앞까지'가 아니라 마지막 원소 G의 번호다.", bindings: ["start 생략 → 6", "stop -1 → 7 + (-1) = 6"], output: "GFEDCBA" },
        { line: 3, explanation: "시작 6이 곧 제외할 끝 6이라 첫 칸부터 멈춘다. 빈 문자열은 그냥 출력하면 보이지 않으므로 repr로 ''를 표시한다.", bindings: ["6에서 시작, 6은 제외 → 선택 없음", "결과 ''"], output: "GFEDCBA\n''" },
      ] },
      { id: "py-slice-backstep", title: "역방향 간격", code: "s = 'ABCDEFG'\nprint(s[5:1:-2])", output: "FD", steps: [{ line: 1, explanation: "음수 step이므로 왼쪽으로 간다.", bindings: ["start=5, stop=1, step=-2"] }, { line: 2, explanation: "5, 3을 고르고 1은 제외한다.", bindings: ["5(F) → 3(D)"], output: "FD" }] },
      { id: "py-slice-empty", title: "방향이 맞지 않는 범위", code: "s = 'ABCDEFG'\nprint(repr(s[1:5:-1]))\nprint(s[5:1:-1])\nprint(repr(s[5:1]))", output: "''\nFEDC\n''", steps: [
        { line: 2, explanation: "마지막 -1이 step이다. 음수이므로 1에서 왼쪽(←)으로 간다. 그런데 끝 5는 1보다 오른쪽에 있다.", bindings: ["start=1, stop=5, step=-1", "진행 방향 ← / 끝 위치 →"] },
        { line: 2, explanation: "왼쪽으로 가면 번호가 작아질 뿐 5에 닿지 않는다. 그래서 첫 칸도 고르지 않는다. 음수 step은 start가 stop보다 커야 원소가 나온다.", bindings: ["1 > 5 ? 아니오 → 선택 없음"], output: "''" },
        { line: 3, explanation: "방향을 맞추면 5에서 왼쪽으로 가며 고르고, 끝 1에서 멈춘다.", bindings: ["5 > 1 이므로 진행", "5(F) → 4(E) → 3(D) → 2(C)"], output: "''\nFEDC" },
        { line: 4, explanation: "양수 step도 같다. step을 생략하면 1이라 오른쪽(→)으로 가는데 끝 1이 시작 5보다 왼쪽에 있다.", bindings: ["start=5, stop=1, step=1", "5 < 1 ? 아니오 → 선택 없음"], output: "''\nFEDC\n''" },
      ] },
      { id: "py-slice-bounds", title: "범위 초과와 단일 인덱싱", code: "s = 'ABC'\nprint(s[-99:99])\ntry:\n    print(s[99])\nexcept IndexError:\n    print('IndexError')", output: "ABC\nIndexError", steps: [{ line: 2, explanation: "슬라이스 경계는 가능한 범위로 조정된다.", bindings: ["-99:99 → 0:3"], output: "ABC" }, { line: 6, explanation: "단일 인덱스 99는 조정되지 않고 오류가 난다.", bindings: ["except IndexError 실행"], output: "ABC\nIndexError" }] },
      { id: "py-slice-chain", title: "연속 슬라이싱", code: "s = 'ABCDEFG'\nt = s[1:]\nprint(t)\nprint(t[::-2])\nprint(s[1:][::-2])", output: "BCDEFG\nGEC\nGEC", steps: [
        { line: 2, explanation: "s[1:]은 인덱스 1부터 끝까지다. 결과는 새 문자열이다.", bindings: ["t = 'BCDEFG'"] },
        { line: 3, explanation: "중간 결과에는 번호를 0부터 다시 붙인다. 원래 s의 번호 1~6은 더 이상 쓰지 않는다.", bindings: ["B=0 C=1 D=2 E=3 F=4 G=5"], output: "BCDEFG" },
        { line: 4, explanation: "step -2는 왼쪽으로 2칸씩이다. 생략한 start는 t의 맨 끝 5, 생략한 stop은 맨 앞 바깥이다.", bindings: ["5(G) → 3(E) → 1(C)", "다음 -1은 맨 앞 바깥이라 종료"], output: "BCDEFG\nGEC" },
        { line: 5, explanation: "s[1:][::-2]는 2~4행을 한 줄로 쓴 것이다. 왼쪽 슬라이스를 먼저 계산하고 그 결과에 오른쪽 슬라이스를 적용한다.", bindings: ["s[1:] → 'BCDEFG'", "'BCDEFG'[::-2] → 'GEC'"], output: "BCDEFG\nGEC\nGEC" },
      ] },
      { id: "py-slice-zero", title: "간격 0은 오류", code: "try:\n    print('ABC'[::0])\nexcept ValueError:\n    print('ValueError')", output: "ValueError", steps: [{ line: 2, explanation: "간격 0은 같은 자리에서 진행할 수 없어 허용하지 않는다.", bindings: ["ValueError 발생"] }, { line: 4, explanation: "오류 이름을 출력한다.", bindings: ["except 실행"], output: "ValueError" }] },
      { id: "py-slice-assignment", title: "슬라이스 대입과 삭제", code: "a = [0, 1, 2, 3]\na[1:3] = [8, 9, 10]\ndel a[::2]\nprint(a)", output: "[8, 10]", steps: [{ line: 2, explanation: "step=1 구간은 다른 길이의 원소들로 교체할 수 있다.", bindings: ["a → [0, 8, 9, 10, 3]"] }, { line: 3, explanation: "현재 인덱스 0, 2, 4를 한 번에 삭제한다.", bindings: ["남은 원소 8, 10"], output: "[8, 10]" }] },
      { id: "py-slice-extended", title: "확장 슬라이스 대입", code: "a = [0, 1, 2, 3]\na[::2] = [8, 9]\nprint(a)\ntry:\n    a[::2] = [7]\nexcept ValueError:\n    print('ValueError')\na[1:3] = [5]\nprint(a)", output: "[8, 1, 9, 3]\nValueError\n[8, 5, 3]", steps: [
        { line: 2, explanation: "a[::2]는 0번과 2번, 띄엄띄엄 떨어진 두 칸이다. 우변의 8, 9를 순서대로 한 칸씩 넣는다.", bindings: ["선택 칸 0, 2 (2칸) ← 값 8, 9 (2개)", "a → [8, 1, 9, 3]"] },
        { line: 3, explanation: "두 칸만 바뀌고 사이의 1, 3은 그대로다.", bindings: ["a = [8, 1, 9, 3]"], output: "[8, 1, 9, 3]" },
        { line: 5, explanation: "다시 두 칸을 골랐는데 값은 1개다. 떨어진 칸 사이에 1, 3이 끼어 있어 칸을 줄이거나 늘릴 방법이 없다. 그래서 칸 수와 값 개수가 다르면 ValueError다.", bindings: ["선택 칸 2개 ≠ 값 1개", "대입 실패 → a는 그대로"] },
        { line: 7, explanation: "except가 오류 이름을 출력한다.", bindings: ["except ValueError 실행"], output: "[8, 1, 9, 3]\nValueError" },
        { line: 8, explanation: "step이 1인 a[1:3]은 붙어 있는 구간 1~2번이다. 구간을 통째로 빼고 [5]를 끼우므로 값 개수가 달라도 된다.", bindings: ["1, 9 제거 → 그 자리에 5", "a → [8, 5, 3]"] },
        { line: 9, explanation: "길이가 4에서 3으로 줄었다. 길이를 바꿀 수 있는 것은 step 1 슬라이스뿐이다.", bindings: ["a = [8, 5, 3]"], output: "[8, 1, 9, 3]\nValueError\n[8, 5, 3]" },
      ] },
    ],
  },
  {
    id: "py-sharing", conceptId: "python-copy", language: "Python", priority: 1, title: "대입·얕은 복사·깊은 복사",
    rule: "변수는 값을 담는 상자가 아니라 객체를 가리키는 이름이다. 바깥 리스트와 안쪽 리스트를 서로 다른 상자로 그리고, 어떤 이름이 어떤 상자를 가리키는지 화살표로 적는다.", trap: "a[:]는 바깥 상자만 새로 만드는 얕은 복사다. 안쪽 상자를 고치면(append) 양쪽에 보이고, 칸에 새 상자를 넣으면(c[0] = ...) 그 바깥 상자만 바뀐다. +=로 리스트를 수정하는 것과 +로 새 리스트를 만드는 것도 다르다.",
    examples: [
      { id: "py-copy-alias", title: "별명과 얕은 복사", code: "a = [[1], [2]]\nb = a\nc = a[:]\nc[0].append(9)\nb[1] = [7]\nprint(a)\nprint(c)", output: "[[1, 9], [7]]\n[[1, 9], [2]]", steps: [
        { line: 1, explanation: "상자 3개가 생긴다. 안쪽 리스트 [1]을 I1, [2]를 I2, 둘을 담은 바깥 리스트를 L1이라 부른다. 이름표는 설명용이고 실제 주소가 아니다.", bindings: ["a → L1", "L1 = [→I1, →I2]", "I1 = [1], I2 = [2]"] },
        { line: 2, explanation: "b = a는 복사가 아니다. 같은 상자 L1에 이름 b를 하나 더 붙인다(별명).", bindings: ["a → L1", "b → L1 (같은 상자)"] },
        { line: 3, explanation: "a[:]는 바깥 상자 L2를 새로 만들고, 칸 안의 화살표는 그대로 베낀다. 그래서 L2도 같은 I1, I2를 가리킨다. 이것이 얕은 복사다.", bindings: ["c → L2 (새 상자)", "L1 = [→I1, →I2]", "L2 = [→I1, →I2] (안쪽 공유)"] },
        { line: 4, explanation: "c[0]은 I1이다. append는 I1 상자 자체를 고친다. L1도 I1을 가리키므로 a에서도 보인다.", bindings: ["I1 = [1, 9]", "L1, L2 모두 → I1"] },
        { line: 5, explanation: "b는 L1이다. b[1] = [7]은 L1의 두 번째 칸 화살표를 새 상자 [7]로 바꾼다. I2를 고친 것이 아니므로 L2는 여전히 I2를 가리킨다.", bindings: ["L1 = [→I1, →[7]]", "L2 = [→I1, →I2]", "I2 = [2] 그대로"] },
        { line: 6, explanation: "a → L1 → [I1, [7]]을 따라 읽는다.", bindings: ["a = [[1, 9], [7]]"], output: "[[1, 9], [7]]" },
        { line: 7, explanation: "c → L2 → [I1, I2]를 따라 읽는다. 공유한 I1의 9는 보이고, L1만 바꾼 [7]은 보이지 않는다.", bindings: ["c = [[1, 9], [2]]"], output: "[[1, 9], [7]]\n[[1, 9], [2]]" },
      ] },
      { id: "py-copy-deep", title: "깊은 복사와 반복 생성", code: "import copy\na = [[0] * 2] * 2\nb = copy.deepcopy(a)\na[0][0] = 5\nprint(a)\nprint(b)", output: "[[5, 0], [5, 0]]\n[[0, 0], [0, 0]]", steps: [{ line: 2, explanation: "곱셈은 내부 리스트 하나의 참조를 두 번 넣는다.", bindings: ["a → [I1, I1]", "I1=[0,0]"] }, { line: 3, explanation: "deepcopy로 별도 내부 객체를 만든다. 복사본 안의 공유 관계는 유지된다.", bindings: ["b → [I2, I2]"] }, { line: 4, explanation: "I1만 수정한다. b의 I2는 그대로다.", bindings: ["I1=[5,0]", "I2=[0,0]"], output: "[[5, 0], [5, 0]]\n[[0, 0], [0, 0]]" }] },
      { id: "py-copy-plus", title: "+=와 새 리스트", code: "a = [1]\nb = a\na += [2]\na = a + [3]\nprint(a)\nprint(b)", output: "[1, 2, 3]\n[1, 2]", steps: [{ line: 3, explanation: "리스트의 +=는 기존 L1을 확장한다.", bindings: ["a,b → L1=[1,2]"] }, { line: 4, explanation: "+는 새 L2를 만들고 a만 재연결한다.", bindings: ["a → L2=[1,2,3]", "b → L1=[1,2]"], output: "[1, 2, 3]\n[1, 2]" }] },
    ],
  },
  {
    id: "py-methods", conceptId: "python-methods", language: "Python", priority: 1, title: "리스트 메서드와 반환값",
    rule: "호출 후 원본과 반환값을 별도로 적는다. 수정 메서드 다수는 None을 반환하지만 pop은 원소를 반환한다.", trap: "append는 인자 하나를 넣고 extend는 반복 가능한 인자의 원소를 각각 넣는다.",
    solvingSteps: ["호출 줄마다 원본 리스트의 상태를 새로 적는다.", "그 호출의 반환값을 따로 적는다. sort·append·extend·remove는 None, pop은 꺼낸 원소, sorted는 새 리스트다.", "변수에 대입한 것이 원본인지 반환값인지 확인한 뒤 출력을 읽는다."],
    examples: [
      { id: "py-method-sort", title: "sort와 sorted", code: "a = [3, 1, 2]\nb = sorted(a)\nc = a.sort()\nprint(a, b, c)", output: "[1, 2, 3] [1, 2, 3] None", steps: [{ line: 2, explanation: "sorted는 새 리스트를 반환하고 원본을 유지한다.", bindings: ["a=[3,1,2]", "b=[1,2,3]"] }, { line: 3, explanation: "sort는 a를 정렬하고 None을 반환한다.", bindings: ["a=[1,2,3]", "c=None"], output: "[1, 2, 3] [1, 2, 3] None" }] },
      { id: "py-method-append", title: "추가와 제거", code: "a = [1]\na.append([2, 3])\na.extend([4, 5])\nx = a.pop(1)\na.remove(4)\nprint(a, x)", output: "[1, 5] [2, 3]", steps: [{ line: 3, explanation: "append는 리스트 한 개, extend는 두 정수를 추가한다.", bindings: ["a=[1,[2,3],4,5]"] }, { line: 4, explanation: "pop은 인덱스 1의 원소를 제거해 반환한다.", bindings: ["a=[1,4,5]", "x=[2,3]"] }, { line: 5, explanation: "remove는 값 4를 찾아 제거한다.", bindings: ["a=[1,5]"], output: "[1, 5] [2, 3]" }] },
    ],
  },
  {
    id: "py-comprehensions", conceptId: "python-comprehension", language: "Python", priority: 2, title: "컴프리헨션을 반복문으로 펼치기",
    rule: "for를 왼쪽부터 중첩하고 if를 통과한 경우에 결과 식을 평가한다.", trap: "딕셔너리는 같은 키를 다시 만들면 값만 덮어쓰며 기존 키 위치는 유지한다.",
    solvingSteps: ["컴프리헨션의 for를 왼쪽부터 바깥 반복문 → 안쪽 반복문 순서로 펼쳐 쓴다.", "가장 안쪽에서 if 조건을 확인하고, 통과할 때만 맨 앞의 결과 식을 계산한다.", "리스트는 차례로 추가하고, 딕셔너리는 같은 키가 오면 값만 덮어쓰며, 집합은 중복을 버린다."],
    examples: [
      { id: "py-comprehension-list", title: "중첩 for와 조건", code: "a = [x * 10 + y for x in range(1, 3) for y in range(3) if y != 1]\nprint(a)", output: "[10, 12, 20, 22]", steps: [{ line: 1, explanation: "바깥 x=1에서 안쪽 y=0,1,2를 돈다. y=1은 제외한다.", bindings: ["a=[10,12]"] }, { line: 1, explanation: "x=2에서도 같은 순서로 추가한다.", bindings: ["a=[10,12,20,22]"], output: "[10, 12, 20, 22]" }] },
      { id: "py-comprehension-dict", title: "키 충돌과 집합", code: "d = {x % 2: x for x in range(5)}\ns = {x % 2 for x in range(5)}\nprint(list(d.items()))\nprint(sorted(s))", output: "[(0, 4), (1, 3)]\n[0, 1]", steps: [{ line: 1, explanation: "0,1 키를 처음 삽입한 뒤 값만 갱신한다.", bindings: ["0:0 → 0:2 → 0:4", "1:1 → 1:3"] }, { line: 2, explanation: "집합은 중복을 제거한다. 출력 순서는 sorted로 고정한다.", bindings: ["s의 원소 {0,1}"], output: "[(0, 4), (1, 3)]\n[0, 1]" }] },
    ],
  },
  {
    id: "py-functions", conceptId: "python-functions", language: "Python", priority: 2, title: "함수 인자·기본값·변수 범위",
    rule: "호출하면 매개변수 이름이 인자로 받은 객체를 가리킨다(복사가 아니다). 그 객체를 고치는 것(append)과 이름을 다른 객체로 옮기는 것(x = ...)은 다르다. 기본값은 함수를 정의할 때 한 번만 만든다.", trap: "리스트 기본값은 호출 사이에 공유될 수 있다. global은 모듈 변수, nonlocal은 바깥 함수 변수의 연결을 바꾼다. def는 함수를 등록만 하고 실행은 호출할 때 시작한다.",
    solvingSteps: ["def 줄은 함수 등록만 하고 건너뛴다. 실제 실행은 맨 아래 호출 줄에서 시작한다.", "호출 줄에서 매개변수 이름이 인자 객체를 가리키도록 화살표를 그린다(L1 같은 이름표 사용).", "함수 안 각 줄이 객체를 고치는지, 이름만 다른 객체로 옮기는지 구분한다.", "global·nonlocal이 있으면 그 이름이 어느 범위의 변수인지 먼저 표시한다.", "return 값을 호출 줄 자리에 넣고, 호출자 쪽 이름이 가리키는 객체로 출력을 읽는다."],
    examples: [
      { id: "py-function-rebind", title: "수정과 재대입", code: "def f(x):\n    x.append(2)\n    x = [9]\na = [1]\nf(a)\nprint(a)", output: "[1, 2]", steps: [
        { line: 1, explanation: "def는 함수 f를 등록만 한다. 안쪽 2~3행은 아직 실행하지 않는다.", bindings: ["f → 함수 등록"] },
        { line: 4, explanation: "리스트 [1]을 만들고 L1이라 부른다. a가 L1을 가리킨다.", bindings: ["a → L1 = [1]"] },
        { line: 5, explanation: "f(a)를 호출하면 매개변수 x가 a와 같은 L1을 가리킨다. 리스트를 복사하지 않는다.", bindings: ["a → L1", "x → L1 (같은 상자)"] },
        { line: 2, explanation: "x.append(2)는 L1 상자 자체를 고친다. a도 L1을 가리키므로 a에서도 보인다.", bindings: ["L1 = [1, 2]"] },
        { line: 3, explanation: "x = [9]는 새 상자 L2를 만들고 지역 이름 x만 L2로 옮긴다. a의 화살표는 그대로 L1이다. 함수가 끝나면 x는 사라진다.", bindings: ["x → L2 = [9]", "a → L1 = [1, 2]"] },
        { line: 6, explanation: "a가 가리키는 L1을 출력한다.", bindings: ["a → L1 = [1, 2]"], output: "[1, 2]" },
      ] },
      { id: "py-function-default", title: "기본 리스트의 누적", code: "def f(x, a=[]):\n    a.append(x)\n    return a\nprint(f(1))\nprint(f(2))", output: "[1]\n[1, 2]", steps: [{ line: 1, explanation: "함수 정의 때 기본 리스트 D를 한 번 만든다.", bindings: ["기본값 → D=[]"] }, { line: 4, explanation: "첫 호출은 D에 1을 추가한다.", bindings: ["D=[1]"], output: "[1]" }, { line: 5, explanation: "두 번째도 같은 D에 2를 추가한다. 독립 기본값은 None을 받고 함수 안에서 새 리스트를 만드는 방식으로 작성한다.", bindings: ["D=[1,2]"], output: "[1]\n[1, 2]" }] },
      { id: "py-function-scope", title: "global과 nonlocal", code: "x = 1\ndef outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x += 2\n    inner()\n    return x\ndef change():\n    global x\n    x += 3\nprint(outer())\nchange()\nprint(x)", output: "12\n4", steps: [
        { line: 1, explanation: "모듈(파일 맨 바깥) 변수 x를 만든다. 2~11행의 def는 함수 등록만 하고 건너뛴다.", bindings: ["모듈 x = 1", "outer, change → 함수 등록"] },
        { line: 12, explanation: "실행은 여기서 이어진다. print 안의 outer()를 먼저 호출한다.", bindings: ["호출 스택 outer"] },
        { line: 3, explanation: "outer 안의 x = 10은 outer의 지역 변수다. 모듈 x와 다른 변수다.", bindings: ["모듈 x = 1", "outer x = 10"] },
        { line: 7, explanation: "4행 def는 inner를 등록만 했다. 7행에서 inner를 호출한다.", bindings: ["호출 스택 outer → inner"] },
        { line: 6, explanation: "5행 nonlocal x 때문에 inner의 x는 바로 바깥 함수 outer의 x다. 10에 2를 더한다.", bindings: ["outer x = 12", "모듈 x = 1 그대로"] },
        { line: 8, explanation: "inner가 끝나고 outer가 자기 x인 12를 반환한다. 12행 print가 출력한다.", bindings: ["outer() → 12"], output: "12" },
        { line: 13, explanation: "change()를 호출한다.", bindings: ["호출 스택 change"], output: "12" },
        { line: 11, explanation: "10행 global x 때문에 change의 x는 모듈 x다. 1에 3을 더한다.", bindings: ["모듈 x = 4"], output: "12" },
        { line: 14, explanation: "모듈 x를 출력한다. outer의 x(12)는 outer가 끝나며 사라졌다.", bindings: ["모듈 x = 4"], output: "12\n4" },
      ] },
    ],
  },
  {
    id: "py-classes", conceptId: "python-classes", language: "Python", priority: 2, title: "클래스·인스턴스·상속",
    rule: "클래스는 설계도, 인스턴스는 그 설계도로 만든 객체(O1, O2)다. self는 메서드를 호출한 그 객체다. 속성을 읽을 때는 객체 안 → 클래스 → 부모 클래스 순서로 찾는다.", trap: "클래스 몸체에 둔 리스트는 클래스에 하나만 있어 모든 인스턴스가 공유한다. 반면 a.x = 9 같은 대입은 찾아 올라가지 않고 그 객체 안에 바로 쓴다.",
    solvingSteps: ["class 몸체의 변수(클래스 속성)를 클래스 상자에 적는다. def는 메서드 등록만 한다.", "A(...)를 만날 때마다 새 객체 상자(O1, O2)를 그리고 __init__을 실행해 self.속성을 그 상자에 적는다.", "속성을 읽을 때는 객체 안 → 클래스 → 부모 클래스 순서로 찾는다.", "속성에 대입(a.x = ...)하면 찾지 않고 그 객체 상자에 바로 쓴다.", "메서드 호출은 실제 객체의 클래스에서 먼저 찾고, super()는 부모 클래스의 메서드로 넘어간다."],
    examples: [
      { id: "py-class-sharing", title: "공유 속성과 개별 속성", code: "class A:\n    items = []\n    def __init__(self, x):\n        self.x = x\na, b = A(1), A(2)\na.items.append(7)\na.x = 9\nprint(a.x, b.x, b.items)", output: "9 2 [7]", steps: [
        { line: 2, explanation: "class 몸체를 실행하면 items 리스트 L1이 클래스 A에 하나 생긴다. 3행 __init__은 등록만 한다.", bindings: ["A 상자: items → L1 = []"] },
        { line: 5, explanation: "A(1)은 새 객체 O1을 만들고 __init__을 실행한다. self가 O1이므로 self.x = 1은 O1 안에 쓴다. A(2)도 같은 방식으로 O2를 만든다.", bindings: ["a → O1 { x: 1 }", "b → O2 { x: 2 }", "A { items → L1 = [] }"] },
        { line: 6, explanation: "a.items를 읽는다. O1 안에 items가 없으니 클래스 A에서 찾고, 찾은 L1에 7을 넣는다.", bindings: ["O1 안 → 없음 → A.items → L1", "L1 = [7]"] },
        { line: 7, explanation: "a.x = 9는 대입이라 찾지 않고 O1 안에 바로 쓴다. O2는 영향이 없다.", bindings: ["O1 { x: 9 }", "O2 { x: 2 }"] },
        { line: 8, explanation: "a.x는 O1에서 9, b.x는 O2에서 2다. b.items는 O2에 없어 클래스 A의 L1을 찾는다. a로 넣은 7이 보인다.", bindings: ["a.x → 9", "b.x → 2", "b.items → A.items → L1 = [7]"], output: "9 2 [7]" },
      ] },
      { id: "py-class-inheritance", title: "재정의와 super", code: "class A:\n    def f(self):\n        return 2\nclass B(A):\n    def f(self):\n        return super().f() + 3\nb = B()\nprint(b.f())", output: "5", steps: [
        { line: 4, explanation: "1~6행은 클래스 등록이다. B(A)는 B의 부모가 A라는 뜻이고, 두 클래스 모두 f를 가진다(재정의).", bindings: ["A { f → 2 반환 }", "B(A) { f → super().f() + 3 }"] },
        { line: 7, explanation: "B 객체 O1을 만든다.", bindings: ["b → O1 (B의 객체)"] },
        { line: 8, explanation: "b.f()는 O1의 클래스 B에서 f를 먼저 찾는다. B에 있으므로 B.f를 실행한다.", bindings: ["찾는 순서 O1 → B(발견)", "호출 스택 B.f"] },
        { line: 6, explanation: "super().f()는 부모 A의 f로 넘어간다.", bindings: ["호출 스택 B.f → A.f"] },
        { line: 3, explanation: "A.f가 2를 반환한다.", bindings: ["super().f() → 2"] },
        { line: 6, explanation: "B.f로 돌아와 2 + 3을 계산해 반환한다.", bindings: ["2 + 3 = 5"] },
        { line: 8, explanation: "print가 반환값 5를 출력한다.", bindings: ["b.f() → 5"], output: "5" },
      ] },
    ],
  },
  {
    id: "py-recursion", conceptId: "python-recursion", language: "Python", priority: 2, title: "재귀 호출·반환·결합",
    rule: "내려갈 때 인자와 호출을 쌓고, 올라올 때 반환식과 출력을 처리한다.", trap: "호출 전 출력과 호출 후 출력은 순서가 다르다. 트리 재귀에서는 각 호출의 지역 변수를 별개로 둔다.",
    solvingSteps: ["호출마다 새 칸을 만들어 그 호출의 인자와 지역 변수를 적는다(호출 스택).", "종료 조건에 닿을 때까지 내려가며, 재귀 호출보다 앞에 있는 출력을 먼저 처리한다.", "가장 깊은 호출부터 반환하며 올라오고, 재귀 호출보다 뒤에 있는 출력과 반환식을 처리한다.", "반환값은 그 호출을 부른 줄의 자리에 넣어 계산을 이어 간다."],
    examples: [
      { id: "py-recursion-order", title: "재귀 전후 출력", code: "def f(n):\n    if n == 0:\n        return\n    print(n, end='')\n    f(n - 1)\n    print(n, end='')\nf(3)", output: "321123", steps: [{ line: 5, explanation: "f(3)→f(2)→f(1)→f(0). 내려가며 321을 출력한다.", bindings: ["호출 스택 f(3) → f(2) → f(1) → f(0)"], output: "321" }, { line: 6, explanation: "f(0) 반환 후 f(1), f(2), f(3)의 남은 출력을 한다.", bindings: ["반환 순서 0 → 1 → 2 → 3"], output: "321123" }] },
      { id: "py-recursion-combined", title: "클래스·컴프리헨션·재귀 결합", code: "class Node:\n    def __init__(self, value, children):\n        self.value, self.children = value, children\n    def total(self):\n        return self.value + sum([c.total() for c in self.children])\nr = Node(1, [Node(2, []), Node(3, [])])\nprint(r.total())", output: "6", steps: [{ line: 6, explanation: "루트 1에 리프 2와 3을 연결한다.", bindings: ["루트(1) → 리프(2), 리프(3)"] }, { line: 5, explanation: "리프는 children=[]이므로 sum([])=0이다.", bindings: ["리프 total=2,3"] }, { line: 5, explanation: "컴프리헨션 결과 [2,3]의 합에 루트 1을 더한다.", bindings: ["1+sum([2,3])=6"], output: "6" }] },
    ],
  },
  {
    id: "py-operations", conceptId: "python-control", language: "Python", priority: 3, title: "연산·조건·동일성",
    rule: "//는 아래쪽 정수로 내림한다. and/or는 bool 변환 결과가 아니라 선택된 피연산자를 반환한다.", trap: "==는 값 비교, is는 객체 동일성이다. 작은 정수나 문자열 캐싱에 기대어 답을 정하지 않는다.",
    solvingSteps: ["연산 우선순위로 괄호를 먼저 쳐 둔다. **가 단항 -보다, 비교가 not보다 먼저다.", "반복문은 반복마다 변수 값과 출력을 한 줄씩 적고, continue는 다음 반복, break는 반복 밖으로 표시한다.", "for·while의 else는 break 없이 끝났을 때만, try의 else는 예외가 없을 때만 실행한다.", "예외가 나면 try의 남은 줄을 건너뛰고 맞는 except로 간 뒤, finally를 마지막에 실행한다."],
    examples: [
      { id: "py-op-negative", title: "음수 나눗셈과 단락 평가", code: "print(-7 // 3, -7 % 3)\nprint(0 or 5, [] and 9)\na = [1]\nb = [1]\nprint(a == b, a is b)", output: "-3 2\n5 []\nTrue False", steps: [{ line: 1, explanation: "-7=(-3)*3+2를 만족한다.", bindings: ["몫=-3", "나머지=2"], output: "-3 2" }, { line: 2, explanation: "0은 거짓이라 or는 5, 빈 리스트는 거짓이라 and는 []를 반환한다.", bindings: ["0 or 5 → 5", "[] and 9 → []"], output: "-3 2\n5 []" }, { line: 5, explanation: "내용은 같지만 별도로 만든 객체다.", bindings: ["a → L1", "b → L2"], output: "-3 2\n5 []\nTrue False" }] },
      { id: "py-op-precedence", title: "거듭제곱·논리·비트", code: "print(-2 ** 2, (-2) ** 2)\nprint(5 & 3, 5 | 3, 5 ^ 3)\nprint(not 1 == 1)", output: "-4 4\n1 7 6\nFalse", steps: [{ line: 1, explanation: "거듭제곱이 단항 -보다 먼저 묶인다.", bindings: ["-(2**2)=-4", "(-2)**2=4"], output: "-4 4" }, { line: 2, explanation: "101과 011을 자리별로 계산한다.", bindings: ["AND=001", "OR=111", "XOR=110"], output: "-4 4\n1 7 6" }, { line: 3, explanation: "not은 비교 결과 True를 뒤집는다.", bindings: ["not (1==1)"], output: "-4 4\n1 7 6\nFalse" }] },
    ],
  },
  {
    id: "py-loops", conceptId: "python-control", language: "Python", priority: 3, title: "순회·언패킹·반복문 else",
    rule: "for의 else는 break로 중단되지 않았을 때 실행한다. zip은 기본적으로 가장 짧은 입력 길이에서 끝난다.", trap: "continue는 다음 반복으로, break는 반복 밖으로 간다. else는 if와 연결된 것이 아니다.",
    examples: [
      { id: "py-loop-else", title: "break와 else", code: "for x in range(3):\n    if x == 1:\n        continue\n    print(x, end='')\nelse:\n    print('E', end='')\nfor x in range(3):\n    if x == 1:\n        break\nelse:\n    print('X', end='')", output: "02E", steps: [{ line: 4, explanation: "0 출력, 1 건너뛰기, 2 출력이다.", bindings: ["반복 x=0,1,2"], output: "02" }, { line: 6, explanation: "첫 for는 정상 종료하므로 E를 출력한다.", bindings: ["break 없음"], output: "02E" }, { line: 9, explanation: "둘째 for는 break로 종료해 X를 출력하지 않는다.", bindings: ["둘째 else 생략"], output: "02E" }] },
      { id: "py-loop-unpack", title: "enumerate·zip·패킹", code: "a, *b, c = (1, 2, 3, 4)\nprint(a, b, c)\nprint(list(enumerate(zip('AB', [7]), start=1)))", output: "1 [2, 3] 4\n[(1, ('A', 7))]", steps: [{ line: 1, explanation: "양 끝을 a,c에 넣고 남은 값은 리스트 b로 모은다.", bindings: ["a=1", "b=[2,3]", "c=4"], output: "1 [2, 3] 4" }, { line: 3, explanation: "zip은 길이 1에서 끝나고 enumerate가 1부터 번호를 붙인다.", bindings: ["zip → ('A',7)", "번호 1"], output: "1 [2, 3] 4\n[(1, ('A', 7))]" }] },
    ],
  },
  {
    id: "py-strings", conceptId: "python-strings", language: "Python", priority: 3, title: "문자열 변환과 정확한 출력",
    rule: "문자열 메서드는 원본 문자열을 바꾸지 않는다. 서식은 {값:채움 정렬 폭 .정밀도 타입} 순서로 읽고, ord·chr는 문자와 코드 번호를 서로 바꾼다. print의 sep와 end, repr에 따른 표시를 구분한다.", trap: "find는 없으면 -1, index는 없으면 ValueError다. strip의 인자는 부분 문자열이 아니라 제거할 문자 집합이다. 숫자는 기본 오른쪽 정렬, 문자열은 기본 왼쪽 정렬이다. 소문자 코드는 대문자보다 32 크다.",
    examples: [
      { id: "py-string-transform", title: "strip·replace·split·join", code: "s = ' abba '\nt = s.strip().replace('a', 'X')\nprint(s == t, t)\nprint('-'.join('a  b'.split()))", output: "False XbbX\na-b", steps: [{ line: 2, explanation: "새 문자열 abba를 얻고 a를 X로 바꾼 새 문자열을 얻는다.", bindings: ["s=' abba '", "t='XbbX'"] }, { line: 4, explanation: "기본 split은 연속 공백을 묶어 나누고 join으로 연결한다.", bindings: ["['a','b'] → a-b"], output: "False XbbX\na-b" }] },
      { id: "py-string-print", title: "서식·문자 코드·검색", code: "print(f'{7:03d}', ord('A'), chr(66), sep='|')\nprint('abc'.find('z'))\ntry:\n    'abc'.index('z')\nexcept ValueError:\n    print('ValueError')", output: "007|65|B\n-1\nValueError", steps: [
        { line: 1, explanation: "f-string의 {} 안에서 콜론(:) 뒤는 서식이다. 03d는 0 = 빈자리를 0으로 채움, 3 = 전체 폭 3칸, d = 정수라는 뜻이다.", bindings: ["{7:03d} → 0 0 7 → '007'"] },
        { line: 1, explanation: "ord는 문자 → 코드 번호, chr는 코드 번호 → 문자다. 대문자 A가 65이고 알파벳 순서대로 1씩 커지므로 66은 B다.", bindings: ["ord('A') → 65", "chr(66) → 'B'"] },
        { line: 1, explanation: "print는 값 사이에 sep를 넣는다. 기본값은 공백인데 여기서는 '|'다.", bindings: ["'007' | 65 | 'B'"], output: "007|65|B" },
        { line: 2, explanation: "find는 못 찾으면 -1을 돌려준다.", bindings: ["'abc'.find('z') → -1"], output: "007|65|B\n-1" },
        { line: 4, explanation: "index는 못 찾으면 -1 대신 ValueError를 일으킨다. except가 받아서 출력한다.", bindings: ["'abc'.index('z') → ValueError", "except 실행"], output: "007|65|B\n-1\nValueError" },
      ] },
      { id: "py-string-charcode", title: "문자 코드 계산", code: "print(ord('A'), ord('a'), ord('0'), ord(' '))\nprint(chr(65), chr(97), chr(48))\nprint(ord('a') - ord('A'))\nprint(chr(ord('C') + 1), chr(ord('c') - 32))\nprint(ord('7') - ord('0'))", output: "65 97 48 32\nA a 0\n32\nD C\n7", steps: [
        { line: 1, explanation: "외워 둘 시작 번호는 네 개다. 대문자 A=65, 소문자 a=97, 숫자 문자 '0'=48, 공백=32. 나머지는 순서대로 1씩 커진다.", bindings: ["'A' → 65 … 'Z' → 90", "'a' → 97 … 'z' → 122", "'0' → 48 … '9' → 57", "' ' → 32"], output: "65 97 48 32" },
        { line: 2, explanation: "chr는 반대로 번호를 문자로 바꾼다.", bindings: ["65 → 'A'", "97 → 'a'", "48 → '0'"], output: "65 97 48 32\nA a 0" },
        { line: 3, explanation: "같은 알파벳의 소문자는 대문자보다 항상 32 크다.", bindings: ["97 - 65 = 32"], output: "65 97 48 32\nA a 0\n32" },
        { line: 4, explanation: "번호에 더하고 빼서 다른 문자를 만든다. C(67)+1은 D(68), 소문자 c(99)-32는 대문자 C(67)다.", bindings: ["chr(67 + 1) → 'D'", "chr(99 - 32) → 'C'"], output: "65 97 48 32\nA a 0\n32\nD C" },
        { line: 5, explanation: "숫자 문자에서 '0'의 번호를 빼면 실제 숫자가 된다. '7'(55) - '0'(48) = 7.", bindings: ["55 - 48 = 7"], output: "65 97 48 32\nA a 0\n32\nD C\n7" },
      ] },
      { id: "py-string-format", title: "서식 지정자 읽기", code: "n = 3.14159\nprint(f'[{n:.2f}]')\nprint(f'[{n:8.3f}]')\nprint(f'[{42:<6}]', f'[{42:>6}]', f'[{42:^6}]')\nprint(f'[{42:*^6}]', f'{1234567:,}', f'{0.25:.0%}')\nprint(f'{255:b}', f'{255:o}', f'{255:x}', f'{255:#X}')", output: "[3.14]\n[   3.142]\n[42    ] [    42] [  42  ]\n[**42**] 1,234,567 25%\n11111111 377 ff 0XFF", steps: [
        { line: 1, explanation: "서식은 {값:채움 정렬 폭 .정밀도 타입} 순서로 읽는다. 대괄호 [ ]는 빈칸이 몇 개인지 보이도록 붙인 것이다.", bindings: ["n = 3.14159"] },
        { line: 2, explanation: ".2f는 소수점 아래 2자리 실수다. 셋째 자리에서 반올림한다.", bindings: ["3.14159 → 3.14"], output: "[3.14]" },
        { line: 3, explanation: "8.3f는 전체 폭 8칸, 소수점 아래 3자리다. 3.142는 점까지 5칸이라 앞에 빈칸 3개가 붙는다. 숫자는 기본이 오른쪽 정렬이다.", bindings: ["'3.142' = 5칸", "빈칸 3 + 5칸 = 8칸"], output: "[3.14]\n[   3.142]" },
        { line: 4, explanation: "< 왼쪽, > 오른쪽, ^ 가운데 정렬이다. 폭 6칸 중 42가 2칸이라 빈칸이 4개 남는다.", bindings: ["<6 → '42' + 빈칸4", ">6 → 빈칸4 + '42'", "^6 → 빈칸2 + '42' + 빈칸2"], output: "[3.14]\n[   3.142]\n[42    ] [    42] [  42  ]" },
        { line: 5, explanation: "정렬 기호 앞의 글자는 채움 문자다(*^6). 쉼표(,)는 세 자리마다 구분, %는 100을 곱하고 % 기호를 붙인다.", bindings: ["*^6 → '**42**'", ", → '1,234,567'", ".0% → 0.25 × 100 = 25%"], output: "[3.14]\n[   3.142]\n[42    ] [    42] [  42  ]\n[**42**] 1,234,567 25%" },
        { line: 6, explanation: "b는 2진수, o는 8진수, x는 16진수(소문자), X는 16진수(대문자)다. #을 붙이면 0b, 0o, 0x 접두사가 붙는다.", bindings: ["255 → b 11111111", "255 → o 377", "255 → x ff", "255 → #X 0XFF"], output: "[3.14]\n[   3.142]\n[42    ] [    42] [  42  ]\n[**42**] 1,234,567 25%\n11111111 377 ff 0XFF" },
      ] },
      { id: "py-string-print-options", title: "% 서식·format·print 옵션", code: "print('%5.1f|%-4d|%s' % (3.14159, 7, 'ok'))\nprint('{1}-{0}'.format('a', 'b'))\nprint(1, 2, 3, sep=', ', end='!\\n')\nprint('A', end='')\nprint('B')", output: "  3.1|7   |ok\nb-a\n1, 2, 3!\nAB", steps: [
        { line: 1, explanation: "% 서식도 같은 규칙이다. %5.1f는 폭 5칸·소수 1자리, %-4d는 폭 4칸 왼쪽 정렬(-) 정수, %s는 문자열이다. 값은 뒤의 튜플에서 순서대로 채운다.", bindings: ["%5.1f ← 3.14159 → '  3.1'", "%-4d ← 7 → '7   '", "%s ← 'ok'"], output: "  3.1|7   |ok" },
        { line: 2, explanation: "format의 {0}, {1}은 인자 번호다. {1}이 먼저 오므로 두 번째 인자 b가 앞에 나온다.", bindings: ["{0} → 'a'", "{1} → 'b'"], output: "  3.1|7   |ok\nb-a" },
        { line: 3, explanation: "sep는 값 사이, end는 맨 끝에 붙는다. 기본값은 sep=' ', end='\\n'(줄바꿈)이다.", bindings: ["1 + ', ' + 2 + ', ' + 3 + '!\\n'"], output: "  3.1|7   |ok\nb-a\n1, 2, 3!" },
        { line: 4, explanation: "end=''이면 줄바꿈 없이 끝나서 다음 print가 같은 줄에 이어진다.", bindings: ["출력 'A', 줄바꿈 없음"] },
        { line: 5, explanation: "B가 A 바로 뒤에 붙는다.", bindings: ["같은 줄 → 'AB'"], output: "  3.1|7   |ok\nb-a\n1, 2, 3!\nAB" },
      ] },
      { id: "py-string-range", title: "range 펼치기", code: "print(list(range(5)))\nprint(list(range(2, 8, 3)))\nprint(list(range(5, 0, -2)))\nprint(len(range(1, 10, 2)))", output: "[0, 1, 2, 3, 4]\n[2, 5]\n[5, 3, 1]\n5", steps: [
        { line: 1, explanation: "range(끝)은 0부터 시작하고 끝은 제외한다. 슬라이싱처럼 시작 포함, 끝 제외다.", bindings: ["0 1 2 3 4 (5 제외)"], output: "[0, 1, 2, 3, 4]" },
        { line: 2, explanation: "range(시작, 끝, 간격)이다. 2에서 3씩 더하고 8에 닿기 전에 멈춘다.", bindings: ["2 → 5 → (8은 제외)"], output: "[0, 1, 2, 3, 4]\n[2, 5]" },
        { line: 3, explanation: "간격이 음수면 내려간다. 5에서 2씩 빼고 0은 제외한다.", bindings: ["5 → 3 → 1 → (-1은 0을 지나침)"], output: "[0, 1, 2, 3, 4]\n[2, 5]\n[5, 3, 1]" },
        { line: 4, explanation: "1, 3, 5, 7, 9로 5개다.", bindings: ["1 3 5 7 9"], output: "[0, 1, 2, 3, 4]\n[2, 5]\n[5, 3, 1]\n5" },
      ] },
    ],
  },
  {
    id: "py-collections", conceptId: "python-collections", language: "Python", priority: 3, title: "dict·set의 갱신과 순서",
    rule: "dict는 삽입 순서를 유지하고 set은 순서를 보장하지 않는다. 집합 출력은 정렬해서 비교한다.", trap: "dict의 get은 기본값을 읽기만 하고 setdefault는 없는 키를 삽입한다. remove는 없으면 오류, discard는 없어도 괜찮다.",
    examples: [
      { id: "py-dict-update", title: "get과 setdefault", code: "d = {'a': 1}\nprint(d.get('b', 9))\nd.setdefault('b', 2)\nd.update(a=3)\nprint(list(d.items()))", output: "9\n[('a', 3), ('b', 2)]", steps: [{ line: 2, explanation: "get으로 9를 반환해도 b를 삽입하지 않는다.", bindings: ["d={'a':1}"], output: "9" }, { line: 4, explanation: "b를 새로 넣고 기존 a의 값만 갱신한다.", bindings: ["키 순서 a,b"], output: "9\n[('a', 3), ('b', 2)]" }] },
      { id: "py-set-operations", title: "집합 연산", code: "a, b = {1, 2}, {2, 3}\na.discard(9)\nprint(sorted(a | b))\nprint(sorted(a & b))\nprint(sorted(a - b))", output: "[1, 2, 3]\n[2]\n[1]", steps: [{ line: 2, explanation: "없는 9를 discard해도 오류가 없다.", bindings: ["a의 원소 1,2"] }, { line: 5, explanation: "합집합, 교집합, 차집합을 각각 계산한다.", bindings: ["합 1,2,3", "교 2", "차 1"], output: "[1, 2, 3]\n[2]\n[1]" }] },
    ],
  },
  {
    id: "py-lambda", conceptId: "python-functions", language: "Python", priority: 3, title: "람다·map·filter·정렬 기준",
    rule: "lambda는 식 하나의 값을 반환하는 함수를 만든다. map/filter는 Python 3에서 지연 순회하므로 list로 결과를 확인한다.", trap: "sorted의 key는 정렬할 기준값이지 비교 함수가 아니다. 같은 키끼리는 원래 순서가 유지된다.",
    examples: [
      { id: "py-lambda-sort", title: "기준값과 안정 정렬", code: "a = ['bb', 'a', 'cc']\nprint(sorted(a, key=lambda x: len(x)))\nprint(a)", output: "['a', 'bb', 'cc']\n['bb', 'a', 'cc']", steps: [{ line: 2, explanation: "기준 길이는 2,1,2다. 길이 2인 bb,cc의 상대 순서는 유지한다.", bindings: ["새 리스트 a,bb,cc"] }, { line: 3, explanation: "원본은 수정되지 않는다.", bindings: ["원본 bb,a,cc"], output: "['a', 'bb', 'cc']\n['bb', 'a', 'cc']" }] },
      { id: "py-lambda-map", title: "필터 후 변환", code: "a = range(5)\nb = filter(lambda x: x % 2, a)\nc = map(lambda x: x * x, b)\nprint(list(c))\nprint(list(c))", output: "[1, 9]\n[]", steps: [{ line: 2, explanation: "홀수 1,3만 통과시킨다.", bindings: ["b → 지연 필터"] }, { line: 4, explanation: "list가 순회하면서 1,9를 만든다.", bindings: ["c 소진"], output: "[1, 9]" }, { line: 5, explanation: "소진된 iterator는 다시 같은 결과를 주지 않는다.", bindings: ["남은 원소 없음"], output: "[1, 9]\n[]" }] },
    ],
  },
  {
    id: "py-exceptions", conceptId: "python-control", language: "Python", priority: 3, title: "예외·else·finally·return",
    rule: "예외 뒤 try의 남은 부분을 건너뛰고 해당 except를 실행한다. try의 else는 예외 없이 끝났을 때, finally는 일반적인 제어 흐름에서 마지막에 실행한다.", trap: "finally에서 새로 return하면 앞의 반환을 덮는다. 반환식 평가와 객체의 이후 변경은 구분한다.",
    examples: [
      { id: "py-exception-flow", title: "예외 흐름", code: "try:\n    print('A', end='')\n    1 // 0\n    print('B', end='')\nexcept ZeroDivisionError:\n    print('C', end='')\nelse:\n    print('D', end='')\nfinally:\n    print('E', end='')", output: "ACE", steps: [{ line: 3, explanation: "A 다음에 예외가 나서 B는 건너뛴다.", bindings: ["ZeroDivisionError"], output: "A" }, { line: 6, explanation: "except가 C를 출력하고 else는 실행하지 않는다.", bindings: ["else 생략"], output: "AC" }, { line: 10, explanation: "finally가 E를 출력한다.", bindings: ["종료"], output: "ACE" }] },
      { id: "py-exception-return", title: "finally의 반환 덮어쓰기", code: "def f():\n    try:\n        return 1\n    finally:\n        return 2\nprint(f())", output: "2", steps: [{ line: 3, explanation: "반환값 1을 준비하지만 아직 호출자에게 돌아가지 않았다.", bindings: ["대기 반환 1"] }, { line: 5, explanation: "finally의 return 2가 앞 반환을 대체한다. 실무에서는 피할 패턴이다.", bindings: ["최종 반환 2"], output: "2" }] },
    ],
  },
];
