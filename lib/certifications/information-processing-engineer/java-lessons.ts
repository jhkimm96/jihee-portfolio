import type { ProgrammingLesson } from "./types";

export const javaLessons: ProgrammingLesson[] = [
  {
    id: "java-memory", conceptId: "java-memory", language: "Java", priority: 1, title: "참조값 복사·객체 수정·재대입",
    rule: "Java의 인자는 항상 값으로 전달된다. 배열·객체 변수에 든 값은 객체 자체가 아니라 객체를 가리키는 화살표(참조값)이므로, 호출하면 그 화살표가 복사된다.", trap: "매개변수에 새 배열을 대입하면 매개변수의 화살표만 바뀌고 호출자의 변수는 그대로다. 반면 화살표를 따라가 객체 내용을 고치면 같은 객체를 가리키는 모든 변수에서 보인다.",
    solvingSteps: ["실행은 main의 첫 줄부터 시작한다. 클래스와 메서드 선언은 등록만 하고 건너뛴다.", "new나 {…}로 객체·배열이 생길 때마다 상자를 그리고 O1, O2처럼 이름표를 붙인다.", "변수와 배열 칸에는 상자를 가리키는 화살표를 적는다. 호출할 때는 화살표를 복사한다.", "각 줄이 화살표를 따라가 상자 내용을 고치는지(x[0] = …, b.x = …), 변수의 화살표를 바꾸는지(x = new …) 구분한다.", "static 필드는 클래스에 하나, 인스턴스 필드는 객체마다 하나씩 따로 적는다."],
    examples: [
      { id: "java-memory-parameter", title: "배열 수정과 매개변수 재대입", code: "class Main {\n  static void f(int[] x) {\n    x[0] = 7;\n    x = new int[]{9};\n  }\n  public static void main(String[] args) {\n    int[] a = {1};\n    f(a);\n    System.out.print(a[0]);\n  }\n}", output: "7", steps: [
        { line: 6, explanation: "실행은 main에서 시작한다. 2~5행의 f는 선언만 되어 있고 아직 실행하지 않는다.", bindings: ["main 시작"] },
        { line: 7, explanation: "배열 상자 O1을 만들고 a에 O1을 가리키는 화살표를 넣는다.", bindings: ["a → O1 = [1]"] },
        { line: 8, explanation: "f(a)를 호출하면 a의 화살표가 매개변수 x로 복사된다. 배열은 복사되지 않으므로 둘이 같은 O1을 가리킨다.", bindings: ["a → O1", "x → O1 (화살표 복사)"] },
        { line: 3, explanation: "x[0] = 7은 화살표를 따라가 O1의 0번 칸을 고친다. a도 O1을 가리키므로 a에서도 보인다.", bindings: ["O1 = [7]"] },
        { line: 4, explanation: "x = new int[]{9}는 새 상자 O2를 만들고 x의 화살표만 O2로 바꾼다. a의 화살표는 그대로 O1이다. f가 끝나면 x는 사라진다.", bindings: ["x → O2 = [9]", "a → O1 = [7]"] },
        { line: 9, explanation: "main으로 돌아와 a가 가리키는 O1의 0번 칸을 출력한다.", bindings: ["a[0] → O1[0] → 7"], output: "7" },
      ] },
      { id: "java-memory-array", title: "객체 배열의 연결", code: "class Main {\n  static class Box { int x; Box(int n) { x=n; } }\n  public static void main(String[] args) {\n    Box a = new Box(1);\n    Box[] b = {a, a};\n    b[0].x = 5;\n    b[1] = new Box(9);\n    System.out.print(a.x + \" \" + b[1].x);\n  }\n}", output: "5 9", steps: [
        { line: 4, explanation: "Box 객체 O1을 만들고 생성자가 x에 1을 넣는다. a는 O1을 가리킨다.", bindings: ["a → O1 { x: 1 }"] },
        { line: 5, explanation: "배열 O2를 만든다. 배열 칸에는 Box가 아니라 a의 화살표가 두 번 복사된다. Box 객체는 여전히 O1 하나다.", bindings: ["b → O2 = [→O1, →O1]"] },
        { line: 6, explanation: "b[0]은 O1을 가리키므로 O1의 x를 5로 고친다. a도 O1이라 a.x도 5다.", bindings: ["O1 { x: 5 }", "a, b[0], b[1] 모두 → O1"] },
        { line: 7, explanation: "새 Box O3을 만들고 배열의 1번 칸 화살표만 O3으로 바꾼다. a와 b[0]은 그대로 O1이다.", bindings: ["O2 = [→O1, →O3]", "O3 { x: 9 }"] },
        { line: 8, explanation: "a.x는 O1의 5, b[1].x는 O3의 9다.", bindings: ["a.x → O1.x → 5", "b[1].x → O3.x → 9"], output: "5 9" },
      ] },
    ],
  },
  {
    id: "java-static", conceptId: "java-memory", language: "Java", priority: 1, title: "static 공유 공간과 인스턴스 공간",
    rule: "static 필드는 클래스에 하나만 있고 모든 객체가 함께 쓴다. static이 없는 인스턴스 필드는 new로 만든 객체마다 따로 있다. 지역 변수는 각 호출마다 따로 둔다.", trap: "final 참조는 화살표를 다른 객체로 바꿀 수 없다는 뜻이다. 화살표가 가리키는 객체의 내용을 고치는 것은 막지 않는다.",
    examples: [
      { id: "java-static-counter", title: "공유 카운터와 개별 카운터", code: "class Main {\n  static class Box {\n    static int shared=0;\n    int own=0;\n    void add() { shared++; own++; }\n  }\n  public static void main(String[] args) {\n    Box a=new Box(), b=new Box();\n    a.add(); a.add(); b.add();\n    System.out.print(Box.shared + \" \" + a.own + \" \" + b.own);\n  }\n}", output: "3 2 1", steps: [
        { line: 3, explanation: "static shared는 클래스 Box에 딱 하나 있는 칸이다. 객체를 몇 개 만들어도 늘어나지 않는다.", bindings: ["Box.shared = 0 (클래스에 하나)"] },
        { line: 8, explanation: "main에서 객체 둘을 만든다. own은 static이 아니므로 객체마다 자기 칸이 생긴다.", bindings: ["a → O1 { own: 0 }", "b → O2 { own: 0 }", "Box.shared = 0"] },
        { line: 9, explanation: "a.add()를 두 번 호출한다. 메서드 안의 own은 호출한 객체 O1의 칸이고, shared는 클래스의 공유 칸이다.", bindings: ["Box.shared = 2", "O1.own = 2", "O2.own = 0"] },
        { line: 9, explanation: "b.add()는 O2의 own을 올린다. shared는 같은 공유 칸이라 계속 이어서 3이 된다.", bindings: ["Box.shared = 3", "O1.own = 2", "O2.own = 1"] },
        { line: 10, explanation: "공유 칸 3, O1의 2, O2의 1을 출력한다.", bindings: ["Box.shared → 3", "a.own → 2", "b.own → 1"], output: "3 2 1" },
      ] },
      { id: "java-static-final", title: "final 참조와 내용 수정", code: "class Main {\n  public static void main(String[] args) {\n    final int[] a={1,2};\n    a[0]=7;\n    System.out.print(a[0]);\n  }\n}", output: "7", steps: [
        { line: 3, explanation: "배열 O1을 만든다. final은 변수 a의 화살표를 다른 배열로 바꿀 수 없다는 뜻이다.", bindings: ["a → O1 = [1, 2] (화살표 고정)"] },
        { line: 4, explanation: "a[0] = 7은 화살표를 바꾸지 않고 O1의 내용을 고친다. 그래서 허용된다. a = new int[]{9}처럼 화살표를 바꾸면 컴파일 오류다.", bindings: ["O1 = [7, 2]"] },
        { line: 5, explanation: "O1의 0번 칸을 출력한다.", bindings: ["a[0] → 7"], output: "7" },
      ] },
    ],
  },
  {
    id: "java-initialization", conceptId: "java-super", language: "Java", priority: 1, title: "클래스 초기화부터 생성자까지",
    rule: "예제는 Java 17 규칙이다. 클래스를 처음 쓸 때 static 블록을 한 번 실행한다. 객체를 만들 때마다 ① 필드를 기본값(0, null)으로 채우고 ② 부모 생성자를 먼저 끝낸 뒤 ③ 자기 필드 초기화와 { } 블록을 위에서 아래로 ④ 마지막에 생성자 본문을 실행한다.", trap: "생성자 첫 줄에는 보이지 않아도 super()가 숨어 있다. 부모 생성자에서 재정의 메서드를 호출하면 아직 초기화 전인 자식 필드의 기본값(0)이 보인다. this(…)는 같은 클래스의 다른 생성자로 먼저 넘어간다.",
    examples: [
      { id: "java-init-order", title: "static·필드·블록·생성자", code: "class Main {\n  static class A {\n    static { System.out.print(\"S\"); }\n    int x=mark(\"F\");\n    { System.out.print(\"I\"); }\n    A() { System.out.print(\"C\"); }\n  }\n  static int mark(String s) { System.out.print(s); return 1; }\n  public static void main(String[] args) { new A(); new A(); }\n}", output: "SFICFIC", steps: [
        { line: 9, explanation: "실행은 main에서 시작한다. 첫 new A()를 만나는데 클래스 A는 아직 한 번도 쓰이지 않았다.", bindings: ["A 클래스 초기화 전"] },
        { line: 3, explanation: "클래스를 처음 쓰기 직전에 static 블록을 실행한다. 프로그램 전체에서 한 번뿐이다.", bindings: ["A 클래스 초기화 완료"], output: "S" },
        { line: 4, explanation: "객체 O1을 만든다. 필드 초기화 x = mark(\"F\")를 실행하면 8행 mark가 F를 출력하고 1을 돌려준다.", bindings: ["O1 { x: 1 }"], output: "SF" },
        { line: 5, explanation: "필드 다음 줄의 인스턴스 블록 { }을 실행한다. 필드와 블록은 적힌 순서대로 실행한다.", bindings: ["O1 초기화 블록 실행"], output: "SFI" },
        { line: 6, explanation: "마지막으로 생성자 본문이 C를 출력한다.", bindings: ["O1 생성 완료"], output: "SFIC" },
        { line: 9, explanation: "두 번째 new A()에서는 클래스 초기화가 이미 끝났으므로 S를 건너뛴다. 4행 F → 5행 I → 6행 C만 다시 실행한다.", bindings: ["O2 { x: 1 }", "static은 반복하지 않음"], output: "SFICFIC" },
      ] },
      { id: "java-init-dynamic", title: "부모 생성자에서 자식 메서드 호출", code: "class Main {\n  static class A { A() { show(); } void show() {} }\n  static class B extends A {\n    int x=7;\n    B() { System.out.print(x); }\n    void show() { System.out.print(x); }\n  }\n  public static void main(String[] args) { new B(); }\n}", output: "07", steps: [
        { line: 8, explanation: "new B()는 먼저 B 객체 공간을 만들고 모든 필드를 기본값으로 채운다. int의 기본값은 0이다. 4행의 = 7은 아직 실행 전이다.", bindings: ["O1(B) { x: 0 } ← 기본값"] },
        { line: 5, explanation: "B() 생성자에 들어가면 본문보다 먼저 보이지 않는 super()가 실행된다. 즉 부모 A()로 넘어간다.", bindings: ["호출 스택 B() → A()"] },
        { line: 2, explanation: "A() 안에서 show()를 호출한다. 실제 객체는 B이므로 재정의된 B.show가 선택된다.", bindings: ["show() → 실제 객체 B의 show"] },
        { line: 6, explanation: "B.show가 x를 출력하는데 아직 기본값 0이다.", bindings: ["x = 0 (초기화 전)"], output: "0" },
        { line: 4, explanation: "부모 생성자가 끝났으므로 이제 B의 필드 초기화 x = 7을 실행한다.", bindings: ["O1 { x: 7 }"], output: "0" },
        { line: 5, explanation: "마지막으로 B 생성자 본문이 x를 출력한다.", bindings: ["x = 7"], output: "07" },
      ] },
      { id: "java-init-this", title: "this 생성자 연결과 super", code: "class Main {\n  static class A { A(int x) { System.out.print(x); } }\n  static class B extends A {\n    B() { this(3); System.out.print(\"B\"); }\n    B(int n) { super(n+1); System.out.print(\"C\"); }\n  }\n  public static void main(String[] args) { new B(); }\n}", output: "4CB", steps: [
        { line: 7, explanation: "new B()는 인자가 없으므로 4행의 B()를 선택한다.", bindings: ["new B() → B()"] },
        { line: 4, explanation: "B()의 첫 줄 this(3)은 같은 클래스의 B(int)로 먼저 넘어간다. 뒤의 print(\"B\")는 돌아온 뒤에 실행할 일로 남겨 둔다.", bindings: ["호출 스택 B() → B(3)", "B()에 남은 일: B 출력"] },
        { line: 5, explanation: "B(3)의 첫 줄 super(n+1)은 부모 생성자 A(4)로 넘어간다.", bindings: ["n = 3", "호출 스택 B() → B(3) → A(4)"] },
        { line: 2, explanation: "A(4)가 4를 출력하고 끝난다.", bindings: ["x = 4"], output: "4" },
        { line: 5, explanation: "B(3)으로 돌아와 남은 C를 출력한다.", bindings: ["호출 스택 B() → B(3) 종료"], output: "4C" },
        { line: 4, explanation: "처음 B()로 돌아와 남겨 둔 B를 출력한다.", bindings: ["호출 스택 B() 종료"], output: "4CB" },
      ] },
    ],
  },
  {
    id: "java-dispatch", conceptId: "java-binding", language: "Java", priority: 2, title: "필드·static·인스턴스 메서드 종합",
    rule: "A a = new B()에서 A는 변수의 선언 타입, B는 실제 객체 타입이다. 필드와 static 메서드는 선언 타입(A)을, 재정의된 인스턴스 메서드는 실제 객체(B)를 보고 고른다.", trap: "super.f()는 부모 구현을 지정한다. static 메서드는 오버라이딩이 아니라 하이딩이다. 같은 이름의 필드도 부모·자식 칸이 따로 있다.",
    examples: [
      { id: "java-dispatch-mixed", title: "같은 a지만 다른 선택 규칙", code: "class Main {\n  static class A { int x=1; static int s(){return 2;} int f(){return 3;} }\n  static class B extends A { int x=10; static int s(){return 20;} int f(){return 30;} }\n  public static void main(String[] args) {\n    A a=new B();\n    System.out.print(a.x + \" \" + a.s() + \" \" + a.f());\n  }\n}", output: "1 2 30", steps: [
        { line: 5, explanation: "변수 a의 선언 타입은 A, 실제로 만든 객체는 B다. B 객체 안에는 부모에게 받은 x와 B가 새로 만든 x가 둘 다 있다.", bindings: ["a: 선언 A → 실제 O1(B)", "O1 { A의 x: 1, B의 x: 10 }"] },
        { line: 6, explanation: "필드는 선언 타입을 본다. a의 선언 타입이 A이므로 A의 x를 읽는다.", bindings: ["a.x → A의 x → 1"] },
        { line: 6, explanation: "static 메서드는 객체가 아니라 클래스에 붙어 있다. 그래서 선언 타입 A의 s를 고른다.", bindings: ["a.s() → A.s() → 2"] },
        { line: 6, explanation: "재정의된 인스턴스 메서드는 실행할 때 실제 객체를 본다. 실제 객체가 B이므로 B의 f를 실행한다.", bindings: ["a.f() → B.f() → 30"], output: "1 2 30" },
      ] },
      { id: "java-dispatch-super", title: "부모 구현 지정", code: "class Main {\n  static class A { int f(){return 2;} }\n  static class B extends A { int f(){return super.f()+5;} }\n  public static void main(String[] args) { A a=new B(); System.out.print(a.f()); }\n}", output: "7", steps: [
        { line: 4, explanation: "main에서 B 객체를 만들고 선언 타입 A의 변수 a에 넣는다.", bindings: ["a: 선언 A → 실제 O1(B)"] },
        { line: 4, explanation: "a.f()는 재정의된 인스턴스 메서드라 실제 객체 B의 f로 들어간다.", bindings: ["호출 스택 B.f"] },
        { line: 3, explanation: "super.f()는 실제 객체와 상관없이 부모 A의 f를 지정한다.", bindings: ["호출 스택 B.f → A.f"] },
        { line: 2, explanation: "A.f가 2를 반환한다.", bindings: ["super.f() → 2"] },
        { line: 3, explanation: "B.f로 돌아와 2 + 5를 반환한다.", bindings: ["2 + 5 = 7"] },
        { line: 4, explanation: "반환값 7을 출력한다.", bindings: ["a.f() → 7"], output: "7" },
      ] },
    ],
  },
  {
    id: "java-overload", conceptId: "java-overload", language: "Java", priority: 2, title: "오버로드 선택 후 오버라이딩",
    rule: "메서드 선택은 두 번 한다. ① 컴파일 때 변수와 인자의 선언 타입으로 어떤 모양(시그니처)의 메서드를 부를지 고정한다. ② 실행 때 그 모양의 메서드를 실제 객체에서 찾는다.", trap: "실제 인자가 String이어도 선언 타입이 Object라면 ①에서 f(Object)로 고정되고, 실행 중에 f(String)로 다시 고르지 않는다.",
    examples: [
      { id: "java-overload-mixed", title: "두 번의 선택", code: "class Main {\n  static class A { String f(Object x){return \"AO\";} String f(String x){return \"AS\";} }\n  static class B extends A { String f(Object x){return \"BO\";} String f(String x){return \"BS\";} }\n  public static void main(String[] args) {\n    A a=new B(); Object x=\"hi\";\n    System.out.print(a.f(x) + \" \" + a.f(\"hi\"));\n  }\n}", output: "BO BS", steps: [
        { line: 2, explanation: "A에는 이름이 같고 매개변수 타입만 다른 f가 둘 있다(오버로딩). B는 두 f를 모두 재정의한다(오버라이딩).", bindings: ["모양 ① f(Object)", "모양 ② f(String)"] },
        { line: 5, explanation: "각 변수의 선언 타입과 실제 값을 따로 적는다.", bindings: ["a: 선언 A → 실제 O1(B)", "x: 선언 Object → 실제 \"hi\"(String)"] },
        { line: 6, explanation: "a.f(x)의 컴파일 단계: 인자 x의 선언 타입이 Object이므로 f(Object) 모양으로 고정한다. 실제 값이 String인 것은 보지 않는다.", bindings: ["a.f(x) → f(Object)로 고정"] },
        { line: 6, explanation: "a.f(x)의 실행 단계: 고정된 f(Object)를 실제 객체 B에서 찾으므로 B의 f(Object)가 BO를 반환한다.", bindings: ["f(Object) → B.f(Object) → \"BO\""] },
        { line: 6, explanation: "a.f(\"hi\")는 인자의 타입이 처음부터 String이므로 f(String)로 고정하고, 실행 때 B의 f(String)를 찾는다.", bindings: ["a.f(\"hi\") → f(String) → B.f(String) → \"BS\""], output: "BO BS" },
      ] },
      { id: "java-overload-cast", title: "형변환으로 인자 타입 바꾸기", code: "class Main {\n  static void f(Object x){ System.out.print(\"O\"); }\n  static void f(String x){ System.out.print(\"S\"); }\n  public static void main(String[] args) { Object x=\"hi\"; f(x); f((String)x); }\n}", output: "OS", steps: [
        { line: 2, explanation: "f(Object)와 f(String) 두 개가 오버로딩되어 있다.", bindings: ["f(Object) → O 출력", "f(String) → S 출력"] },
        { line: 4, explanation: "x의 선언 타입은 Object, 실제 값은 문자열 \"hi\"다.", bindings: ["x: 선언 Object → 실제 \"hi\""] },
        { line: 4, explanation: "f(x)는 선언 타입 Object를 보고 f(Object)를 고른다.", bindings: ["f(x) → f(Object)"], output: "O" },
        { line: 4, explanation: "(String)x는 식 자체의 타입이 String이 된다. 그래서 f(String)를 고른다.", bindings: ["(String)x: String → f(String)"], output: "OS" },
      ] },
    ],
  },
  {
    id: "java-lambda", conceptId: "java-lambda", language: "Java", priority: 2, title: "람다와 함수형 인터페이스",
    rule: "추상 메서드가 하나뿐인 인터페이스(함수형 인터페이스)는 람다로 구현할 수 있다. 람다 (a,b)->a+b는 그 메서드의 본문이다. 대입할 때는 동작만 저장하고, 메서드를 호출할 때 본문이 실행된다.", trap: "람다에서 쓰는 바깥 지역 변수는 final이거나 한 번도 재대입하지 않은 변수여야 한다. 객체 내용 수정 가능성과 지역 변수 재대입 제한은 다르다.",
    solvingSteps: ["인터페이스의 추상 메서드 이름과 매개변수를 찾는다. 람다는 그 메서드의 본문이다.", "람다를 대입하는 줄에서는 계산하지 않고 '동작을 저장했다'고만 적는다.", "메서드를 호출하는 줄에서 인자를 람다의 매개변수에 넣고 본문을 계산한다.", "람다가 바깥 지역 변수를 쓰면 그 값이 이후 바뀌지 않는지 확인한다."],
    examples: [
      { id: "java-lambda-call", title: "동작을 저장하고 호출하기", code: "class Main {\n  interface Op { int apply(int a, int b); }\n  public static void main(String[] args) {\n    Op add=(a,b)->a+b;\n    Op mul=(a,b)->a*b;\n    System.out.print(add.apply(2,3) + \" \" + mul.apply(2,3));\n  }\n}", output: "5 6", steps: [
        { line: 2, explanation: "Op에는 추상 메서드 apply 하나만 있다. 그래서 람다로 apply의 본문을 줄 수 있다.", bindings: ["Op.apply(int a, int b)"] },
        { line: 4, explanation: "add에 '두 수를 더하는 동작'을 저장한다. 아직 아무것도 계산하지 않는다.", bindings: ["add → apply 본문 a+b"] },
        { line: 5, explanation: "mul에는 '두 수를 곱하는 동작'을 저장한다.", bindings: ["mul → apply 본문 a*b"] },
        { line: 6, explanation: "add.apply(2,3)를 호출하는 순간 a=2, b=3을 넣어 본문을 계산한다.", bindings: ["a=2, b=3 → 2+3 = 5"] },
        { line: 6, explanation: "mul.apply(2,3)도 같은 인자로 곱셈 본문을 계산한다.", bindings: ["a=2, b=3 → 2*3 = 6"], output: "5 6" },
      ] },
      { id: "java-lambda-capture", title: "지역 값 캡처", code: "class Main {\n  interface Op { int apply(int x); }\n  public static void main(String[] args) {\n    int base=3;\n    Op op=x->x+base;\n    System.out.print(op.apply(4));\n  }\n}", output: "7", steps: [
        { line: 4, explanation: "지역 변수 base에 3을 넣는다. 이후 다시 대입하지 않으므로 사실상 final이다.", bindings: ["base = 3"] },
        { line: 5, explanation: "람다 x->x+base는 바깥의 base를 가져다 쓴다(캡처). 대입만 했으므로 아직 계산하지 않는다.", bindings: ["op → apply 본문 x+base", "캡처한 base = 3"] },
        { line: 6, explanation: "op.apply(4)를 호출하면 x=4를 넣어 4+3을 계산한다. 만약 base++ 같은 재대입이 있었다면 컴파일 오류다.", bindings: ["x = 4 → 4 + 3 = 7"], output: "7" },
      ] },
    ],
  },
  {
    id: "java-recursion", conceptId: "java-recursion", language: "Java", priority: 2, title: "재귀와 두 함수의 호출 관계",
    rule: "호출마다 새 칸(호출 스택)을 만들어 그 호출의 매개변수와 '돌아와서 할 일'을 적는다. 가장 깊은 호출이 끝나면 위로 하나씩 돌아오며 남은 일을 처리한다.", trap: "호출 전 출력과 호출 후 출력은 순서가 다르다. 합성 함수나 상호 재귀를 한 번에 머릿속으로 계산하지 말고 표로 펼친다.",
    solvingSteps: ["main에서 첫 호출을 적고, 호출마다 새 칸에 매개변수 값을 적는다.", "재귀 호출보다 앞에 있는 출력은 내려가면서 바로 처리한다.", "재귀 호출 뒤에 남은 출력과 계산은 '돌아와서 할 일'로 칸에 적어 둔다.", "종료 조건에 닿으면 가장 깊은 칸부터 반환값을 위로 넘기며 남은 일을 처리한다."],
    examples: [
      { id: "java-recursion-print", title: "호출 전후 출력", code: "class Main {\n  static void f(int n) {\n    if(n==0) return;\n    System.out.print(n); f(n-1); System.out.print(n);\n  }\n  public static void main(String[] args) { f(3); }\n}", output: "321123", steps: [
        { line: 6, explanation: "main이 f(3)을 호출한다.", bindings: ["호출 스택 f(3)"] },
        { line: 4, explanation: "n=3: 앞의 print로 3을 출력하고 f(2)를 호출한다. 뒤의 print(3)은 돌아와서 할 일로 남는다.", bindings: ["호출 스택 f(3) → f(2)", "f(3)에 남은 일: 3 출력"], output: "3" },
        { line: 4, explanation: "n=2, n=1도 같은 방식으로 2, 1을 출력하고 더 깊이 호출한다.", bindings: ["호출 스택 f(3) → f(2) → f(1) → f(0)", "남은 일: 1, 2, 3 출력"], output: "321" },
        { line: 3, explanation: "f(0)은 n==0이라 아무것도 출력하지 않고 바로 돌아간다.", bindings: ["f(0) 종료"], output: "321" },
        { line: 4, explanation: "가장 깊은 f(1)부터 남은 print를 처리한다. 1 → 2 → 3 순서다.", bindings: ["f(1) → 1 출력", "f(2) → 2 출력", "f(3) → 3 출력"], output: "321123" },
      ] },
      { id: "java-recursion-mutual", title: "상호 재귀 반환표", code: "class Main {\n  static int f(int n) { return n==0 ? 1 : n+g(n-1); }\n  static int g(int n) { return n==0 ? 2 : n*f(n-1); }\n  public static void main(String[] args) { System.out.print(f(3)); }\n}", output: "9", steps: [
        { line: 4, explanation: "print 안의 f(3)을 먼저 계산해야 한다.", bindings: ["호출 스택 f(3)"] },
        { line: 2, explanation: "n=3은 0이 아니므로 3 + g(2)다. g(2)를 알아야 하므로 덧셈은 남겨 둔다.", bindings: ["f(3) = 3 + g(2) ← 대기"] },
        { line: 3, explanation: "g(2)는 2 * f(1)이다. f(1)을 알아야 한다.", bindings: ["g(2) = 2 * f(1) ← 대기"] },
        { line: 2, explanation: "f(1)은 1 + g(0)이다.", bindings: ["f(1) = 1 + g(0) ← 대기"] },
        { line: 3, explanation: "g(0)은 n==0이라 2를 바로 반환한다. 여기서부터 거꾸로 올라간다.", bindings: ["g(0) = 2"] },
        { line: 2, explanation: "f(1) = 1 + 2 = 3을 반환한다.", bindings: ["f(1) = 3"] },
        { line: 3, explanation: "g(2) = 2 * 3 = 6을 반환한다.", bindings: ["g(2) = 6"] },
        { line: 2, explanation: "f(3) = 3 + 6 = 9를 반환한다.", bindings: ["f(3) = 9"] },
        { line: 4, explanation: "반환값 9를 출력한다.", bindings: ["f(3) → 9"], output: "9" },
      ] },
    ],
  },
  {
    id: "java-strings", conceptId: "java-output", language: "Java", priority: 2, title: "String·동일성·문자열 연산",
    rule: "참조형의 ==는 두 화살표가 같은 객체를 가리키는지, equals는 내용이 같은지 비교한다. String은 불변이라 replace 같은 메서드는 원본을 바꾸지 않고 새 문자열을 반환한다. char는 문자 코드 번호(정수)로 계산된다.", trap: "반환된 새 문자열을 변수에 저장하지 않으면 사라진다. 배열의 equals는 원소 비교가 아니라 ==와 같으므로 Arrays.equals를 쓴다. 'A'+1은 문자 B가 아니라 정수 66이다.",
    examples: [
      { id: "java-string-equality", title: "내용과 참조 비교", code: "class Main {\n  public static void main(String[] args) {\n    String a=new String(\"hi\"), b=new String(\"hi\");\n    System.out.print((a==b) + \" \" + a.equals(b));\n  }\n}", output: "false true", steps: [
        { line: 3, explanation: "new는 매번 새 객체를 만든다. 내용은 같아도 상자는 O1, O2 두 개다.", bindings: ["a → O1 \"hi\"", "b → O2 \"hi\""] },
        { line: 4, explanation: "a == b는 화살표가 같은 상자를 가리키는지 비교한다. O1과 O2는 다른 상자다.", bindings: ["O1 == O2 → false"] },
        { line: 4, explanation: "a.equals(b)는 상자 안의 글자를 비교한다. 둘 다 hi다.", bindings: ["\"hi\" equals \"hi\" → true"], output: "false true" },
      ] },
      { id: "java-string-methods", title: "불변성·부분 문자열·char", code: "class Main {\n  public static void main(String[] args) {\n    String s=\"ABCDE\";\n    s.replace(\"A\",\"X\");\n    System.out.print(s.substring(1,4) + \" \" + ('A'+1) + \" \" + (char)('A'+1));\n  }\n}", output: "BCD 66 B", steps: [
        { line: 3, explanation: "s에 번호를 붙인다. 0부터 시작한다.", bindings: ["A=0 B=1 C=2 D=3 E=4"] },
        { line: 4, explanation: "replace는 새 문자열 XBCDE를 반환하지만 아무 변수에도 저장하지 않아 버려진다. String은 불변이라 s는 그대로다.", bindings: ["반환값 \"XBCDE\" → 버려짐", "s = \"ABCDE\""] },
        { line: 5, explanation: "substring(1,4)는 1부터 시작해 4 직전(3)까지다. Python 슬라이싱처럼 끝은 제외한다.", bindings: ["1(B) 2(C) 3(D) → \"BCD\""] },
        { line: 5, explanation: "'A'+1에서 char는 문자 코드 번호로 계산된다. A의 코드는 65(Python의 ord('A')와 같다)라서 정수 66이다.", bindings: ["'A' → 65", "65 + 1 = 66 (int)"] },
        { line: 5, explanation: "(char)66은 코드 번호를 다시 문자로 바꾼다(Python의 chr(66)과 같다). 결과는 B다.", bindings: ["(char)66 → 'B'"], output: "BCD 66 B" },
      ] },
      { id: "java-array-equals", title: "배열 내용 비교와 정렬", code: "import java.util.Arrays;\nclass Main {\n  public static void main(String[] args) {\n    int[] a={2,1}, b={1,2};\n    Arrays.sort(a);\n    System.out.print((a==b) + \" \" + a.equals(b) + \" \" + Arrays.equals(a,b));\n  }\n}", output: "false false true", steps: [
        { line: 4, explanation: "배열 상자 두 개를 만든다.", bindings: ["a → O1 = [2, 1]", "b → O2 = [1, 2]"] },
        { line: 5, explanation: "Arrays.sort는 O1 자체를 정렬하고 아무것도 반환하지 않는다(void).", bindings: ["O1 = [1, 2]"] },
        { line: 6, explanation: "a == b는 같은 상자인지 비교한다. O1과 O2는 다르다.", bindings: ["O1 == O2 → false"] },
        { line: 6, explanation: "배열의 equals는 내용을 비교하도록 재정의되어 있지 않아 ==와 같다.", bindings: ["a.equals(b) → false"] },
        { line: 6, explanation: "Arrays.equals는 원소를 하나씩 비교한다. [1, 2]와 [1, 2]는 같다.", bindings: ["Arrays.equals → true"], output: "false false true" },
      ] },
    ],
  },
  {
    id: "java-operators", conceptId: "java-operators", language: "Java", priority: 3, title: "연산·형변환·단락 평가",
    rule: "식은 왼쪽 피연산자부터 평가한다. x++은 현재 값을 쓰고 나서 올리고, ++x는 먼저 올리고 새 값을 쓴다. Java 정수 나눗셈은 0 방향으로 버리고, 나머지의 부호는 왼쪽 수를 따른다.", trap: "&&와 ||는 왼쪽만으로 결과가 정해지면 오른쪽을 실행하지 않지만, &와 |는 양쪽을 모두 실행한다. Java의 -7/3은 -2로, Python의 -7//3(-3)과 다르다.",
    solvingSteps: ["main부터 줄마다 변수 표를 만들고 값이 바뀔 때마다 갱신한다.", "증감 연산자는 '식에 쓰인 값'과 '이후 변수 값'을 따로 적는다.", "&&, ||는 왼쪽 결과로 끝나는지 먼저 보고, 끝나면 오른쪽 식의 변화를 적용하지 않는다.", "+는 왼쪽부터 묶고, 문자열을 만나는 지점부터 이어 붙이기로 바꾼다.", "반복문은 반복마다 조건 → 본문 → 갱신 순서로 표의 한 줄을 채우고, switch는 break가 나올 때까지 아래로 이어서 실행한다."],
    examples: [
      { id: "java-op-increment", title: "증감과 정수 나눗셈", code: "class Main {\n  public static void main(String[] args) {\n    int x=2;\n    int y=x++ + ++x;\n    System.out.print(x + \" \" + y + \" \" + (-7/3) + \" \" + (-7%3));\n  }\n}", output: "4 6 -2 -1", steps: [
        { line: 3, explanation: "x에 2를 넣는다.", bindings: ["x = 2"] },
        { line: 4, explanation: "왼쪽 x++부터 계산한다. 식에는 현재 값 2를 쓰고, 그 다음 x를 3으로 올린다.", bindings: ["x++ 의 값 = 2", "x = 3"] },
        { line: 4, explanation: "오른쪽 ++x는 먼저 x를 4로 올리고 새 값 4를 식에 쓴다. y = 2 + 4다.", bindings: ["++x 의 값 = 4", "x = 4", "y = 6"] },
        { line: 5, explanation: "-7/3 = -2.33…에서 0 방향으로 버려 -2다. 나머지는 -7 - (-2 × 3) = -1이고, 부호는 왼쪽 수 -7을 따른다.", bindings: ["x = 4, y = 6", "-7/3 → -2", "-7%3 → -1"], output: "4 6 -2 -1" },
      ] },
      { id: "java-op-short", title: "단락·비트·시프트", code: "class Main {\n  public static void main(String[] args) {\n    int x=0;\n    boolean a=false && ++x>0;\n    boolean b=false & ++x>0;\n    System.out.print(x + \" \" + (5&3) + \" \" + (8>>1) + \" \" + (-1>>>31));\n  }\n}", output: "1 1 4 1", steps: [
        { line: 3, explanation: "x에 0을 넣는다.", bindings: ["x = 0"] },
        { line: 4, explanation: "&&는 왼쪽이 false면 결과가 false로 정해지므로 오른쪽 ++x를 실행하지 않는다.", bindings: ["a = false", "x = 0 (++x 건너뜀)"] },
        { line: 5, explanation: "&는 왼쪽이 false여도 오른쪽을 실행한다. ++x로 x가 1이 된다.", bindings: ["b = false", "x = 1"] },
        { line: 6, explanation: "5&3은 2진수 101과 011에서 둘 다 1인 자리만 남겨 001 = 1이다. 8>>1은 1000을 오른쪽으로 한 칸 밀어 0100 = 4(2로 나누기)다.", bindings: ["101 & 011 = 001 → 1", "1000 >> 1 = 0100 → 4"] },
        { line: 6, explanation: "-1은 int 32비트가 모두 1이다. >>>는 빈자리를 0으로 채우며 밀기 때문에 31칸 밀면 맨 끝의 1 하나만 남는다.", bindings: ["11…1 (32개) >>> 31 → 0…01 → 1"], output: "1 1 4 1" },
      ] },
      { id: "java-op-cast", title: "캐스트·삼항·문자열 결합", code: "class Main {\n  public static void main(String[] args) {\n    double x=7.9;\n    int y=(int)x;\n    System.out.print(1+2+\"X\"+3+4 + \" \" + (y>5 ? y : 0));\n  }\n}", output: "3X34 7", steps: [
        { line: 3, explanation: "x에 실수 7.9를 넣는다.", bindings: ["x = 7.9"] },
        { line: 4, explanation: "(int)는 소수부를 버린다. 반올림이 아니므로 8이 아니라 7이다.", bindings: ["(int)7.9 → 7", "y = 7"] },
        { line: 5, explanation: "+를 왼쪽부터 묶는다. 1+2는 숫자끼리라 3이다. 3+\"X\"에서 문자열을 만나 \"3X\"가 되고, 이후는 전부 이어 붙이기라 3과 4가 따로 붙는다.", bindings: ["1+2 → 3", "3+\"X\" → \"3X\"", "\"3X\"+3 → \"3X3\"", "\"3X3\"+4 → \"3X34\""] },
        { line: 5, explanation: "삼항 연산자 조건 ? 참일 때 : 거짓일 때. y>5가 참이므로 y인 7을 고른다.", bindings: ["7 > 5 → true → 7"], output: "3X34 7" },
      ] },
    ],
  },
  {
    id: "java-control", conceptId: "java-operators", language: "Java", priority: 3, title: "반복문·switch·출력 누적",
    rule: "for(초기화; 조건; 갱신)은 반복마다 조건 확인 → 본문 → 갱신 순서다. 전통적인 switch는 일치한 case부터 시작해 break를 만날 때까지 아래 case를 계속 실행한다.", trap: "for의 continue는 본문 나머지만 건너뛰고 갱신식(i++)은 실행한다. 향상된 for의 변수는 원소 값의 복사본이라 재대입해도 배열은 바뀌지 않는다.",
    examples: [
      { id: "java-control-switch", title: "continue와 fall-through", code: "class Main {\n  public static void main(String[] args) {\n    int n=0;\n    for(int i=0;i<4;i++) { if(i==1) continue; n+=i; }\n    switch(n) { case 5: System.out.print(\"A\"); default: System.out.print(\"B\"); }\n  }\n}", output: "AB", steps: [
        { line: 3, explanation: "n에 0을 넣는다.", bindings: ["n = 0"] },
        { line: 4, explanation: "i=0: 조건 0<4 참 → n += 0 → i++.", bindings: ["i = 0, n = 0"] },
        { line: 4, explanation: "i=1: continue로 n += i를 건너뛴다. 그래도 갱신식 i++는 실행한다.", bindings: ["i = 1, n = 0 (더하지 않음)"] },
        { line: 4, explanation: "i=2에서 n=2, i=3에서 n=5. i=4가 되면 조건 4<4가 거짓이라 끝난다.", bindings: ["i = 2 → n = 2", "i = 3 → n = 5", "i = 4 → 종료"] },
        { line: 5, explanation: "switch(5)는 case 5부터 시작해 A를 출력한다.", bindings: ["case 5 일치"], output: "A" },
        { line: 5, explanation: "case 5 뒤에 break가 없으므로 아래 default까지 이어서 B도 출력한다(fall-through).", bindings: ["break 없음 → default 실행"], output: "AB" },
      ] },
      { id: "java-control-enhanced", title: "향상된 for의 복사본", code: "class Main {\n  public static void main(String[] args) {\n    int[] a={1,2};\n    for(int x:a) x+=10;\n    System.out.print(a[0]+\" \"+a[1]);\n  }\n}", output: "1 2", steps: [
        { line: 3, explanation: "배열 O1을 만든다.", bindings: ["a → O1 = [1, 2]"] },
        { line: 4, explanation: "1회차: x에 a[0]의 값 1이 복사된다. x를 11로 바꿔도 x만 바뀐다.", bindings: ["x = 1 → 11", "O1 = [1, 2]"] },
        { line: 4, explanation: "2회차: x에 a[1]의 값 2가 새로 복사되고 12가 된다. 배열 칸에는 대입하지 않았다.", bindings: ["x = 2 → 12", "O1 = [1, 2]"] },
        { line: 5, explanation: "배열은 그대로라 1 2를 출력한다. 바꾸려면 a[i] += 10처럼 칸에 직접 대입해야 한다.", bindings: ["a[0] = 1, a[1] = 2"], output: "1 2" },
      ] },
    ],
  },
  {
    id: "java-types", conceptId: "java-types", language: "Java", priority: 3, title: "추상 클래스·인터페이스·접근 제어·final",
    rule: "인터페이스는 구현해야 할 메서드 목록이다. 추상 클래스는 일부를 비워 둔 클래스라 직접 new할 수 없다. 비어 있는 메서드를 모두 구현한 구체 클래스만 new할 수 있다. 인터페이스 메서드를 구현할 때는 public이어야 한다.", trap: "private는 선언한 클래스 안에서만, 접근 제한자를 안 쓰면 같은 패키지에서만 쓸 수 있다. 다른 패키지의 protected는 상속 관계와 접근 참조에 제약이 있다. final 메서드는 재정의, final 클래스는 상속할 수 없다.",
    solvingSteps: ["인터페이스·추상 클래스·구체 클래스를 구분하고, 어떤 메서드가 비어 있고 누가 채우는지 적는다.", "new로 만든 실제 클래스와 변수의 선언 타입을 따로 적는다.", "같은 이름의 필드가 부모·자식에 있으면 객체 안에 칸 두 개를 그린다.", "메서드 안의 필드는 그 메서드가 선언된 클래스의 필드를 읽는다.", "private, final, abstract 때문에 컴파일 오류가 나는 줄이 없는지 확인한다."],
    examples: [
      { id: "java-types-abstract", title: "추상 타입과 구체 객체", code: "class Main {\n  interface Op { int f(); }\n  static abstract class A implements Op { protected int x=3; }\n  static class B extends A { public int f(){return x+2;} }\n  public static void main(String[] args) { Op o=new B(); System.out.print(o.f()); }\n}", output: "5", steps: [
        { line: 2, explanation: "인터페이스 Op는 'f()를 가져야 한다'는 목록이다. 본문은 없다.", bindings: ["Op: f() 필요"] },
        { line: 3, explanation: "추상 클래스 A는 Op를 구현하겠다고 했지만 f를 아직 채우지 않았다. 그래서 new A()는 할 수 없다. 필드 x=3은 자식에게 물려준다.", bindings: ["A: f() 비어 있음, x = 3"] },
        { line: 4, explanation: "B가 f를 public으로 구현해 빈 곳이 없어졌다. 이제 new할 수 있는 구체 클래스다.", bindings: ["B: f() = x + 2"] },
        { line: 5, explanation: "B 객체를 만들고 선언 타입 Op의 변수 o에 넣는다.", bindings: ["o: 선언 Op → 실제 O1(B) { x: 3 }"] },
        { line: 5, explanation: "o.f()는 실제 객체 B의 f를 실행해 3 + 2를 반환한다.", bindings: ["B.f() → 3 + 2 = 5"], output: "5" },
      ] },
      { id: "java-types-private", title: "private 상태와 공개 동작", code: "class A {\n  private int x=4;\n  final int get(){return x;}\n}\nclass B extends A { int x=9; }\nclass Main {\n  public static void main(String[] args) { B b=new B(); System.out.print(b.x+\" \"+b.get()); }\n}", output: "9 4", steps: [
        { line: 2, explanation: "A의 x는 private라 A 클래스 안에서만 읽을 수 있다. B에서는 직접 쓸 수 없다.", bindings: ["A의 x = 4 (private)"] },
        { line: 3, explanation: "get은 A 안에 있으니 A의 x를 읽는다. final이라 B가 재정의할 수 없다.", bindings: ["get() → A의 x"] },
        { line: 5, explanation: "B는 이름만 같은 새 필드 x를 만든다. A의 x를 바꾸는 것이 아니다.", bindings: ["B의 x = 9 (별도 칸)"] },
        { line: 7, explanation: "B 객체 안에는 x 칸이 두 개 있다.", bindings: ["b → O1 { A의 x: 4, B의 x: 9 }"] },
        { line: 7, explanation: "b.x는 선언 타입 B의 x라 9다. b.get()은 A에 선언된 get이 A의 x를 읽어 4다.", bindings: ["b.x → 9", "b.get() → A의 x → 4"], output: "9 4" },
      ] },
    ],
  },
  {
    id: "java-exceptions", conceptId: "java-exception", language: "Java", priority: 3, title: "예외·반환값·finally",
    rule: "예외가 나면 try의 남은 줄을 건너뛰고, catch를 위에서부터 보며 처음 맞는 하나만 실행한다. return을 만나면 반환할 값을 먼저 계산해 보관한 뒤, finally를 실행하고 나서 돌아간다.", trap: "finally에서 새로 return하면 보관해 둔 반환값을 덮는다. int처럼 기본형 반환값은 보관할 때 복사되므로 이후 지역 변수를 바꿔도 반환값은 그대로다. finally가 무조건 실행된다고 일반화하지는 않는다.",
    examples: [
      { id: "java-exception-value", title: "반환식 평가 시점", code: "class Main {\n  static int f(){\n    int x=1;\n    try { return x; }\n    finally { x=9; System.out.print(\"F\"); }\n  }\n  public static void main(String[] args){ System.out.print(f()); }\n}", output: "F1", steps: [
        { line: 7, explanation: "print에 넘길 값을 알기 위해 f()를 먼저 호출한다. 아직 아무것도 출력하지 않았다.", bindings: ["호출 스택 main → f"] },
        { line: 3, explanation: "지역 변수 x에 1을 넣는다.", bindings: ["x = 1"] },
        { line: 4, explanation: "return x는 지금 값 1을 반환값으로 복사해 보관한다. 바로 돌아가지 않고 finally를 먼저 실행한다.", bindings: ["보관한 반환값 = 1"] },
        { line: 5, explanation: "finally에서 x를 9로 바꿔도 보관한 반환값은 복사본 1 그대로다. F를 출력한다.", bindings: ["x = 9", "보관한 반환값 = 1"], output: "F" },
        { line: 7, explanation: "f()가 1을 돌려주고 print가 출력한다. 그래서 F가 1보다 먼저 나온다.", bindings: ["f() → 1"], output: "F1" },
      ] },
      { id: "java-exception-catch", title: "catch 하나와 finally", code: "class Main {\n  public static void main(String[] args){\n    int n=0;\n    try { n++; throw new IllegalArgumentException(); }\n    catch(IllegalArgumentException e){ n+=2; }\n    catch(RuntimeException e){ n+=10; }\n    finally { n+=100; }\n    System.out.print(n);\n  }\n}", output: "103", steps: [
        { line: 3, explanation: "n에 0을 넣는다.", bindings: ["n = 0"] },
        { line: 4, explanation: "n++로 1이 된 뒤 예외를 던진다. try 블록은 여기서 멈춘다.", bindings: ["n = 1", "IllegalArgumentException 발생"] },
        { line: 5, explanation: "catch를 위에서부터 본다. 첫 catch가 정확히 맞으므로 n += 2를 실행한다.", bindings: ["n = 3"] },
        { line: 6, explanation: "IllegalArgumentException은 RuntimeException의 자식이라 이 catch에도 맞지만, catch는 하나만 실행하므로 건너뛴다.", bindings: ["두 번째 catch 건너뜀", "n = 3"] },
        { line: 7, explanation: "finally는 예외가 처리된 뒤에도 실행된다.", bindings: ["n = 103"] },
        { line: 8, explanation: "n을 출력한다.", bindings: ["n = 103"], output: "103" },
      ] },
      { id: "java-exception-return", title: "finally에서 새 반환", code: "class Main {\n  static int f(){ try { return 1; } finally { return 2; } }\n  public static void main(String[] args){ System.out.print(f()); }\n}", output: "2", steps: [
        { line: 3, explanation: "print에 넘길 값을 알기 위해 f()를 호출한다.", bindings: ["호출 스택 main → f"] },
        { line: 2, explanation: "try의 return 1은 반환값 1을 보관하고 finally로 간다.", bindings: ["보관한 반환값 = 1"] },
        { line: 2, explanation: "finally의 return 2가 보관한 1을 버리고 2로 바꾼다. 실무에서는 피할 패턴이다.", bindings: ["최종 반환값 = 2"] },
        { line: 3, explanation: "f()의 반환값 2를 출력한다.", bindings: ["f() → 2"], output: "2" },
      ] },
    ],
  },
  {
    id: "java-generics", conceptId: "java-generics", language: "Java", priority: 3, title: "제네릭 타입과 오버로딩·래퍼",
    rule: "제네릭 메서드 <T>의 본문은 컴파일 때 한 번만 검사한다. 그때 T에 무엇이 올지 모르므로 Object처럼 다루고, 그 기준으로 호출할 오버로드를 고정한다. Integer 같은 래퍼는 int를 담은 객체다.", trap: "T에 Integer가 들어와도 실행 중에 Integer 오버로드를 다시 고르지 않는다. 래퍼끼리 ==는 같은 객체인지 비교하므로 equals를 쓰고, 한쪽이 int면 래퍼를 int로 꺼내(언박싱) 숫자로 비교한다.",
    solvingSteps: ["제네릭 메서드 본문 안에서 T 변수는 Object로 보고 오버로드를 고른다.", "호출하는 줄에서 기본형(int)이 래퍼(Integer)로 바뀌는지(박싱) 표시한다.", "직접 호출이면 인자 타입에 가장 가까운 오버로드를 고른다.", "래퍼 비교는 equals(값 비교), 래퍼 == 래퍼(객체 비교), 래퍼 == int(언박싱 후 값 비교)로 나눈다."],
    examples: [
      { id: "java-generics-overload", title: "T를 전달한 오버로드", code: "class Main {\n  static String pick(Object x){return \"O\";}\n  static String pick(Integer x){return \"I\";}\n  static <T> String call(T x){return pick(x);}\n  public static void main(String[] args){ System.out.print(call(7)+\" \"+pick(7)); }\n}", output: "O I", steps: [
        { line: 2, explanation: "pick이 두 개 오버로딩되어 있다.", bindings: ["pick(Object) → \"O\"", "pick(Integer) → \"I\""] },
        { line: 4, explanation: "call 본문은 컴파일 때 한 번만 검사한다. x의 타입 T는 무엇이 올지 모르므로 Object로 보고, pick(Object)로 고정한다.", bindings: ["T → Object로 취급", "pick(x) → pick(Object)로 고정"] },
        { line: 5, explanation: "call(7): 7이 Integer로 박싱되어 T=Integer가 되지만, call 안의 호출은 이미 pick(Object)로 고정되어 있다.", bindings: ["call(7) → pick(Object) → \"O\""] },
        { line: 5, explanation: "pick(7)은 직접 호출이다. int 7을 Integer로 박싱하면 두 pick 모두 받을 수 있는데, 더 구체적인 pick(Integer)를 고른다.", bindings: ["pick(7) → pick(Integer) → \"I\""], output: "O I" },
      ] },
      { id: "java-generics-wrapper", title: "래퍼 내용과 언박싱", code: "class Main {\n  public static void main(String[] args){\n    Integer a=Integer.valueOf(200);\n    Integer b=Integer.valueOf(200);\n    System.out.print(a.equals(b)+\" \"+(a==200));\n  }\n}", output: "true true", steps: [
        { line: 3, explanation: "a는 200을 담은 Integer 객체를 가리킨다.", bindings: ["a → Integer(200)"] },
        { line: 4, explanation: "b도 200을 담은 Integer 객체를 가리킨다. a와 같은 객체인지는 보장되지 않으므로 a==b의 답을 추측하지 않는다.", bindings: ["b → Integer(200)", "a == b → 정하지 않음"] },
        { line: 5, explanation: "a.equals(b)는 담긴 값을 비교한다.", bindings: ["200 equals 200 → true"] },
        { line: 5, explanation: "a==200은 한쪽이 int라서 a에서 int 200을 꺼내(언박싱) 숫자끼리 비교한다.", bindings: ["a → 200 (언박싱)", "200 == 200 → true"], output: "true true" },
      ] },
    ],
  },
];
