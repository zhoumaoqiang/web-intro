# TypeScript

## 安装

安装`typescript`，使用指令`npm i -g typescript`，安装完成后可以使用`tsc`指令将`.ts`文件编译成`.js`文件。  
在`ts`文件中，可以做到：

1. 类型注解，标注并限制变量的数据类型，但是`js`文件依然能够正常生成
2. 接口，适用于对象属性的类型注解，接口作为对象的类型对变量注解
3. 类，可以配合接口使用，在构造函数的参数上使用`public`等同于创建了同名的成员变量
4. 使用`tsconfig.json`，配置编译细节

使用`tsc --init`指令生成`tsconfig.json`文件，设置输出的文件位置，然后在菜单栏`终端 -> 运行任务 -> 见识tsconfig.json`可以实现实时编译。如果使用Hbuilder就需要下载插件，在首选项中选择自动编译，最后在工程目录选择配置，允许ts的编译即可。

## 类型校验

typescript中数据类型包括boolean、string、number、array、tuple、enum、any、undefined、void、never。使用类型注解的方法：

```ts
let n:number = 10
let arr:Array<number> = [1, 2, 3]
let _arr:number[] = [1, 2, 3]
let tuple:[number, string] = [123, '123'] // 必须每个位置指定
enum Flag{success=200, error=404, unknown}  // 类似于常量对象
let status:Flag = Flag.success
console.log(Flag.unknown)
```

变量使用类型注解标记数据类型后，就不能给变量赋值其他类型的数据。  
前面提到的都是JS中较为熟悉的数据类型，除开null和undefined比较特殊的类型（既是类型也是值），ts中还添加有一些特殊的数据类型。

```ts
let v:any = 30; // 任意类型，可以不受限制更改数据类型
v = 'string';
v = document.querySelector('div')

var data:number | null | undefined
// 使用null和undefined可以在不赋值的情况直接访问

// void用于定义函数的返回数据类型，表示函数没有任何返回值
function fn():void {

}
// 返回类型确定时，就需要
function getNum():number {
  let a:number = 0
  a++
  return a
}

// never使用比较特殊，使用never声明的变量只能赋值never类型的数据
// 表示总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型;
let err:never = () => {
  throw Error('unknown Error')
}

```

## 函数

ts中函数定义的方式：

* 函数声明
* 匿名函数

```ts
function getStr(str: string):string {
  return str + '  ';
}
let doSomething = function():void {
  console.log('do something')
}
```

函数可选参数(可选参数应放在必传参数的后面)：

```ts
function getAge(age?:number):number {
  if(age) {
    return age
  } else {
    return 0
  }
}
```

函数参数默认值：

```ts
function getInfo(name:string, age:number=10):void {
  console.log(name + 'is' + age + 'years old')
}
getInfo('Tom')
```

函数剩余参数，参数类型指定时，将会是个数组类型：

```ts
function sum(...args:number[]):number() {
  return args.reduce((a,b) => a+b)
}
```

函数重载，在java中是指两个或两个以上同名函数参数不同出现的情况，js中同名函数在同一作用域内将会被覆盖，但是在ts中，指定函数传入类型和返回类型，重载起到一定的匹配对应的作用。

```ts
function getInfo(name:string):string;
function getInfo(age:number):number;
// 上面是类型注解，下面是函数体，any并不是实际的类型注解，而是对上面两种情况的站位说明
function getInfo(info:any):any {
  if(typeof info === 'string') {
    return `my name is ${info}`
  } else {
    return info
  }
}
```

## 类

ts中类的基本定义，以及类继承：

```ts
class Person {
  // 类的属性对应值的类型注解
  name: string

  constructor(num: string) {
    this.name = num
  }

  getName():string {
    return this.name
  }

  setName(newName: string):void {
    this.name = newName
  }
}

class Student extends Person {

  constructor(name: string) {
    // 传入继承类 Person 的构造器
    super(name)
  }
  // 对象多态性，子类定义方法覆盖父类方法
  getName():string {
    return this.name + ' special'
  }

}
```

类修饰符，public、protected、private(表示类属性有效域)：

```ts
class Person {
  // 可以在类的里面和外面访问此属性，public可省略
  public name:string
  // 当成员被标记成 private时，它就不能在声明它的类的外部访问，继承类中该属性也无法访问
  private weight: number
  // 同样在类外部无法访问，但是在继承类中可以访问
  protected age: number



  constructor(name: string) {
    this.name = name
  }

  public work():void {
    console.log('%s is working', this.name)
  }
}

```

类的静态方法和属性(参考Math类、Date.now())：

```ts
class Person {
  static type = 'human'
  static run():void {
    console.log('The person is running')
  }
  static getType():string {
    // 静态方法中无法使用this
    return Person.type
  }
}
Person.run()
```

类的多态，父类定义方法，通过子类实现(重写)，ts中抽象类定义抽象方法，不能包含具体实现，而只能在子类中定义：

```ts
// 抽象类不能实例化
abstract class Animal {
  // 抽象类与普通方法不冲突
  name: string
  constructor(name: string) {
    this.name = name
  }
  abstract eat():any
}
// 抽象类的子类必须实现抽象类中定义的方法
class Dog extends Animal {
  constructor(name: string) {
    super(name)
  }
  eat(): string {
    return 'dogs eat bone'
  }
}
```

## 接口

ts中接口是为类型注解和代码之间进行规范契约（例如定义一个json类型注解的通过规范接口），接口可用于属性、函数、类等。

属性接口：

```ts
// 定义接口使用interface关键字，相当于定义一个固定属性的json数据格式
// 问号表示属性为可选
interface FullName {
  firstName: string
  secondName: string,
  age?: number
}
// 指定类型注解可以直接使用对象格式，但是使用抽出的接口，可以用于多个方法
function printName(name: FullName):void {
  console.log(name.firstName + ' ' + name.secondName)
}
// 出入对象属性必须完全匹配接口定义，顺序无关
printName({
  firstName: 'Sheldon',
  secondName: 'Cooper'
})
printName({
  firstName: 'Tom',
  secondName: 'Welson',
  // age: 20
})
```

只读接口：

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

定义函数的接口：

``` ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

可索引：

```ts
interface StringArray {
  [index: number]: string;
}
```

类接口：

```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

```