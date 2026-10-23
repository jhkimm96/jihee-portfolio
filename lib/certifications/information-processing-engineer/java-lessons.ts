import type { ProgrammingLesson } from "./types";

export const javaLessons: ProgrammingLesson[] = [
  {
    id: "java-memory", conceptId: "java-memory", language: "Java", priority: 1, title: "참조값 복사·객체 수정·재대입",
    rule: "Java의 인자는 항상 값으로 전달된다. 참조형 인자는 객체를 가리키는 참조값이 복사된다.", trap: "함수의 매개변수에 새 배열을 대입해도 호출자의 변수는 재연결되지 않는다. 객체 내용 수정은 공유된다.",
    examples: [
      { id: "java-memory-parameter", title: "배열 수정과 매개변수 재대입", code: "class Main {\n  static void f(int[] x) {\n    x[0] = 7;\n    x = new int[]{9};\n  }\n  public static void main(String[] args) {\n    int[] a = {1};\n    f(a);\n    System.out.print(a[0]);\n  }\n}", output: "7", steps: [{ line: 8, explanation: "a의 참조값을 x에 복사한다.", bindings: ["a,x → 배열 O1=[1]"] }, { line: 3, explanation: "공유 객체 O1의 내용을 바꾼다.", bindings: ["O1=[7]"] }, { line: 4, explanation: "매개변수 x만 새 배열 O2로 바뀐다.", bindings: ["a → O1=[7]", "x → O2=[9]"], output: "7" }] },
      { id: "java-memory-array", title: "객체 배열의 연결", code: "class Main {\n  static class Box { int x; Box(int n) { x=n; } }\n  public static void main(String[] args) {\n    Box a = new Box(1);\n    Box[] b = {a, a};\n    b[0].x = 5;\n    b[1] = new Box(9);\n    System.out.print(a.x + \" \" + b[1].x);\n  }\n}", output: "5 9", steps: [{ line: 5, explanation: "배열은 두 객체가 아니라 같은 참조 두 개를 담는다.", bindings: ["a,b[0],b[1] → O1{x:1}"] }, { line: 6, explanation: "O1.x를 5로 수정한다.", bindings: ["O1{x:5}"] }, { line: 7, explanation: "b[1]만 새 O2에 연결한다.", bindings: ["a,b[0] → O1{x:5}", "b[1] → O2{x:9}"], output: "5 9" }] },
    ],
  },
  {
    id: "java-static", conceptId: "java-memory", language: "Java", priority: 1, title: "static 공유 공간과 인스턴스 공간",
    rule: "static 필드는 클래스에, 인스턴스 필드는 각 객체에 속한다. 지역 변수는 각 호출마다 따로 둔다.", trap: "final 참조는 다른 객체로 재대입할 수 없다는 뜻이지 그 객체의 내용을 무조건 수정할 수 없다는 뜻은 아니다.",
    examples: [
      { id: "java-static-counter", title: "공유 카운터와 개별 카운터", code: "class Main {\n  static class Box {\n    static int shared=0;\n    int own=0;\n    void add() { shared++; own++; }\n  }\n  public static void main(String[] args) {\n    Box a=new Box(), b=new Box();\n    a.add(); a.add(); b.add();\n    System.out.print(Box.shared + \" \" + a.own + \" \" + b.own);\n  }\n}", output: "3 2 1", steps: [{ line: 8, explanation: "클래스 공유 공간과 객체 둘을 나눈다.", bindings: ["Box.shared=0", "a → O1{own:0}", "b → O2{own:0}"] }, { line: 9, explanation: "공유 카운터는 세 번, O1은 두 번, O2는 한 번 증가한다.", bindings: ["shared=3", "O1.own=2", "O2.own=1"], output: "3 2 1" }] },
      { id: "java-static-final", title: "final 참조와 내용 수정", code: "class Main {\n  public static void main(String[] args) {\n    final int[] a={1,2};\n    a[0]=7;\n    System.out.print(a[0]);\n  }\n}", output: "7", steps: [{ line: 3, explanation: "a의 참조는 이후 다른 배열로 바꿀 수 없다.", bindings: ["a → O1=[1,2] (연결 고정)"] }, { line: 4, explanation: "배열 원소 자체는 수정할 수 있다. a=new int[]{9}는 별도로 컴파일 오류다.", bindings: ["O1=[7,2]"], output: "7" }] },
    ],
  },
  {
    id: "java-initialization", conceptId: "java-super", language: "Java", priority: 1, title: "클래스 초기화부터 생성자까지",
    rule: "예제는 Java 17 규칙이다. 클래스 초기화는 부모→자식으로 한 번, 객체 초기화는 부모 생성자까지 처리한 뒤 자식 필드·블록·생성자 본문으로 진행한다.", trap: "객체 메모리에는 먼저 기본값이 들어간다. 부모 생성자에서 재정의 메서드를 호출하면 아직 초기화 전인 자식 필드가 보일 수 있다.",
    examples: [
      { id: "java-init-order", title: "static·필드·블록·생성자", code: "class Main {\n  static class A {\n    static { System.out.print(\"S\"); }\n    int x=mark(\"F\");\n    { System.out.print(\"I\"); }\n    A() { System.out.print(\"C\"); }\n  }\n  static int mark(String s) { System.out.print(s); return 1; }\n  public static void main(String[] args) { new A(); new A(); }\n}", output: "SFICFIC", steps: [{ line: 3, explanation: "첫 A 생성 전 static 블록은 한 번만 실행한다.", bindings: ["A 클래스 초기화 완료"], output: "S" }, { line: 6, explanation: "첫 객체는 필드→인스턴스 블록→생성자다.", bindings: ["O1.x=1"], output: "SFIC" }, { line: 9, explanation: "두 번째 객체도 FIC지만 static S는 반복하지 않는다.", bindings: ["O2.x=1"], output: "SFICFIC" }] },
      { id: "java-init-dynamic", title: "부모 생성자에서 자식 메서드 호출", code: "class Main {\n  static class A { A() { show(); } void show() {} }\n  static class B extends A {\n    int x=7;\n    B() { System.out.print(x); }\n    void show() { System.out.print(x); }\n  }\n  public static void main(String[] args) { new B(); }\n}", output: "07", steps: [{ line: 2, explanation: "메모리 기본값 B.x=0 상태에서 부모 A 생성자가 실행된다.", bindings: ["B 객체{x:0}"] }, { line: 6, explanation: "show는 B 구현을 선택하지만 B 필드 초기화는 아직이다.", bindings: ["show가 읽은 x=0"], output: "0" }, { line: 5, explanation: "부모 생성 후 B.x=7 초기화, B 생성자 본문 순서다.", bindings: ["B 객체{x:7}"], output: "07" }] },
      { id: "java-init-this", title: "this 생성자 연결과 super", code: "class Main {\n  static class A { A(int x) { System.out.print(x); } }\n  static class B extends A {\n    B() { this(3); System.out.print(\"B\"); }\n    B(int n) { super(n+1); System.out.print(\"C\"); }\n  }\n  public static void main(String[] args) { new B(); }\n}", output: "4CB", steps: [{ line: 4, explanation: "B()가 B(3)으로 연결된다.", bindings: ["B() → B(3)"] }, { line: 5, explanation: "A(4) 출력 후 B(3)의 C를 출력한다.", bindings: ["부모 생성 완료"], output: "4C" }, { line: 4, explanation: "처음 B()의 남은 B를 출력한다.", bindings: ["호출 반환"], output: "4CB" }] },
    ],
  },
  {
    id: "java-dispatch", conceptId: "java-binding", language: "Java", priority: 2, title: "필드·static·인스턴스 메서드 종합",
    rule: "필드와 숨겨진 static 메서드는 표현식의 컴파일 시 타입, 재정의된 인스턴스 메서드는 실제 객체를 본다.", trap: "super.f()는 부모 구현을 지정한다. static은 오버라이딩이 아니라 하이딩이며 클래스명으로 호출하는 편이 명확하다.",
    examples: [
      { id: "java-dispatch-mixed", title: "같은 a지만 다른 선택 규칙", code: "class Main {\n  static class A { int x=1; static int s(){return 2;} int f(){return 3;} }\n  static class B extends A { int x=10; static int s(){return 20;} int f(){return 30;} }\n  public static void main(String[] args) {\n    A a=new B();\n    System.out.print(a.x + \" \" + a.s() + \" \" + a.f());\n  }\n}", output: "1 2 30", steps: [{ line: 5, explanation: "선언 타입은 A, 실제 객체는 B다. 부모·자식 x는 별도 필드다.", bindings: ["a:A → B{A.x:1,B.x:10}"] }, { line: 6, explanation: "필드와 static은 A, 인스턴스 f는 B에서 선택한다.", bindings: ["a.x=1", "a.s()=2", "a.f()=30"], output: "1 2 30" }] },
      { id: "java-dispatch-super", title: "부모 구현 지정", code: "class Main {\n  static class A { int f(){return 2;} }\n  static class B extends A { int f(){return super.f()+5;} }\n  public static void main(String[] args) { A a=new B(); System.out.print(a.f()); }\n}", output: "7", steps: [{ line: 4, explanation: "재정의된 B.f로 진입한다.", bindings: ["a → B 객체"] }, { line: 3, explanation: "super.f()는 A.f의 2를 반환한다.", bindings: ["2+5=7"], output: "7" }] },
    ],
  },
  {
    id: "java-overload", conceptId: "java-overload", language: "Java", priority: 2, title: "오버로드 선택 후 오버라이딩",
    rule: "컴파일 시 인자 타입으로 시그니처를 먼저 고르고, 그 시그니처의 인스턴스 구현을 실제 객체에서 찾는다.", trap: "실제 인자가 String이어도 선언이 Object라면 String 오버로드를 뒤늦게 다시 고르지 않는다.",
    examples: [
      { id: "java-overload-mixed", title: "두 번의 선택", code: "class Main {\n  static class A { String f(Object x){return \"AO\";} String f(String x){return \"AS\";} }\n  static class B extends A { String f(Object x){return \"BO\";} String f(String x){return \"BS\";} }\n  public static void main(String[] args) {\n    A a=new B(); Object x=\"hi\";\n    System.out.print(a.f(x) + \" \" + a.f(\"hi\"));\n  }\n}", output: "BO BS", steps: [{ line: 5, explanation: "a의 타입 A, x의 타입 Object를 적는다.", bindings: ["a:A → B", "x:Object → String"] }, { line: 6, explanation: "첫 호출은 f(Object), 둘째는 f(String)을 선택한 뒤 B의 재정의를 실행한다.", bindings: ["f(Object) → B.f(Object)", "f(String) → B.f(String)"], output: "BO BS" }] },
      { id: "java-overload-cast", title: "형변환으로 인자 타입 바꾸기", code: "class Main {\n  static void f(Object x){ System.out.print(\"O\"); }\n  static void f(String x){ System.out.print(\"S\"); }\n  public static void main(String[] args) { Object x=\"hi\"; f(x); f((String)x); }\n}", output: "OS", steps: [{ line: 4, explanation: "첫 호출의 컴파일 시 타입 Object로 f(Object)를 선택한다.", bindings: ["x:Object"], output: "O" }, { line: 4, explanation: "캐스트 표현식 타입 String으로 f(String)를 선택한다.", bindings: ["(String)x:String"], output: "OS" }] },
    ],
  },
  {
    id: "java-lambda", conceptId: "java-lambda", language: "Java", priority: 2, title: "람다와 함수형 인터페이스",
    rule: "함수형 인터페이스의 추상 메서드 하나에 해당하는 동작을 람다로 전달한다. 할당 순간이 아니라 메서드 호출 순간에 본문이 실행된다.", trap: "람다에서 캡처한 지역 변수는 final 또는 사실상 final이어야 한다. 객체 내용 수정 가능성과 지역 변수 재대입 제한은 다르다.",
    examples: [
      { id: "java-lambda-call", title: "동작을 저장하고 호출하기", code: "class Main {\n  interface Op { int apply(int a, int b); }\n  public static void main(String[] args) {\n    Op add=(a,b)->a+b;\n    Op mul=(a,b)->a*b;\n    System.out.print(add.apply(2,3) + \" \" + mul.apply(2,3));\n  }\n}", output: "5 6", steps: [{ line: 4, explanation: "add는 덧셈 동작, mul은 곱셈 동작이다. 아직 계산하지 않는다.", bindings: ["add → 덧셈", "mul → 곱셈"] }, { line: 6, explanation: "같은 인자 2,3으로 각 apply를 호출한다.", bindings: ["add=5", "mul=6"], output: "5 6" }] },
      { id: "java-lambda-capture", title: "지역 값 캡처", code: "class Main {\n  interface Op { int apply(int x); }\n  public static void main(String[] args) {\n    int base=3;\n    Op op=x->x+base;\n    System.out.print(op.apply(4));\n  }\n}", output: "7", steps: [{ line: 5, explanation: "base는 이후 재대입되지 않는 지역 값이다.", bindings: ["base=3", "op → x+base"] }, { line: 6, explanation: "4+3을 계산한다. base++를 추가하면 사실상 final 조건을 어겨 컴파일 오류다.", bindings: ["x=4"], output: "7" }] },
    ],
  },
  {
    id: "java-recursion", conceptId: "java-recursion", language: "Java", priority: 2, title: "재귀와 두 함수의 호출 관계",
    rule: "호출마다 지역 변수와 반환 위치를 따로 적는다. 반환식에 재귀 호출이 여러 개면 각각 계산한다.", trap: "호출 전후 출력, 합성 함수, 상호 재귀를 한 번에 머릿속으로 계산하지 않는다.",
    examples: [
      { id: "java-recursion-print", title: "호출 전후 출력", code: "class Main {\n  static void f(int n) {\n    if(n==0) return;\n    System.out.print(n); f(n-1); System.out.print(n);\n  }\n  public static void main(String[] args) { f(3); }\n}", output: "321123", steps: [{ line: 4, explanation: "호출 전 출력이 3,2,1 순서다.", bindings: ["f(3) → f(2) → f(1) → f(0)"], output: "321" }, { line: 4, explanation: "복귀 후 출력은 1,2,3 순서다.", bindings: ["반환 0 → 1 → 2 → 3"], output: "321123" }] },
      { id: "java-recursion-mutual", title: "상호 재귀 반환표", code: "class Main {\n  static int f(int n) { return n==0 ? 1 : n+g(n-1); }\n  static int g(int n) { return n==0 ? 2 : n*f(n-1); }\n  public static void main(String[] args) { System.out.print(f(3)); }\n}", output: "9", steps: [{ line: 2, explanation: "f(3)=3+g(2), g(2)=2*f(1), f(1)=1+g(0)으로 펼친다.", bindings: ["f(3) → g(2) → f(1) → g(0)"] }, { line: 3, explanation: "g(0)=2부터 역순으로 계산한다.", bindings: ["f(1)=3", "g(2)=6", "f(3)=9"], output: "9" }] },
    ],
  },
  {
    id: "java-strings", conceptId: "java-output", language: "Java", priority: 2, title: "String·동일성·문자열 연산",
    rule: "String의 equals는 내용, 참조형 ==는 동일 객체인지 비교한다. String은 불변이다.", trap: "배열의 equals는 기본적으로 원소별 비교가 아니다. Arrays.equals를 사용한다. char+char는 정수 연산이다.",
    examples: [
      { id: "java-string-equality", title: "내용과 참조 비교", code: "class Main {\n  public static void main(String[] args) {\n    String a=new String(\"hi\"), b=new String(\"hi\");\n    System.out.print((a==b) + \" \" + a.equals(b));\n  }\n}", output: "false true", steps: [{ line: 3, explanation: "new로 서로 다른 String 객체 두 개를 만든다.", bindings: ["a → S1(hi)", "b → S2(hi)"] }, { line: 4, explanation: "동일성은 false, 내용 비교는 true다.", bindings: ["S1 ≠ S2", "내용 hi = hi"], output: "false true" }] },
      { id: "java-string-methods", title: "불변성·부분 문자열·char", code: "class Main {\n  public static void main(String[] args) {\n    String s=\"ABCDE\";\n    s.replace(\"A\",\"X\");\n    System.out.print(s.substring(1,4) + \" \" + ('A'+1) + \" \" + (char)('A'+1));\n  }\n}", output: "BCD 66 B", steps: [{ line: 4, explanation: "replace 결과를 저장하지 않아 s는 그대로다.", bindings: ["s → ABCDE"] }, { line: 5, explanation: "substring 끝은 제외한다. char A의 코드 65에 1을 더하면 int 66이다.", bindings: ["substring=BCD", "char 연산=66", "char 변환=B"], output: "BCD 66 B" }] },
      { id: "java-array-equals", title: "배열 내용 비교와 정렬", code: "import java.util.Arrays;\nclass Main {\n  public static void main(String[] args) {\n    int[] a={2,1}, b={1,2};\n    Arrays.sort(a);\n    System.out.print((a==b) + \" \" + a.equals(b) + \" \" + Arrays.equals(a,b));\n  }\n}", output: "false false true", steps: [{ line: 5, explanation: "Arrays.sort는 원본 배열을 정렬하며 반환값은 void다.", bindings: ["a → A1=[1,2]", "b → A2=[1,2]"] }, { line: 6, explanation: "서로 다른 배열 참조지만 원소별 비교는 같다.", bindings: ["== false", "equals false", "Arrays.equals true"], output: "false false true" }] },
    ],
  },
  {
    id: "java-operators", conceptId: "java-operators", language: "Java", priority: 3, title: "연산·형변환·단락 평가",
    rule: "피연산자 평가 순서와 연산자 우선순위를 구분한다. Java 정수 나눗셈은 0 방향으로 버린다.", trap: "&&와 ||는 뒤 식을 생략할 수 있지만 &와 |는 boolean 식에서도 양쪽을 평가한다. Java의 시프트와 Python 음수 나눗셈을 혼동하지 않는다.",
    examples: [
      { id: "java-op-increment", title: "증감과 정수 나눗셈", code: "class Main {\n  public static void main(String[] args) {\n    int x=2;\n    int y=x++ + ++x;\n    System.out.print(x + \" \" + y + \" \" + (-7/3) + \" \" + (-7%3));\n  }\n}", output: "4 6 -2 -1", steps: [{ line: 4, explanation: "x++의 식 값은 2, 이후 x=3이다. ++x는 x=4로 바꾸고 4를 낸다.", bindings: ["y=2+4=6", "x=4"] }, { line: 5, explanation: "몫 -2, 나머지 -1로 -7=(-2)*3+(-1)을 만족한다.", bindings: ["Python의 //와 다름"], output: "4 6 -2 -1" }] },
      { id: "java-op-short", title: "단락·비트·시프트", code: "class Main {\n  public static void main(String[] args) {\n    int x=0;\n    boolean a=false && ++x>0;\n    boolean b=false & ++x>0;\n    System.out.print(x + \" \" + (5&3) + \" \" + (8>>1) + \" \" + (-1>>>31));\n  }\n}", output: "1 1 4 1", steps: [{ line: 4, explanation: "&&의 왼쪽 false 때문에 ++x를 건너뛴다.", bindings: ["x=0", "a=false"] }, { line: 5, explanation: "&는 오른쪽도 평가해 x=1이다.", bindings: ["x=1", "b=false"] }, { line: 6, explanation: "5&3=1, 8>>1=4. >>>는 0을 채워 int -1을 31칸 이동하면 1이다.", bindings: ["int는 32비트"], output: "1 1 4 1" }] },
      { id: "java-op-cast", title: "캐스트·삼항·문자열 결합", code: "class Main {\n  public static void main(String[] args) {\n    double x=7.9;\n    int y=(int)x;\n    System.out.print(1+2+\"X\"+3+4 + \" \" + (y>5 ? y : 0));\n  }\n}", output: "3X34 7", steps: [{ line: 4, explanation: "실수→정수 캐스트는 소수부를 0 방향으로 버린다.", bindings: ["y=7"] }, { line: 5, explanation: "첫 1+2는 3, 문자열 X를 만난 후에는 결합이다. 삼항은 7을 고른다.", bindings: ["3 → 3X → 3X3 → 3X34"], output: "3X34 7" }] },
    ],
  },
  {
    id: "java-control", conceptId: "java-operators", language: "Java", priority: 3, title: "반복문·switch·출력 누적",
    rule: "반복마다 현재 변수, 조건, 출력, 갱신 순서로 표를 만든다. 전통적인 switch에서 break가 없으면 다음 case로 이어진다.", trap: "for의 continue 뒤에도 갱신식은 실행된다. 향상된 for의 지역 기본형 변수 재대입은 배열 원소를 바꾸지 않는다.",
    examples: [
      { id: "java-control-switch", title: "continue와 fall-through", code: "class Main {\n  public static void main(String[] args) {\n    int n=0;\n    for(int i=0;i<4;i++) { if(i==1) continue; n+=i; }\n    switch(n) { case 5: System.out.print(\"A\"); default: System.out.print(\"B\"); }\n  }\n}", output: "AB", steps: [{ line: 4, explanation: "i=0,2,3만 더해 n=5다.", bindings: ["n:0 → 0 → 2 → 5"] }, { line: 5, explanation: "case 5부터 A를 출력하고 break가 없어 default의 B도 출력한다.", bindings: ["case 5 → default"], output: "AB" }] },
      { id: "java-control-enhanced", title: "향상된 for의 복사본", code: "class Main {\n  public static void main(String[] args) {\n    int[] a={1,2};\n    for(int x:a) x+=10;\n    System.out.print(a[0]+\" \"+a[1]);\n  }\n}", output: "1 2", steps: [{ line: 4, explanation: "매 반복의 x는 원소 정수의 복사본이다.", bindings: ["첫 x=1 → 11", "둘째 x=2 → 12"] }, { line: 5, explanation: "배열 원소에 대입하지 않아 원본은 그대로다.", bindings: ["a=[1,2]"], output: "1 2" }] },
    ],
  },
  {
    id: "java-types", conceptId: "java-types", language: "Java", priority: 3, title: "추상 클래스·인터페이스·접근 제어·final",
    rule: "추상 클래스는 직접 new할 수 없다. 구체 클래스는 필요한 추상 메서드를 구현한다. 인터페이스 구현 메서드는 public이어야 한다.", trap: "private는 선언 클래스 내부, 기본 접근은 같은 패키지다. 다른 패키지 protected는 상속 관계와 접근 참조에 제약이 있다. final 메서드는 재정의, final 클래스는 상속할 수 없다.",
    examples: [
      { id: "java-types-abstract", title: "추상 타입과 구체 객체", code: "class Main {\n  interface Op { int f(); }\n  static abstract class A implements Op { protected int x=3; }\n  static class B extends A { public int f(){return x+2;} }\n  public static void main(String[] args) { Op o=new B(); System.out.print(o.f()); }\n}", output: "5", steps: [{ line: 4, explanation: "B가 public f를 구현해 구체 클래스가 된다.", bindings: ["B extends A implements Op"] }, { line: 5, explanation: "참조는 Op지만 실제 객체 B의 f를 실행한다.", bindings: ["o:Op → B{x:3}"], output: "5" }] },
      { id: "java-types-private", title: "private 상태와 공개 동작", code: "class A {\n  private int x=4;\n  final int get(){return x;}\n}\nclass B extends A { int x=9; }\nclass Main {\n  public static void main(String[] args) { B b=new B(); System.out.print(b.x+\" \"+b.get()); }\n}", output: "9 4", steps: [{ line: 5, explanation: "최상위 클래스 A,B를 비교한다. B.x와 A의 private x는 별도 필드이고 B가 A.x를 직접 읽을 수 없다.", bindings: ["B 객체{A.x:4,B.x:9}"] }, { line: 7, explanation: "b.x는 B.x, get 내부의 x는 A.x다. get은 final이므로 B에서 재정의할 수 없다.", bindings: ["b.x=9", "b.get()=4"], output: "9 4" }] },
    ],
  },
  {
    id: "java-exceptions", conceptId: "java-exception", language: "Java", priority: 3, title: "예외·반환값·finally",
    rule: "일치하는 catch 하나를 실행한다. return 식을 평가한 뒤 finally를 거쳐 반환한다.", trap: "finally의 새 return은 앞 반환을 덮는다. 기본형 반환 준비값은 이후 지역 변수 변경과 다르다. finally가 무조건 실행된다고 일반화하지 않는다.",
    examples: [
      { id: "java-exception-value", title: "반환식 평가 시점", code: "class Main {\n  static int f(){\n    int x=1;\n    try { return x; }\n    finally { x=9; System.out.print(\"F\"); }\n  }\n  public static void main(String[] args){ System.out.print(f()); }\n}", output: "F1", steps: [{ line: 4, explanation: "return x는 현재 int 값 1을 준비한다.", bindings: ["대기 반환=1"] }, { line: 5, explanation: "지역 x는 9가 되어도 대기 중인 int 반환값은 1이다. F를 먼저 출력한다.", bindings: ["x=9", "최종 반환=1"], output: "F1" }] },
      { id: "java-exception-catch", title: "catch 하나와 finally", code: "class Main {\n  public static void main(String[] args){\n    int n=0;\n    try { n++; throw new IllegalArgumentException(); }\n    catch(IllegalArgumentException e){ n+=2; }\n    catch(RuntimeException e){ n+=10; }\n    finally { n+=100; }\n    System.out.print(n);\n  }\n}", output: "103", steps: [{ line: 4, explanation: "n=1 뒤 예외가 발생한다.", bindings: ["n=1"] }, { line: 5, explanation: "첫 일치 catch에서 +2한다. 다음 catch는 실행하지 않는다.", bindings: ["n=3"] }, { line: 7, explanation: "finally의 +100을 적용한다.", bindings: ["n=103"], output: "103" }] },
      { id: "java-exception-return", title: "finally에서 새 반환", code: "class Main {\n  static int f(){ try { return 1; } finally { return 2; } }\n  public static void main(String[] args){ System.out.print(f()); }\n}", output: "2", steps: [{ line: 2, explanation: "try에서 1 반환을 준비한다.", bindings: ["대기=1"] }, { line: 2, explanation: "finally의 return 2가 대체한다. 실무에서는 피할 패턴이다.", bindings: ["최종=2"], output: "2" }] },
    ],
  },
  {
    id: "java-generics", conceptId: "java-generics", language: "Java", priority: 3, title: "제네릭 타입과 오버로딩·래퍼",
    rule: "제네릭 코드도 컴파일 시 타입으로 메서드를 선택한다. 무제한 T는 Object 수준에서 사용할 수 있는 메서드와 변환을 기준으로 검사한다.", trap: "T에 Integer가 들어왔다고 매번 Integer 오버로드를 다시 선택하지 않는다. 래퍼 비교는 == 캐시에 기대지 말고 equals와 언박싱을 구분한다.",
    examples: [
      { id: "java-generics-overload", title: "T를 전달한 오버로드", code: "class Main {\n  static String pick(Object x){return \"O\";}\n  static String pick(Integer x){return \"I\";}\n  static <T> String call(T x){return pick(x);}\n  public static void main(String[] args){ System.out.print(call(7)+\" \"+pick(7)); }\n}", output: "O I", steps: [{ line: 4, explanation: "call 본문에서 T의 상한은 Object다. pick(Object)를 선택한다.", bindings: ["T extends Object", "pick(T) → pick(Object)"] }, { line: 5, explanation: "직접 pick(7)은 박싱을 통해 Integer 오버로드를 선택한다.", bindings: ["call(7)=O", "pick(7)=I"], output: "O I" }] },
      { id: "java-generics-wrapper", title: "래퍼 내용과 언박싱", code: "class Main {\n  public static void main(String[] args){\n    Integer a=Integer.valueOf(200);\n    Integer b=Integer.valueOf(200);\n    System.out.print(a.equals(b)+\" \"+(a==200));\n  }\n}", output: "true true", steps: [{ line: 4, explanation: "두 래퍼가 보관한 정수 값은 200이다. a==b의 결과를 캐싱 추측으로 고정하지 않는다.", bindings: ["a의 값=200", "b의 값=200"] }, { line: 5, explanation: "equals는 값 비교, int 200과 ==에서는 a를 언박싱해 비교한다.", bindings: ["200 equals 200", "int 200 == 200"], output: "true true" }] },
    ],
  },
];
