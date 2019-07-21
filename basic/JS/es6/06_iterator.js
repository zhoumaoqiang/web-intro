// 遍历器、迭代器 接口
// 具有迭代器接口的数据，都可以使用for...of..遍历

// ES6 默认的 iterator 接口是依据对象定义 Symbol.iterator 函数实现的（例如数组、Map）

var obj = {
    [Symbol.iterator]: function() {
        var objIndex = 0
        return {
            next: function() {
                if(objIndex++ > 10) {
                    return {
                        value: objIndex,
                        done: true
                    }
                } else {
                    return {
                        value: objIndex,
                        done: false
                    }
                }
            }
        }
    }
}
for(let item of obj) {console.log(item)}
// 对象本身是不可迭代对象，加上 Symbol.iterator 就可以使用 for ... of .. 迭代，这样迭代不会报错但并不是想要的结果

// 对于类数组对象，可以直接使用数组的迭代器接口
class NodeList{

}
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

// iterator 可以使用 next() 方法获得迭代的下一个数据
var arr = [1, 2, 3]
var arr_iter = arr[Symbol.iterator]()
arr_iter.next()
arr_iter.next()

// 调用可迭代接口场景，包括解构赋值、拓展运算符、generator函数的 yield*

// 可迭代函数
function* fib(num) {
    let n = 0, start_1 = 0, start_2 = 1;
    while(n < num) {
        yield start_2
        let temp = start_2
        start_2 += start_1
        start_1 = temp
        n++
    }
    return
}

// 对象转换可迭代数据，next方法是必须部署的，除此之外，还可以选择部署 return 和 throw 方法
// return 方法用于退出循环，throw 用于 generator函数
