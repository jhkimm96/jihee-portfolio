export type PythonReference = {
  id: string; name: string; group: string; level: "필수" | "보충";
  summary: string; returns: string; mutates: string; code: string; output: string; trap: string;
};

type ReferenceRow = [name: string, summary: string, returns: string, mutates: string, code: string, output: string, trap: string];

function referenceGroup(id: string, group: string, level: PythonReference["level"], rows: ReferenceRow[]): PythonReference[] {
  return rows.map(([name, summary, returns, mutates, code, output, trap]) => ({ id: `${id}-${name}`, name, group, level, summary, returns, mutates, code, output, trap }));
}

export const pythonReference: PythonReference[] = [
  ...referenceGroup("builtin", "기본 내장 함수·타입", "필수", [
    ["len", "원소 수를 센다.", "정수", "변경 없음", "print(len([1, 2, 3]))", "3", "중첩 리스트의 바깥 길이와 내부 길이는 다르다."],
    ["range", "끝을 제외하는 정수 시퀀스를 만든다.", "range 객체", "변경 없음", "print(list(range(5, 0, -2)))", "[5, 3, 1]", "간격 0은 ValueError이며 출력만으로 리스트처럼 보이지 않는다."],
    ["print", "sep로 구분하고 end로 마무리한다.", "None", "출력 수행, 인자는 변경하지 않음", "print(1, 2, sep=':', end='!')", "1:2!", "공백과 줄바꿈도 출력의 일부다."],
    ["type", "객체의 타입을 얻는다.", "타입 객체", "변경 없음", "print(type([]).__name__)", "list", "값을 변환하는 함수가 아니다."],
    ["int", "정수로 변환한다. 문자열에는 진법을 지정할 수 있다.", "정수", "변경 없음", "print(int('101', 2), int(-3.9))", "5 -3", "실수는 0 방향으로 소수부를 버린다. '3.5'를 직접 int로 바꾸면 오류다."],
    ["str", "문자열 표현으로 바꾼다.", "문자열", "변경 없음", "print(str(12) + '3')", "123", "문자열 +는 숫자 덧셈이 아니다."],
    ["list", "반복 가능한 대상의 원소로 새 리스트를 만든다.", "리스트", "원본 변경 없음", "print(list('AB'))", "['A', 'B']", "새 바깥 리스트일 뿐 깊은 복사는 아니다. iterator는 소비된다."],
    ["tuple", "반복 가능한 대상으로 튜플을 만든다.", "튜플", "변경 없음", "print(tuple([1, 2]), (1,))", "(1, 2) (1,)", "원소 하나 튜플에는 쉼표가 필요하다. 내부 가변 객체까지 불변은 아니다."],
    ["set", "중복 없는 집합을 만든다.", "집합", "원본 변경 없음", "print(sorted(set([2, 1, 2])))", "[1, 2]", "빈 집합은 set()이다. {}는 딕셔너리이며 집합 원소는 해시 가능해야 한다."],
    ["dict", "키-값 쌍으로 딕셔너리를 만든다.", "딕셔너리", "원본 변경 없음", "print(dict([('a', 1), ('a', 2)]))", "{'a': 2}", "같은 키는 나중 값이 덮는다. 키는 해시 가능해야 한다."],
    ["bool", "대상의 참·거짓 값을 구한다.", "True 또는 False", "변경 없음", "print(bool([]), bool('0'), bool(0))", "False True False", "문자열 '0'은 비어 있지 않으므로 참이다."],
  ]),
  ...referenceGroup("number", "계산·진법", "보충", [
    ["sum", "수치 원소를 합산한다.", "합계", "원본 변경 없음", "print(sum([1, 2, 3], 10))", "16", "두 번째 인자는 시작 합계다. 문자열 연결에는 join을 사용한다."],
    ["min", "최솟값 또는 key 기준 최소 원소를 고른다.", "선택 원소", "원본 변경 없음", "print(min([3, 1, 2]))", "1", "빈 입력에 기본값 없이 호출하면 ValueError다."],
    ["max", "최댓값 또는 key 기준 최대 원소를 고른다.", "선택 원소", "원본 변경 없음", "print(max(['a', 'bbb'], key=len))", "bbb", "key는 반환 원소가 아니라 선택 기준이다."],
    ["abs", "수치의 절댓값을 구한다.", "절댓값", "변경 없음", "print(abs(-7))", "7", "문자열 '-7'은 먼저 숫자로 변환해야 한다."],
    ["round", "지정 자리에서 반올림한다.", "ndigits 생략 시 정수, 그 외 수치", "변경 없음", "print(round(2.5), round(3.5))", "2 4", "정확히 중간이면 짝수 쪽이다. 이진 부동소수점 표현 오차도 고려한다."],
    ["divmod", "몫과 나머지를 함께 구한다.", "(몫, 나머지) 튜플", "변경 없음", "print(divmod(-7, 3))", "(-3, 2)", "정수에서는 (a//b, a%b)와 일치한다."],
    ["pow", "거듭제곱, 선택적으로 모듈러 연산을 한다.", "계산 결과", "변경 없음", "print(pow(2, 5), pow(2, 5, 3))", "32 2", "세 번째 인자는 거듭제곱 후 적용하는 모듈러스다."],
    ["bin", "정수를 2진 문자열로 표시한다.", "0b 접두어 문자열", "변경 없음", "print(bin(10))", "0b1010", "숫자가 아닌 문자열이며 음수는 -0b... 형태다."],
    ["oct", "정수를 8진 문자열로 표시한다.", "0o 접두어 문자열", "변경 없음", "print(oct(10))", "0o12", "십진수 12가 아니라 8진수 표현이다."],
    ["hex", "정수를 16진 문자열로 표시한다.", "0x 접두어 문자열", "변경 없음", "print(hex(26))", "0x1a", "기본 알파벳 표시는 소문자다."],
  ]),
  ...referenceGroup("list", "리스트 메서드", "필수", [
    ["append", "인자를 원소 하나로 맨 뒤에 넣는다.", "None", "원본 리스트 변경", "a=[1]\nr=a.append([2,3])\nprint(a, r)", "[1, [2, 3]] None", "리스트를 줘도 내부 원소로 풀지 않는다. extend와 비교한다."],
    ["extend", "반복 가능한 인자의 원소를 각각 추가한다.", "None", "원본 리스트 변경", "a=[1]\nr=a.extend([2,3])\nprint(a, r)", "[1, 2, 3] None", "문자열을 주면 문자들을 각각 추가한다."],
    ["insert", "인덱스 앞에 원소 하나를 넣는다.", "None", "원본 리스트 변경", "a=[1,3]\na.insert(1,2)\nprint(a)", "[1, 2, 3]", "기존 원소 대체가 아니라 삽입이다."],
    ["remove", "같은 값의 첫 원소를 제거한다.", "None", "원본 리스트 변경", "a=[2,1,2]\nr=a.remove(2)\nprint(a, r)", "[1, 2] None", "인자는 인덱스가 아닌 값이다. 없으면 ValueError다."],
    ["pop", "인덱스의 원소를 제거해 반환한다.", "제거된 원소", "원본 리스트 변경", "a=[1,2,3]\nr=a.pop(1)\nprint(a, r)", "[1, 3] 2", "생략하면 마지막 원소다. 빈 리스트나 범위 밖이면 IndexError다."],
    ["clear", "모든 원소를 제거한다.", "None", "원본 리스트 변경", "a=[1,2]\nb=a\na.clear()\nprint(a,b)", "[] []", "a=[] 재대입과 달리 공유 객체 자체를 비운다."],
    ["index", "값이 처음 등장한 인덱스를 구한다.", "정수 인덱스", "변경 없음", "print([3,2,3].index(3,1))", "2", "없으면 ValueError이며 시작 범위가 있어도 원래 리스트의 인덱스를 반환한다."],
    ["count", "같은 값의 원소 개수를 센다.", "정수", "변경 없음", "print([1,2,1].count(1))", "2", "검색된 위치가 아니라 개수다."],
    ["sort", "리스트 자체를 정렬한다.", "None", "원본 리스트 변경", "a=[3,1,2]\nr=a.sort()\nprint(a,r)", "[1, 2, 3] None", "a=a.sort()로 쓰면 a가 None이 된다. sorted와 비교한다."],
    ["reverse", "리스트 자체의 순서를 뒤집는다.", "None", "원본 리스트 변경", "a=[1,3,2]\nr=a.reverse()\nprint(a,r)", "[2, 3, 1] None", "내림차순 정렬이 아니다. 현재 순서를 뒤집을 뿐이다."],
    ["copy", "바깥 리스트의 얕은 복사본을 만든다.", "새 리스트", "원본 변경 없음", "a=[[1]]\nb=a.copy()\nb[0].append(2)\nprint(a, a is b)", "[[1, 2]] False", "내부 객체는 공유할 수 있다."],
  ]),
  ...referenceGroup("str", "문자열 메서드", "필수", [
    ["split", "구분자로 문자열을 나눈다.", "문자열 리스트", "문자열 변경 없음", "print('a  b'.split())\nprint('a  b'.split(' '))", "['a', 'b']\n['a', '', 'b']", "구분자 생략은 연속 공백을 묶지만 명시한 공백은 빈 조각을 만들 수 있다."],
    ["join", "문자열 원소 사이에 구분자를 넣어 연결한다.", "새 문자열", "원본 변경 없음", "print('-'.join(['a','b']))", "a-b", "구분자.join(문자열들) 형태다. 숫자 원소는 str 변환이 필요하다."],
    ["strip", "양 끝에서 지정 문자들을 제거한다.", "새 문자열", "원본 변경 없음", "print('abbaXabba'.strip('ab'))", "X", "'ab'라는 부분 문자열이 아니라 a와 b 문자들을 양 끝에서 제거한다."],
    ["replace", "부분 문자열을 다른 문자열로 교체한다.", "새 문자열", "원본 변경 없음", "s='aaaa'\nprint(s.replace('a','X',2),s)", "XXaa aaaa", "반환값을 저장하지 않으면 원본 이름이 가리키는 문자열은 그대로다."],
    ["find", "부분 문자열의 첫 위치를 찾는다.", "인덱스 또는 -1", "원본 변경 없음", "print('abc'.find('b'), 'abc'.find('z'))", "1 -1", "찾은 인덱스 0은 거짓이므로 if s.find(...)처럼 성공 여부를 판단하지 않는다."],
    ["index", "부분 문자열의 첫 위치를 찾는다.", "정수, 없으면 ValueError", "원본 변경 없음", "print('abca'.index('a',1))", "3", "find와 달리 없을 때 -1을 반환하지 않는다."],
    ["count", "겹치지 않는 부분 문자열의 개수를 센다.", "정수", "원본 변경 없음", "print('aaaa'.count('aa'))", "2", "겹치는 시작점 세 개를 모두 세는 방식이 아니다."],
    ["upper", "문자를 대문자로 변환한다.", "새 문자열", "원본 변경 없음", "s='Ab1'\nprint(s.upper(),s)", "AB1 Ab1", "원본은 그대로이며 숫자는 그대로 남는다."],
    ["lower", "문자를 소문자로 변환한다.", "새 문자열", "원본 변경 없음", "print('Ab1'.lower())", "ab1", "메서드 호출에 괄호를 빼면 변환이 실행되지 않는다."],
    ["isdigit", "비어 있지 않고 모든 문자가 숫자 문자이면 참이다.", "bool", "원본 변경 없음", "print('123'.isdigit(), '-1'.isdigit(), ''.isdigit())", "True False False", "부호나 소수점은 숫자 문자가 아니다. 유니코드 숫자도 포함하므로 int 변환 가능성과 완전히 같지 않다."],
    ["isalpha", "비어 있지 않고 모든 문자가 문자이면 참이다.", "bool", "원본 변경 없음", "print('Ab'.isalpha(), 'a1'.isalpha(), ''.isalpha())", "True False False", "공백은 문자로 인정하지 않는다. 영문자만 검사하는 메서드는 아니다."],
  ]),
  ...referenceGroup("dict", "딕셔너리 메서드", "필수", [
    ["get", "키 값 또는 지정 기본값을 읽는다.", "값 또는 기본값(기본 None)", "변경 없음", "d={'a':1}\nprint(d.get('b',9),d)", "9 {'a': 1}", "없는 키를 삽입하지 않는다."],
    ["keys", "키들을 순회하는 뷰를 얻는다.", "dict_keys 뷰", "변경 없음", "print(list({'b':2,'a':1}.keys()))", "['b', 'a']", "자동 정렬되지 않고 삽입 순서다. 뷰는 dict 변경을 반영한다."],
    ["values", "값들을 순회하는 뷰를 얻는다.", "dict_values 뷰", "변경 없음", "print(list({'a':1,'b':1}.values()))", "[1, 1]", "집합처럼 중복을 제거하지 않는다."],
    ["items", "키와 값의 쌍들을 순회한다.", "dict_items 뷰", "변경 없음", "print(list({'a':1,'b':2}.items()))", "[('a', 1), ('b', 2)]", "for k,v in d.items()에서 각 쌍을 언패킹한다."],
    ["update", "키-값들을 추가하거나 기존 값을 갱신한다.", "None", "원본 딕셔너리 변경", "d={'a':1}\nr=d.update(a=2,b=3)\nprint(d,r)", "{'a': 2, 'b': 3} None", "기존 키의 값 갱신은 그 키를 뒤로 보내지 않는다."],
    ["pop", "키를 제거하고 값을 반환한다.", "제거 값 또는 지정 기본값", "키가 있으면 원본 변경", "d={'a':1}\nprint(d.pop('a'),d.pop('b',9),d)", "1 9 {}", "없는 키에 기본값이 없으면 KeyError다. 리스트 pop의 인덱스와 다르다."],
    ["setdefault", "키가 없으면 기본값을 삽입하고 해당 값을 반환한다.", "기존 또는 삽입 값", "키가 없을 때 원본 변경", "d={'a':1}\nprint(d.setdefault('a',9),d.setdefault('b',2),d)", "1 2 {'a': 1, 'b': 2}", "기존 키의 값을 새 기본값으로 덮지 않는다."],
  ]),
  ...referenceGroup("set", "집합 메서드·연산", "보충", [
    ["add", "원소 하나를 추가한다.", "None", "원본 집합 변경", "s={1}\ns.add(2)\nprint(sorted(s))", "[1, 2]", "리스트는 해시 불가능해서 원소로 직접 추가할 수 없다."],
    ["update", "반복 가능한 대상의 원소들을 추가한다.", "None", "원본 집합 변경", "s={1}\ns.update([2,2,3])\nprint(sorted(s))", "[1, 2, 3]", "중복은 제거한다. add와 달리 인자를 원소들로 펼친다."],
    ["remove", "원소를 제거한다.", "None", "원본 집합 변경", "s={1,2}\ns.remove(1)\nprint(sorted(s))", "[2]", "없으면 KeyError다. 리스트 remove의 ValueError와 다르다."],
    ["discard", "있으면 제거하고 없어도 오류를 내지 않는다.", "None", "있으면 원본 변경", "s={1,2}\ns.discard(9)\nprint(sorted(s))", "[1, 2]", "오류 여부를 기준으로 remove와 구분한다."],
    ["union", "합집합을 만든다. 연산자 |와 대응한다.", "새 집합", "원본 변경 없음", "print(sorted({1,2}.union({2,3})))", "[1, 2, 3]", "|=나 update와 달리 새 집합을 반환한다."],
    ["intersection", "교집합을 만든다. 연산자 &와 대응한다.", "새 집합", "원본 변경 없음", "print(sorted({1,2}.intersection({2,3})))", "[2]", "공통 원소만 남긴다."],
    ["difference", "차집합을 만든다. 연산자 -와 대응한다.", "새 집합", "원본 변경 없음", "print(sorted({1,2}.difference({2,3})))", "[1]", "a-b와 b-a는 다를 수 있다."],
  ]),
  ...referenceGroup("iteration", "순회·정렬", "보충", [
    ["enumerate", "원소와 번호를 쌍으로 순회한다.", "iterator", "원본 변경 없음", "print(list(enumerate('AB',start=1)))", "[(1, 'A'), (2, 'B')]", "start는 번호 시작값이지 원본을 자르는 인덱스가 아니다."],
    ["zip", "입력들의 같은 위치 원소를 묶는다.", "iterator", "원본 변경 없음", "print(list(zip('AB',[1])))", "[('A', 1)]", "기본적으로 가장 짧은 입력에서 끝난다. strict=True는 길이 차이에 오류를 낸다."],
    ["sorted", "반복 가능한 대상을 정렬한 리스트를 만든다.", "새 리스트", "원본 변경 없음", "a=[3,1,2]\nprint(sorted(a,reverse=True),a)", "[3, 2, 1] [3, 1, 2]", "sort와 달리 반환값이 있다. 같은 기준값끼리는 원래 순서를 유지한다."],
    ["reversed", "역순으로 순회한다.", "역순 iterator", "원본 변경 없음", "a=[1,2,3]\nprint(list(reversed(a)),a)", "[3, 2, 1] [1, 2, 3]", "reverse 메서드와 달리 원본을 뒤집지 않는다."],
    ["map", "각 원소에 함수를 적용하며 순회한다.", "iterator", "전달 함수에 따라 다름", "print(list(map(lambda x:x*2,[1,2,3])))", "[2, 4, 6]", "Python 3에서는 list 자체가 아니다. 소진 후 다시 순회하면 비어 있다."],
    ["filter", "조건 함수 결과가 참인 원소를 남긴다.", "iterator", "전달 함수에 따라 다름", "print(list(filter(lambda x:x%2,[1,2,3])))", "[1, 3]", "원소를 변환하는 map과 다르다. filter(None, xs)는 거짓인 원소를 제거한다."],
    ["all", "모든 원소의 참·거짓을 확인한다.", "bool", "원본 변경 없음(iterator는 소비 가능)", "print(all([1,2]),all([1,0]),all([]))", "True False True", "빈 입력은 True다. 거짓을 만나면 평가를 중단한다."],
    ["any", "참인 원소가 하나라도 있는지 확인한다.", "bool", "원본 변경 없음(iterator는 소비 가능)", "print(any([0,2]),any([]))", "True False", "빈 입력은 False다. 참을 만나면 평가를 중단한다."],
  ]),
  ...referenceGroup("character", "문자 코드", "보충", [
    ["ord", "문자 하나의 유니코드 코드 포인트를 구한다.", "정수", "변경 없음", "print(ord('A'))", "65", "문자열 길이가 하나여야 한다. 숫자 문자열을 정수로 읽는 int와 다르다."],
    ["chr", "코드 포인트를 문자로 바꾼다.", "문자열 한 문자", "변경 없음", "print(chr(66))", "B", "허용 코드 포인트 범위를 벗어나면 ValueError다."],
  ]),
];
