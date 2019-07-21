/**
 * ================  ES6变量声明关键字  ===========================
 */

{
    let a = 0
}
try {
    console.log(a)
} 
catch(e) {
    console.log('let声明变量，作用域外无法访问')
}

for(let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log('循环+时间函数，let声明的i：' + i)
    })
}
for(var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log('循环+时间函数，var声明的i：' + i)
    })
}

try {
    let b = 1;
    let b = 2;
} catch (error) {
    console.log('let声明的变量不允许重复声明')
}

// const必须在初始化赋值，并且存在块级作用域
const PI = 3.14
try {
    PI = 3
} catch (error) {
    console.log('const声明的变量，不能再进行赋值或者声明')
}

const DATA = {
    num: 1
}
DATA.num = 2
console.log('const声明对象地址不可更改，属性可以改变')

var c = 5

function test() {
    console.log('函数声明')
}

class Test {
    constructor(el) {
        this.el = el
    }
    testFunc() {
        console.log('ES6类声明', this.el)
    }
}

// 模块声明
try {
    import fs from 'fs'
    console.log('引入的fs模块对象', fs)
} catch (error) {
    console.log('无法通过import引入模块')
}

/**
 * ===============  变量解构赋值  ==================
 */

// 结构匹配，就能够解构赋值
let [first, middle, last] = [1, 2, 3]
let [ , , third] = ['第一', '第二', '第三']
let [head, ...tail] = [0, 2, 4, 6, 8]
console.log(tail)
// 默认值，当值全等为undefined，就会取默认值
let [foo = true] = []


let {m, n} = {m: 3, n: 2}
let {name: alias} = {name: 'Bob'}
console.log(alias)
// 默认值
let {bar: bar = 10, baz: baz = 20} = {bar: 'bbb'}
console.log(bar, baz)

// 封装对象的属性
let [o, p, q, r, s] = 'hello'
let { length } = 'hello'

// 函数参数
function add([a, b]) {
    consolelog(a + b)
}
add([5, 10])


try {
    let ({ block }) = { block: 'block' }
} catch (e) {
    console.log('结构语句不能使用任何形式的小括号')
}