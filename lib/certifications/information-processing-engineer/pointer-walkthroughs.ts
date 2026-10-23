export type MemoryField = {
  id: string;
  label: string;
  value: string;
  kind: "integer" | "address" | "function-address";
  address?: string;
};

export type MemoryObject = {
  id: string;
  name: string;
  address: string;
  kind: string;
  fields: MemoryField[];
};

export type PointerStep = {
  label: string;
  expression: string;
  result: string;
  resultKind: "주소" | "정수" | "출력" | "컴파일 오류";
  explanation: string;
  highlight: string[];
  values?: Record<string, string>;
  visibleObjects?: string[];
};

export type PointerLesson = {
  note: string;
  objects: MemoryObject[];
  steps: PointerStep[];
};

export const pointerWalkthroughs: Record<string, PointerLesson> = {
  "c-pointer": {
    note: "주소는 설명용 가상 값입니다. &p는 포인터 자신의 주소, p에 들어 있는 값은 n의 주소입니다.",
    objects: [
      { id: "p", name: "p", address: "300", kind: "포인터 변수 · int *", fields: [{ id: "p-address", label: "저장한 주소", value: "100", kind: "address" }] },
      { id: "n", name: "n", address: "100", kind: "정수 변수 · int", fields: [{ id: "n-value", label: "저장한 정수", value: "12", kind: "integer" }] },
    ],
    steps: [
      { label: "① &p", expression: "&p", result: "300", resultKind: "주소", explanation: "p도 자기 자리를 가진 변수입니다. &p는 그 자리의 주소 300입니다. p 안에 저장된 100과 구분하세요.", highlight: ["p"] },
      { label: "② p", expression: "p", result: "100", resultKind: "주소", explanation: "int *p = &n은 n의 주소 100을 p 안에 넣습니다. p의 저장값은 12가 아니라 주소 100입니다.", highlight: ["p-address"] },
      { label: "③ *p", expression: "*p", result: "12", resultKind: "정수", explanation: "p에서 주소 100을 읽고 그곳의 n으로 이동합니다. n에 저장된 정수 12를 꺼냅니다. *는 주소를 한 번 따라가는 연산입니다.", highlight: ["p-address", "n-value"] },
      { label: "④ *p = 19", expression: "*p = 19;  printf(\"%d %d\", n, *p);", result: "19 19", resultKind: "출력", explanation: "주소 100의 n을 19로 바꿉니다. p의 저장 주소는 여전히 100입니다. n과 *p는 같은 정수를 읽으므로 19 19가 출력됩니다.", highlight: ["n-value"], values: { "n-value": "19" } },
    ],
  },
  "c-array": {
    note: "주소는 가상 값이며 이 예시에서는 sizeof(int) = 4바이트로 가정합니다. 배열 a에 시작 주소를 저장하는 별도 포인터 칸은 없습니다.",
    objects: [
      { id: "p", name: "p", address: "2000", kind: "포인터 변수 · int *", fields: [{ id: "p-address", label: "저장한 주소", value: "1004", kind: "address" }] },
      { id: "a", name: "a[4]", address: "1000", kind: "연속된 정수 4개", fields: [
        { id: "a0", label: "a[0]", address: "1000", value: "4", kind: "integer" },
        { id: "a1", label: "a[1]", address: "1004", value: "9", kind: "integer" },
        { id: "a2", label: "a[2]", address: "1008", value: "15", kind: "integer" },
        { id: "a3", label: "a[3]", address: "1012", value: "22", kind: "integer" },
      ] },
    ],
    steps: [
      { label: "① 배열 a", expression: "a → &a[0]", result: "1000", resultKind: "주소", explanation: "이 식에서 배열 이름 a는 첫 원소 a[0]의 주소로 변환됩니다. a[0]에는 주소 1000이 아니라 정수 4가 들어 있습니다.", highlight: ["a0"] },
      { label: "② p = a + 1", expression: "p = a + 1", result: "1004", resultKind: "주소", explanation: "a에서 int 한 칸, 즉 4바이트 이동한 주소 1004를 p에 저장합니다. 따라서 p는 a[1]을 가리킵니다.", highlight: ["p-address", "a1"] },
      { label: "③ *p", expression: "*p → a[1]", result: "9", resultKind: "정수", explanation: "p에 저장된 주소 1004를 따라가 정수 9를 읽습니다.", highlight: ["p-address", "a1"] },
      { label: "④ p + 2", expression: "p + 2 → 1004 + 2 × 4", result: "1012", resultKind: "주소", explanation: "p + 2는 현재 위치에서 int 두 칸 이동한 주소입니다. p 자체를 대입으로 바꾸지 않았으므로 p에 저장된 값은 여전히 1004입니다.", highlight: ["a3"] },
      { label: "⑤ *(p + 2)", expression: "*(p + 2) = p[2] = a[3]", result: "22", resultKind: "정수", explanation: "주소 1012를 따라가 정수 22를 읽습니다. *p는 9, *(p + 2)는 22이므로 예제 출력은 9 22입니다.", highlight: ["a3"] },
    ],
  },
  "c-double-pointer": {
    note: "주소는 가상 값입니다. pp는 p의 주소를, p는 정수 변수의 주소를 저장합니다. 같은 예제의 선언 직후부터 따라갑니다.",
    objects: [
      { id: "pp", name: "pp", address: "400", kind: "이중 포인터 · int **", fields: [{ id: "pp-address", label: "저장한 주소", value: "300", kind: "address" }] },
      { id: "p", name: "p", address: "300", kind: "포인터 변수 · int *", fields: [{ id: "p-address", label: "저장한 주소", value: "100", kind: "address" }] },
      { id: "a", name: "a", address: "100", kind: "정수 변수 · int", fields: [{ id: "a-value", label: "저장한 정수", value: "8", kind: "integer" }] },
      { id: "b", name: "b", address: "200", kind: "정수 변수 · int", fields: [{ id: "b-value", label: "저장한 정수", value: "17", kind: "integer" }] },
    ],
    steps: [
      { label: "① pp", expression: "pp", result: "300", resultKind: "주소", explanation: "pp에 저장된 값 300은 포인터 변수 p의 주소입니다. pp 자신의 주소는 400입니다.", highlight: ["pp-address"] },
      { label: "② *pp", expression: "*pp → p", result: "100", resultKind: "주소", explanation: "pp의 주소 300을 따라가면 p를 만납니다. p에 든 값 100을 읽습니다. 여기까지의 결과는 아직 주소입니다.", highlight: ["pp-address", "p-address"] },
      { label: "③ **pp", expression: "**pp → *p → a", result: "8", resultKind: "정수", explanation: "방금 읽은 주소 100을 한 번 더 따라가면 a의 정수 8이 나옵니다. pp → p → a, 두 번 따라간 것입니다.", highlight: ["p-address", "a-value"] },
      { label: "④ *pp = &b", expression: "*pp = &b;  이제 *p는?", result: "17", resultKind: "정수", explanation: "*pp는 p입니다. 따라서 p의 저장 주소를 100에서 b의 주소 200으로 바꿉니다. pp는 여전히 p의 주소 300을 저장하며 a의 값 8도 그대로입니다.", highlight: ["p-address", "b-value"], values: { "p-address": "200" } },
      { label: "⑤ **pp += 4", expression: "**pp += 4;  printf(\"%d %d\", a, b);", result: "8 21", resultKind: "출력", explanation: "연결이 바뀐 뒤 pp → p → b를 따라갑니다. b의 17에 4를 더해 21로 만듭니다. 연결을 바꾸는 *pp 대입과 정수를 바꾸는 **pp 대입을 구분하세요.", highlight: ["b-value"], values: { "p-address": "200", "b-value": "21" } },
    ],
  },
  "c-pointer-array": {
    note: "주소는 가상 값입니다. int는 4바이트, int *는 8바이트로 가정합니다. 행은 정수 배열이며 별도로 시작 주소를 저장하는 칸이 없습니다.",
    objects: [
      { id: "parr", name: "parr[2]", address: "2000", kind: "포인터 2개가 든 배열 · int *[2]", fields: [
        { id: "parr0", label: "parr[0] · 저장한 주소", address: "2000", value: "1012", kind: "address" },
        { id: "parr1", label: "parr[1] · 저장한 주소", address: "2008", value: "1024", kind: "address" },
      ] },
      { id: "row0", name: "arr[0]", address: "1000", kind: "1행 · 정수 3개", fields: [
        { id: "a00", label: "arr[0][0]", address: "1000", value: "1", kind: "integer" },
        { id: "a01", label: "arr[0][1]", address: "1004", value: "2", kind: "integer" },
        { id: "a02", label: "arr[0][2]", address: "1008", value: "3", kind: "integer" },
      ] },
      { id: "row1", name: "arr[1]", address: "1012", kind: "2행 · 정수 3개", fields: [
        { id: "a10", label: "arr[1][0]", address: "1012", value: "4", kind: "integer" },
        { id: "a11", label: "arr[1][1]", address: "1016", value: "5", kind: "integer" },
        { id: "a12", label: "arr[1][2]", address: "1020", value: "6", kind: "integer" },
      ] },
      { id: "row2", name: "arr[2]", address: "1024", kind: "3행 · 정수 3개", fields: [
        { id: "a20", label: "arr[2][0]", address: "1024", value: "7", kind: "integer" },
        { id: "a21", label: "arr[2][1]", address: "1028", value: "8", kind: "integer" },
        { id: "a22", label: "arr[2][2]", address: "1032", value: "9", kind: "integer" },
      ] },
      { id: "rowPointer", name: "row", address: "3000", kind: "배열 포인터 · int (*)[3]", fields: [{ id: "row-address", label: "저장한 주소", value: "1000", kind: "address" }] },
    ],
    steps: [
      { label: "① arr의 세 행", expression: "arr → arr[0] → {1, 2, 3}", result: "1000", resultKind: "주소", explanation: "arr는 세 행을 가진 배열입니다. 이 식에서 arr는 첫 행을 가리키는 포인터로 변환됩니다. arr[0]도 대부분의 식에서 첫 정수 arr[0][0]의 주소 1000으로 변환되지만, 가리키는 타입과 +1의 이동 크기는 다릅니다.", highlight: ["row0", "a00"], visibleObjects: ["row0", "row1", "row2"] },
      { label: "② parr[0]에 든 것", expression: "parr[0] = arr[1] → &arr[1][0]", result: "1012", resultKind: "주소", explanation: "자기 주소 2000에 놓인 parr[0]에는 첫 정수 4의 주소 1012 하나만 들어 있습니다. 1016, 1020까지 세 주소를 저장하지 않습니다. parr[1]은 같은 방식으로 7의 주소 1024를 저장합니다.", highlight: ["parr0", "a10"], visibleObjects: ["parr", "row0", "row1", "row2"] },
      { label: "③ *parr[0]", expression: "*parr[0] → *(1012)", result: "4", resultKind: "정수", explanation: "[0]으로 첫 포인터를 이미 골랐습니다. 그 안의 주소 1012를 *로 한 번 따라가면 arr[1][0]의 정수 4가 나옵니다.", highlight: ["parr0", "a10"], visibleObjects: ["parr", "row1", "row2"] },
      { label: "④ **parr", expression: "**parr = *(*parr) = *parr[0]", result: "4", resultKind: "정수", explanation: "parr는 이 식에서 첫 포인터 원소의 주소 2000으로 변환됩니다. *parr로 첫 원소를 꺼내면 주소 1012입니다. 다시 *를 적용하면 정수 4입니다. parr[0]과 *parr는 같은 원소를 가리킵니다.", highlight: ["parr0", "a10"], visibleObjects: ["parr", "row1", "row2"] },
      { label: "⑤ **parr[0]은?", expression: "**parr[0] = *(*parr[0]) = *(정수 4)", result: "정수에는 *를 적용할 수 없음", resultKind: "컴파일 오류", explanation: "[]는 단항 *보다 먼저 묶입니다. *parr[0]에서 이미 정수 4가 나왔으므로 거기에 *를 또 붙이면 타입 오류입니다. 정수 4를 주소 4로 바꿔 해석하면 안 됩니다.", highlight: ["a10"], visibleObjects: ["parr", "row1", "row2"] },
      { label: "⑥ 세 항 계산", expression: "parr[1][1] + *(parr[1] + 2) + **parr", result: "8 + 9 + 4 = 21", resultKind: "출력", explanation: "parr[1][1]은 주소 1024에서 한 칸 이동한 1028의 값 8입니다. *(parr[1]+2)는 두 칸 이동한 1032의 값 9입니다. **parr는 주소 1012의 값 4입니다. 확인: *(*(parr+1)+1)도 정수 8입니다.", highlight: ["a21", "a22", "a10"], visibleObjects: ["parr", "row1", "row2"] },
      { label: "⑦ 배열 포인터 비교", expression: "int (*row)[3] = arr;  row + 1", result: "1012", resultKind: "주소", explanation: "row는 정수 세 개짜리 행을 가리키는 포인터 한 개입니다. row+1은 3×4 = 12바이트 이동한 1012입니다. row 자체는 여전히 1000을 저장합니다. int *parr[2]는 포인터 두 개의 배열이고 int (*row)[3]은 한 행을 가리키는 포인터입니다. 2차원 배열 arr를 int **로 간주하지 마세요.", highlight: ["row-address", "row1"], visibleObjects: ["rowPointer", "row0", "row1", "row2"] },
    ],
  },
  "c-struct": {
    note: "주소는 가상 값이며 구조체 내부 멤버의 실제 바이트 배치는 생략했습니다. next는 다음 노드의 주소, value는 정수입니다.",
    objects: [
      { id: "head", name: "head", address: "3000", kind: "포인터 변수 · struct Node *", fields: [{ id: "head-address", label: "저장한 주소", value: "1000", kind: "address" }] },
      { id: "a", name: "a", address: "1000", kind: "구조체 변수 · struct Node", fields: [{ id: "a-value", label: "value · 정수", value: "10", kind: "integer" }, { id: "a-next", label: "next · 주소", value: "2000", kind: "address" }] },
      { id: "b", name: "b", address: "2000", kind: "구조체 변수 · struct Node", fields: [{ id: "b-value", label: "value · 정수", value: "30", kind: "integer" }, { id: "b-next", label: "next · 주소", value: "NULL", kind: "address" }] },
    ],
    steps: [
      { label: "① head", expression: "head", result: "1000", resultKind: "주소", explanation: "head의 자기 주소는 3000이며 그 안에는 노드 a의 주소 1000이 저장됩니다. a.value의 정수 10은 head 안에 들어 있지 않습니다.", highlight: ["head-address"] },
      { label: "② head->next", expression: "head->next → a.next", result: "2000", resultKind: "주소", explanation: "주소 1000의 a로 이동해 next를 읽습니다. 저장된 2000은 다음 노드 b의 주소입니다. head->value라면 같은 a에서 정수 10을 읽습니다.", highlight: ["a-next"] },
      { label: "③ head->next->value", expression: "head->next->value → b.value", result: "30", resultKind: "정수", explanation: "a.next에서 읽은 주소 2000으로 이동해 b의 value를 읽습니다. 정수 30이므로 예제의 출력은 30입니다. ->는 포인터가 가리키는 구조체에서 지정한 멤버를 고릅니다.", highlight: ["b-value"] },
      { label: "④ 값만 바꾸기", expression: "head->next->value = 50;  b.value", result: "50", resultKind: "정수", explanation: "처음 상태에서 a.next를 따라 b로 가서 b.value만 50으로 바꿉니다. head의 주소 연결과 a.value = 10은 그대로입니다.", highlight: ["b-value"], values: { "b-value": "50" } },
      { label: "⑤ head를 이동하기", expression: "처음 상태에서 head = head->next;  head->value", result: "30", resultKind: "정수", explanation: "처음 상태에서 a.next의 주소 2000을 head에 저장합니다. 이제 head는 b를 가리켜 30을 읽습니다. a와 b의 값은 바뀌지 않았습니다. b.next는 NULL이므로 그 뒤 노드로 더 따라가면 안 됩니다.", highlight: ["head-address", "b-value"], values: { "head-address": "2000" } },
    ],
  },
  "c-call": {
    note: "주소는 설명용 가상 값입니다. 함수 매개변수는 호출 중에만 존재합니다. 각 단계는 선택한 시점의 상태를 보여줍니다.",
    objects: [
      { id: "n", name: "n", address: "1000", kind: "호출한 쪽의 정수 변수", fields: [{ id: "n-value", label: "저장한 정수", value: "7", kind: "integer" }] },
      { id: "x", name: "x", address: "2000", kind: "byValue의 정수 매개변수", fields: [{ id: "x-value", label: "복사한 정수", value: "7", kind: "integer" }] },
      { id: "p", name: "p", address: "3000", kind: "byAddress의 포인터 매개변수", fields: [{ id: "p-address", label: "복사한 주소", value: "1000", kind: "address" }] },
    ],
    steps: [
      { label: "① 정수 7을 복사", expression: "byValue(n) → x = 7", result: "7", resultKind: "정수", explanation: "n의 정수 7을 함수의 매개변수 x에 복사합니다. n과 x는 서로 다른 주소의 변수입니다.", highlight: ["n-value", "x-value"], visibleObjects: ["n", "x"] },
      { label: "② x = 99", expression: "byValue 안에서 x = 99;  호출한 쪽 n은?", result: "7", resultKind: "정수", explanation: "주소 2000의 x만 99로 바뀝니다. 주소 1000의 n은 7입니다. 함수가 끝나면 x의 수명도 끝납니다.", highlight: ["x-value"], values: { "x-value": "99" }, visibleObjects: ["n", "x"] },
      { label: "③ 주소를 복사", expression: "byAddress(&n) → p = 1000", result: "1000", resultKind: "주소", explanation: "이번에는 n의 주소 1000을 매개변수 p에 복사합니다. p 자신의 주소는 3000입니다. 함수에는 포인터 값도 복사해서 전달됩니다.", highlight: ["p-address"], visibleObjects: ["p", "n"] },
      { label: "④ *p = 99", expression: "byAddress 안에서 *p = 99;  n은?", result: "99", resultKind: "정수", explanation: "p의 주소 1000을 따라가 n을 99로 바꿉니다. 함수가 끝나 p가 사라져도 호출한 쪽의 n에는 99가 남습니다.", highlight: ["n-value"], values: { "n-value": "99" }, visibleObjects: ["p", "n"] },
    ],
  },
  "c-function-pointer": {
    note: "데이터 주소는 가상 값이며 int는 4바이트로 가정합니다. F(next)는 함수 주소를 설명하는 기호로, 실제 숫자나 정수 포인터가 아닙니다.",
    objects: [
      { id: "fn", name: "fn", address: "3000", kind: "함수 포인터 · int *(*)(int *)", fields: [{ id: "fn-address", label: "저장한 함수 주소", value: "F(next)", kind: "function-address" }] },
      { id: "next", name: "next", address: "F(next)", kind: "사용자 정의 함수", fields: [] },
      { id: "p", name: "p", address: "2000", kind: "next의 포인터 매개변수", fields: [{ id: "p-address", label: "복사한 데이터 주소", value: "1000", kind: "address" }] },
      { id: "a", name: "a[2]", address: "1000", kind: "정수 2개의 배열", fields: [{ id: "a0", label: "a[0]", address: "1000", value: "18", kind: "integer" }, { id: "a1", label: "a[1]", address: "1004", value: "48", kind: "integer" }] },
    ],
    steps: [
      { label: "① fn = next", expression: "int *(*fn)(int *) = next;", result: "F(next)", resultKind: "주소", explanation: "next는 우리가 정의한 함수입니다. fn에는 next를 호출할 수 있는 함수 주소가 저장됩니다. 함수 이름은 이 식에서 함수 포인터로 변환됩니다.", highlight: ["fn-address", "next"], visibleObjects: ["fn", "next", "a"] },
      { label: "② fn(a) 호출", expression: "fn(a) → next(a), 함수 안 p", result: "1000", resultKind: "주소", explanation: "fn이 가리키는 next를 호출합니다. a는 첫 정수의 주소 1000으로 변환되고 매개변수 p는 그 주소를 복사해 받습니다.", highlight: ["fn-address", "p-address", "a0"] },
      { label: "③ p + 1 반환", expression: "return p + 1;", result: "1004", resultKind: "주소", explanation: "int 한 칸 이동한 a[1]의 주소 1004를 반환합니다. p 자체는 바꾸지 않습니다. 함수가 끝나 p는 사라지지만 배열 a는 여전히 있으므로 반환된 주소로 a[1]을 읽을 수 있습니다.", highlight: ["a1"], visibleObjects: ["fn", "next", "a"] },
      { label: "④ *fn(a)", expression: "*fn(a) = *(fn(a)) → a[1]", result: "48", resultKind: "정수", explanation: "함수 호출 ()이 먼저입니다. 반환된 주소 1004에 *를 적용하면 정수 48입니다. 호출이 끝난 뒤의 반환 주소를 따라가며 함수 내부 변수 p 자체를 읽는 것은 아닙니다.", highlight: ["a1"], visibleObjects: ["fn", "next", "a"] },
      { label: "⑤ %x 출력", expression: "printf(\"%x\", (unsigned int)*fn(a));", result: "30", resultKind: "출력", explanation: "십진수 48은 16진수로 30입니다. %x는 unsigned int를 16진수 문자열로 출력하며 0x를 자동으로 붙이지 않습니다. printf는 C 표준 라이브러리 함수로 stdio.h를 포함해 사용합니다.", highlight: ["a1"], visibleObjects: ["fn", "next", "a"] },
    ],
  },
};
