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
前面提到的都是JS中较为熟悉的数据类型，除开null和undefined比较特殊的类型，ts中还添加有一些特殊的数据类型。

```ts
let v:any = 30;
v = 'string';
v = document.querySelector('div')
```