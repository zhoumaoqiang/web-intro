// Generator函数也是 ES6 的一种异步编程解决方案

// Generator函数在function关键字和函数名之间有一个 * ，并且在函数内部使用 yield 关键字表示函数内部状态

function* fib(num) {
    let n = 0;
    if(n < num) {
        yield n++
    }
}

// 遍历器生成函数可以直接作为对象 Symbol.iterator 接口的函数，在使用 next() 函数是可以传递参数，作为 yield 语句返回的值
function* next_transport() {
    var n = 0
    while(true) {
        var result = (yield n++)
        if(result) return 1
    }
}

// 使用迭代器函数，就可以使用 for...of 完成遍历
for(let val of fib(10)) {
    console.log(val)
}