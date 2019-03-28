// Promise对象是异步编程的解决方案
// 对象的三个状态：pending（进行中），fulfilled（已成功），rejected（已失败）
// 状态的变化只能从pending -> fulfilled，该过程是 resolve（定型），或者从 pending -> rejected，状态变化之后就无法改变

var promise = new Promise(function(resolve, reject) {
    // 一般用于异步操作
    setTimeout(() => {
        console.log('10 + 20')
        if(10 + 20 >= 30) {
            resolve(true)
        } else {
            reject(false)
        }
    }, 1000)
})

// 在promise中调用resolve或者reject函数，作为成功和失败是到处的值

// 获取的 Promise 实例，会在 promise 到处值的操作中，调用then中的函数

promise.then(function(val) {
    // 可选参数，resolve时成功的回调
    console.log(val, 'promise active successfully')
    // 如果返回仍是一个promise，可以采用链式调用
    return new Promise(function(resolve, reject){resolve(true)})
}, function(err) {
    // 可选参数，reject时失败的回调，不建议，建议使用后面那个
    console.log(err)
}).catch(function(e) {
    // 失败，当reject 或者 throw Error 时，都会进入catch中的函数
    console.log(e, 'promise active failed')
}).finally(function() {
    // 无论成功与否，最终都会执行    
    console.log('finnally')
})

// Promise.all() 接收一个可迭代数据，里面每个返回的promise状态都是 fulfilled，此时才是 fulfilled，调用then的方法
// 如果有一个变成reject，那么就会调用catch的方法
// 一直处于pending，那么就一直等待
Promise.all([new Promise((s, j) => {s(true)}), new Promise((s, j) => {s(true)})])


// Promise.race 只要有一个状态从pending改变，就会触发后面的函数
Promise.race([new Promise((s, j) => {s(true)}), new Promise((s, j) => {s(true)})])

// 相当于直接导出的Promise
Promise.resolve()
Promise.reject()

// 判断Promise内容是同步还是异步，不总以异步执行
Promise.try()