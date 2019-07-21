// ES6新增的数据类型，Symbol、Map、Set

let s1 = Symbol()
let s2 = Symbol('s')

// Symbol数据不能使用new，并且传递参数为描述，除此之外没有实际意义，默认会采用toString()作为描述内容
// 使用Symbol最好是用作常量！

let s3 = Symbol.for('s')
// 均由 Symbol.for 来指定描述，那么将会指向同一个 Symbol

Symbol.keyFor(s3)   // 通过keyFor获取描述

// ES6增加了一写内置的Symbol使用用例
// Symbol.hasInstance修饰类方法，用于判断类实例 instanceof 运算符的规则
class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}
[1, 2, 3] instanceof new MyClass() // true

// 如果不想指向类的实例，在方法前添加 static 修饰



// Set集合是有个有序且不重复的对象，每项数据的键值相同，但无法直接访问，想要直接访问可以转换成数组
var set = new Set([1, 2, 3, 4, 4]);
console.log(set.size)   // 集合的长度，通过 size 而不是 length 来访问

// Set数据中，NaN为相同的值
set.add(5).add(6)
set.delete(2)
set.has(3)
set.clear()

Array.from(set)
var set2arr = [...set]

// Set是一种可迭代数据

// WeakSet是专门应用于对象的集合，不可迭代，无内存回收，依据外部对象直接销毁
var ws = new WeakSet();

// Map数据，类似于对象，但是键可以为任意数据类型
var map = new Map([
    [2, 10],
    ['title', 'waoHhh']
])

map.set('key', 'value').set('key', 'covered')
map.get('key')

// 映射的数据成员数量，通过size获取
map.size
map.has(2)
map.delete('title')
map.clear()

// Map也是可迭代类型，默认使用entries方法，并且支持forEach()

// Map数据的转换，有相应的格式要求
// Map => Array         拓展运算符
// Array => Map         传入二维数组或者空数组，二维数组内层有两个元素
// Map => Object        满足所有的键都是字符串，然后通过遍历赋值
// Object => Map        通过遍历
// Map => JSON          也就是转换成对象或者数组的情况

// WeakMap只接收对象作为键（除null），这样减弱键的作用，当外部去除键的对象，在WeakMap中仍不影响使用，也不会长久占据内存
// WeakMap也是一个不可遍历对象
