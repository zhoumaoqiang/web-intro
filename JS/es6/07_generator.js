// Generator函数也是 ES6 的一种异步编程解决方案

// Generator函数在function关键字和函数名之间有一个 * ，并且在函数内部使用 yield 关键字表示函数内部状态

function* fib(num) {
    let n = 0;
    if(n < num) {
        yield n++
    }
} 