import type { ProgrammingLesson } from "./types";

export const pythonLessons: ProgrammingLesson[] = [
  {
    id: "py-slices", conceptId: "python-slice", language: "Python", priority: 1, title: "슬라이싱의 방향과 경계",
    rule: "현재 시퀀스에 인덱스를 붙이고 step 방향을 정한다. 시작은 포함, 끝은 제외한다.",
    trap: "음수 step에서 생략한 끝은 맨 앞 바깥 경계다. 명시한 -1은 마지막 원소다. 연속 슬라이싱은 중간 결과에 인덱스를 다시 붙인다.",
    examples: [
      { id: "py-slice-basic", title: "범위와 양수 간격", code: "s = 'ABCDEFG'\nprint(s[1:6:2])", output: "BDF", steps: [{ line: 1, explanation: "0~6과 -7~-1을 원소에 붙인다.", bindings: ["s → ABCDEFG"] }, { line: 2, explanation: "1에서 시작해 2칸씩, 6 전에 멈춘다.", bindings: ["선택 인덱스 1 → 3 → 5"], output: "BDF" }] },
      { id: "py-slice-negative", title: "음수 인덱스", code: "s = 'ABCDEFG'\nprint(s[-5:-1])", output: "CDEF", steps: [{ line: 1, explanation: "길이는 7이다.", bindings: ["-5 → 2", "-1 → 6"] }, { line: 2, explanation: "2~5를 선택하고 끝 6은 제외한다.", bindings: ["2 → 3 → 4 → 5"], output: "CDEF" }] },
      { id: "py-slice-reverse", title: "생략한 끝과 -1", code: "s = 'ABCDEFG'\nprint(s[::-1])\nprint(repr(s[:-1:-1]))", output: "GFEDCBA\n''", steps: [{ line: 2, explanation: "생략한 끝은 인덱스 0보다 앞이다. 전체를 역순 선택한다.", bindings: ["6 → 5 → 4 → 3 → 2 → 1 → 0"], output: "GFEDCBA" }, { line: 3, explanation: "명시한 -1은 6이다. 시작 6부터 끝 6을 제외하면 선택할 것이 없다. repr로 빈 문자열을 표시한다.", bindings: ["start=6, stop=6, step=-1"], output: "GFEDCBA\n''" }] },
      { id: "py-slice-backstep", title: "역방향 간격", code: "s = 'ABCDEFG'\nprint(s[5:1:-2])", output: "FD", steps: [{ line: 1, explanation: "음수 step이므로 왼쪽으로 간다.", bindings: ["start=5, stop=1, step=-2"] }, { line: 2, explanation: "5, 3을 고르고 1은 제외한다.", bindings: ["5(F) → 3(D)"], output: "FD" }] },
      { id: "py-slice-empty", title: "방향이 맞지 않는 범위", code: "s = 'ABCDEFG'\nprint(repr(s[1:5:-1]))", output: "''", steps: [{ line: 1, explanation: "시작 1에서 왼쪽으로 가는데 끝은 오른쪽 5다.", bindings: ["start=1, stop=5"] }, { line: 2, explanation: "첫 원소부터 역방향 조건 i > stop을 만족하지 않는다.", bindings: ["선택 없음"], output: "''" }] },
      { id: "py-slice-bounds", title: "범위 초과와 단일 인덱싱", code: "s = 'ABC'\nprint(s[-99:99])\ntry:\n    print(s[99])\nexcept IndexError:\n    print('IndexError')", output: "ABC\nIndexError", steps: [{ line: 2, explanation: "슬라이스 경계는 가능한 범위로 조정된다.", bindings: ["-99:99 → 0:3"], output: "ABC" }, { line: 6, explanation: "단일 인덱스 99는 조정되지 않고 오류가 난다.", bindings: ["except IndexError 실행"], output: "ABC\nIndexError" }] },
      { id: "py-slice-chain", title: "연속 슬라이싱", code: "s = 'ABCDEFG'\nprint(s[1:][::-2])", output: "GEC", steps: [{ line: 2, explanation: "첫 결과 BCDEFG에 0~5를 새로 붙인다.", bindings: ["중간 결과 BCDEFG"] }, { line: 2, explanation: "새 인덱스 5, 3, 1을 선택한다.", bindings: ["5(G) → 3(E) → 1(C)"], output: "GEC" }] },
      { id: "py-slice-zero", title: "간격 0은 오류", code: "try:\n    print('ABC'[::0])\nexcept ValueError:\n    print('ValueError')", output: "ValueError", steps: [{ line: 2, explanation: "간격 0은 같은 자리에서 진행할 수 없어 허용하지 않는다.", bindings: ["ValueError 발생"] }, { line: 4, explanation: "오류 이름을 출력한다.", bindings: ["except 실행"], output: "ValueError" }] },
      { id: "py-slice-assignment", title: "슬라이스 대입과 삭제", code: "a = [0, 1, 2, 3]\na[1:3] = [8, 9, 10]\ndel a[::2]\nprint(a)", output: "[8, 10]", steps: [{ line: 2, explanation: "step=1 구간은 다른 길이의 원소들로 교체할 수 있다.", bindings: ["a → [0, 8, 9, 10, 3]"] }, { line: 3, explanation: "현재 인덱스 0, 2, 4를 한 번에 삭제한다.", bindings: ["남은 원소 8, 10"], output: "[8, 10]" }] },
      { id: "py-slice-extended", title: "확장 슬라이스 대입", code: "a = [0, 1, 2, 3]\na[::2] = [8, 9]\nprint(a)\ntry:\n    a[::2] = [7]\nexcept ValueError:\n    print('ValueError')", output: "[8, 1, 9, 3]\nValueError", steps: [{ line: 2, explanation: "인덱스 0과 2의 두 자리에 두 값을 넣는다.", bindings: ["a → [8, 1, 9, 3]"], output: "[8, 1, 9, 3]" }, { line: 5, explanation: "step이 1이 아닌 대입은 선택 자리 수와 우변 길이가 같아야 한다.", bindings: ["2자리 ≠ 1개"], output: "[8, 1, 9, 3]\nValueError" }] },
    ],
  },
  {
    id: "py-sharing", conceptId: "python-copy", language: "Python", priority: 1, title: "대입·얕은 복사·깊은 복사",
    rule: "변수는 객체를 가리킨다. 바깥 리스트와 내부 리스트를 서로 다른 객체로 그린다.", trap: "a[:]는 깊은 복사가 아니다. +=로 리스트를 수정하는 것과 +로 새 리스트를 만드는 것도 다르다.",
    examples: [
      { id: "py-copy-alias", title: "별명과 얕은 복사", code: "a = [[1], [2]]\nb = a\nc = a[:]\nc[0].append(9)\nb[1] = [7]\nprint(a)\nprint(c)", output: "[[1, 9], [7]]\n[[1, 9], [2]]", steps: [{ line: 3, explanation: "a와 b는 바깥 객체 L1, c는 바깥 객체 L2다. 내부 객체는 공유한다.", bindings: ["a,b → L1 → I1,I2", "c → L2 → I1,I2"] }, { line: 4, explanation: "I1을 수정하므로 두 바깥 리스트에서 모두 보인다.", bindings: ["I1=[1,9]"] }, { line: 5, explanation: "L1의 두 번째 연결만 새 객체로 바꾼다.", bindings: ["L1 → I1,[7]", "L2 → I1,I2"], output: "[[1, 9], [7]]\n[[1, 9], [2]]" }] },
      { id: "py-copy-deep", title: "깊은 복사와 반복 생성", code: "import copy\na = [[0] * 2] * 2\nb = copy.deepcopy(a)\na[0][0] = 5\nprint(a)\nprint(b)", output: "[[5, 0], [5, 0]]\n[[0, 0], [0, 0]]", steps: [{ line: 2, explanation: "곱셈은 내부 리스트 하나의 참조를 두 번 넣는다.", bindings: ["a → [I1, I1]", "I1=[0,0]"] }, { line: 3, explanation: "deepcopy로 별도 내부 객체를 만든다. 복사본 안의 공유 관계는 유지된다.", bindings: ["b → [I2, I2]"] }, { line: 4, explanation: "I1만 수정한다. b의 I2는 그대로다.", bindings: ["I1=[5,0]", "I2=[0,0]"], output: "[[5, 0], [5, 0]]\n[[0, 0], [0, 0]]" }] },
      { id: "py-copy-plus", title: "+=와 새 리스트", code: "a = [1]\nb = a\na += [2]\na = a + [3]\nprint(a)\nprint(b)", output: "[1, 2, 3]\n[1, 2]", steps: [{ line: 3, explanation: "리스트의 +=는 기존 L1을 확장한다.", bindings: ["a,b → L1=[1,2]"] }, { line: 4, explanation: "+는 새 L2를 만들고 a만 재연결한다.", bindings: ["a → L2=[1,2,3]", "b → L1=[1,2]"], output: "[1, 2, 3]\n[1, 2]" }] },
    ],
  },
  {
    id: "py-methods", conceptId: "python-methods", language: "Python", priority: 1, title: "리스트 메서드와 반환값",
    rule: "호출 후 원본과 반환값을 별도로 적는다. 수정 메서드 다수는 None을 반환하지만 pop은 원소를 반환한다.", trap: "append는 인자 하나를 넣고 extend는 반복 가능한 인자의 원소를 각각 넣는다.",
    examples: [
      { id: "py-method-sort", title: "sort와 sorted", code: "a = [3, 1, 2]\nb = sorted(a)\nc = a.sort()\nprint(a, b, c)", output: "[1, 2, 3] [1, 2, 3] None", steps: [{ line: 2, explanation: "sorted는 새 리스트를 반환하고 원본을 유지한다.", bindings: ["a=[3,1,2]", "b=[1,2,3]"] }, { line: 3, explanation: "sort는 a를 정렬하고 None을 반환한다.", bindings: ["a=[1,2,3]", "c=None"], output: "[1, 2, 3] [1, 2, 3] None" }] },
      { id: "py-method-append", title: "추가와 제거", code: "a = [1]\na.append([2, 3])\na.extend([4, 5])\nx = a.pop(1)\na.remove(4)\nprint(a, x)", output: "[1, 5] [2, 3]", steps: [{ line: 3, explanation: "append는 리스트 한 개, extend는 두 정수를 추가한다.", bindings: ["a=[1,[2,3],4,5]"] }, { line: 4, explanation: "pop은 인덱스 1의 원소를 제거해 반환한다.", bindings: ["a=[1,4,5]", "x=[2,3]"] }, { line: 5, explanation: "remove는 값 4를 찾아 제거한다.", bindings: ["a=[1,5]"], output: "[1, 5] [2, 3]" }] },
    ],
  },
  {
    id: "py-comprehensions", conceptId: "python-comprehension", language: "Python", priority: 2, title: "컴프리헨션을 반복문으로 펼치기",
    rule: "for를 왼쪽부터 중첩하고 if를 통과한 경우에 결과 식을 평가한다.", trap: "딕셔너리는 같은 키를 다시 만들면 값만 덮어쓰며 기존 키 위치는 유지한다.",
    examples: [
      { id: "py-comprehension-list", title: "중첩 for와 조건", code: "a = [x * 10 + y for x in range(1, 3) for y in range(3) if y != 1]\nprint(a)", output: "[10, 12, 20, 22]", steps: [{ line: 1, explanation: "바깥 x=1에서 안쪽 y=0,1,2를 돈다. y=1은 제외한다.", bindings: ["a=[10,12]"] }, { line: 1, explanation: "x=2에서도 같은 순서로 추가한다.", bindings: ["a=[10,12,20,22]"], output: "[10, 12, 20, 22]" }] },
      { id: "py-comprehension-dict", title: "키 충돌과 집합", code: "d = {x % 2: x for x in range(5)}\ns = {x % 2 for x in range(5)}\nprint(list(d.items()))\nprint(sorted(s))", output: "[(0, 4), (1, 3)]\n[0, 1]", steps: [{ line: 1, explanation: "0,1 키를 처음 삽입한 뒤 값만 갱신한다.", bindings: ["0:0 → 0:2 → 0:4", "1:1 → 1:3"] }, { line: 2, explanation: "집합은 중복을 제거한다. 출력 순서는 sorted로 고정한다.", bindings: ["s의 원소 {0,1}"], output: "[(0, 4), (1, 3)]\n[0, 1]" }] },
    ],
  },
  {
    id: "py-functions", conceptId: "python-functions", language: "Python", priority: 2, title: "함수 인자·기본값·변수 범위",
    rule: "호출마다 매개변수 이름이 인자 객체에 연결된다. 객체 수정과 이름 재대입은 다르다. 기본값은 함수 정의 시 평가된다.", trap: "리스트 기본값은 호출 사이에 공유될 수 있다. global은 모듈 변수, nonlocal은 바깥 함수 변수의 연결을 바꾼다.",
    examples: [
      { id: "py-function-rebind", title: "수정과 재대입", code: "def f(x):\n    x.append(2)\n    x = [9]\na = [1]\nf(a)\nprint(a)", output: "[1, 2]", steps: [{ line: 5, explanation: "호출자의 a와 함수의 x가 같은 L1을 가리킨다.", bindings: ["a,x → L1=[1]"] }, { line: 2, explanation: "L1을 수정한다.", bindings: ["L1=[1,2]"] }, { line: 3, explanation: "지역 이름 x만 L2에 연결한다. a는 L1 그대로다.", bindings: ["x → L2=[9]", "a → L1=[1,2]"], output: "[1, 2]" }] },
      { id: "py-function-default", title: "기본 리스트의 누적", code: "def f(x, a=[]):\n    a.append(x)\n    return a\nprint(f(1))\nprint(f(2))", output: "[1]\n[1, 2]", steps: [{ line: 1, explanation: "함수 정의 때 기본 리스트 D를 한 번 만든다.", bindings: ["기본값 → D=[]"] }, { line: 4, explanation: "첫 호출은 D에 1을 추가한다.", bindings: ["D=[1]"], output: "[1]" }, { line: 5, explanation: "두 번째도 같은 D에 2를 추가한다. 독립 기본값은 None을 받고 함수 안에서 새 리스트를 만드는 방식으로 작성한다.", bindings: ["D=[1,2]"], output: "[1]\n[1, 2]" }] },
      { id: "py-function-scope", title: "global과 nonlocal", code: "x = 1\ndef outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x += 2\n    inner()\n    return x\ndef change():\n    global x\n    x += 3\nprint(outer())\nchange()\nprint(x)", output: "12\n4", steps: [{ line: 6, explanation: "nonlocal x는 outer의 x를 수정한다.", bindings: ["모듈 x=1", "outer x=12"], output: "12" }, { line: 11, explanation: "global x는 모듈 x를 수정한다.", bindings: ["모듈 x=4"], output: "12\n4" }] },
    ],
  },
  {
    id: "py-classes", conceptId: "python-classes", language: "Python", priority: 2, title: "클래스·인스턴스·상속",
    rule: "self는 메서드를 호출한 객체다. 인스턴스 속성과 클래스 속성을 구분한다.", trap: "클래스에 둔 가변 리스트는 공유된다. self.x 대입은 보통 그 인스턴스의 속성을 만든다.",
    examples: [
      { id: "py-class-sharing", title: "공유 속성과 개별 속성", code: "class A:\n    items = []\n    def __init__(self, x):\n        self.x = x\na, b = A(1), A(2)\na.items.append(7)\na.x = 9\nprint(a.x, b.x, b.items)", output: "9 2 [7]", steps: [{ line: 5, explanation: "두 객체의 x는 별도지만 items는 클래스의 리스트를 조회한다.", bindings: ["a → O1{x:1}", "b → O2{x:2}", "A.items → L1=[]"] }, { line: 7, explanation: "공유 리스트에 7, O1의 x에 9를 반영한다.", bindings: ["O1.x=9", "O2.x=2", "L1=[7]"], output: "9 2 [7]" }] },
      { id: "py-class-inheritance", title: "재정의와 super", code: "class A:\n    def f(self):\n        return 2\nclass B(A):\n    def f(self):\n        return super().f() + 3\nb = B()\nprint(b.f())", output: "5", steps: [{ line: 8, explanation: "실제 객체 B의 f를 호출한다.", bindings: ["b → B 객체"] }, { line: 6, explanation: "super().f()가 2를 반환하고 3을 더한다.", bindings: ["2+3=5"], output: "5" }] },
    ],
  },
  {
    id: "py-recursion", conceptId: "python-recursion", language: "Python", priority: 2, title: "재귀 호출·반환·결합",
    rule: "내려갈 때 인자와 호출을 쌓고, 올라올 때 반환식과 출력을 처리한다.", trap: "호출 전 출력과 호출 후 출력은 순서가 다르다. 트리 재귀에서는 각 호출의 지역 변수를 별개로 둔다.",
    examples: [
      { id: "py-recursion-order", title: "재귀 전후 출력", code: "def f(n):\n    if n == 0:\n        return\n    print(n, end='')\n    f(n - 1)\n    print(n, end='')\nf(3)", output: "321123", steps: [{ line: 5, explanation: "f(3)→f(2)→f(1)→f(0). 내려가며 321을 출력한다.", bindings: ["호출 스택 f(3) → f(2) → f(1) → f(0)"], output: "321" }, { line: 6, explanation: "f(0) 반환 후 f(1), f(2), f(3)의 남은 출력을 한다.", bindings: ["반환 순서 0 → 1 → 2 → 3"], output: "321123" }] },
      { id: "py-recursion-combined", title: "클래스·컴프리헨션·재귀 결합", code: "class Node:\n    def __init__(self, value, children):\n        self.value, self.children = value, children\n    def total(self):\n        return self.value + sum([c.total() for c in self.children])\nr = Node(1, [Node(2, []), Node(3, [])])\nprint(r.total())", output: "6", steps: [{ line: 6, explanation: "루트 1에 리프 2와 3을 연결한다.", bindings: ["루트(1) → 리프(2), 리프(3)"] }, { line: 5, explanation: "리프는 children=[]이므로 sum([])=0이다.", bindings: ["리프 total=2,3"] }, { line: 5, explanation: "컴프리헨션 결과 [2,3]의 합에 루트 1을 더한다.", bindings: ["1+sum([2,3])=6"], output: "6" }] },
    ],
  },
  {
    id: "py-operations", conceptId: "python-control", language: "Python", priority: 3, title: "연산·조건·동일성",
    rule: "//는 아래쪽 정수로 내림한다. and/or는 bool 변환 결과가 아니라 선택된 피연산자를 반환한다.", trap: "==는 값 비교, is는 객체 동일성이다. 작은 정수나 문자열 캐싱에 기대어 답을 정하지 않는다.",
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
    rule: "문자열 메서드는 원본 문자열을 바꾸지 않는다. sep와 end, repr에 따른 표시를 구분한다.", trap: "find는 없으면 -1, index는 없으면 ValueError다. strip의 인자는 부분 문자열이 아니라 제거할 문자 집합이다.",
    examples: [
      { id: "py-string-transform", title: "strip·replace·split·join", code: "s = ' abba '\nt = s.strip().replace('a', 'X')\nprint(s == t, t)\nprint('-'.join('a  b'.split()))", output: "False XbbX\na-b", steps: [{ line: 2, explanation: "새 문자열 abba를 얻고 a를 X로 바꾼 새 문자열을 얻는다.", bindings: ["s=' abba '", "t='XbbX'"] }, { line: 4, explanation: "기본 split은 연속 공백을 묶어 나누고 join으로 연결한다.", bindings: ["['a','b'] → a-b"], output: "False XbbX\na-b" }] },
      { id: "py-string-print", title: "서식·문자 코드·검색", code: "print(f'{7:03d}', ord('A'), chr(66), sep='|')\nprint('abc'.find('z'))\ntry:\n    'abc'.index('z')\nexcept ValueError:\n    print('ValueError')", output: "007|65|B\n-1\nValueError", steps: [{ line: 1, explanation: "정수를 폭 3, 0 채움으로 표시하고 문자 코드와 문자를 변환한다.", bindings: ["7 → 007", "A → 65", "66 → B"], output: "007|65|B" }, { line: 4, explanation: "찾지 못한 find는 -1이고 index는 예외다.", bindings: ["find=-1", "index → ValueError"], output: "007|65|B\n-1\nValueError" }] },
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
