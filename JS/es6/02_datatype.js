// ============================== String
// 直接输入全球码
function stringModule() {
    console.log('\\ufa5a', '\ufa5a')
    console.log('\\uD842\\uDFB7', '\uD842\uDFB7')
    
    // 兼容的全球码表示法
    console.log('\\u{42}', '\u{42}')
    
    console.log('你'.charCodeAt())   // 返回utf8字符码点，结果为十进制
    console.log(String.fromCharCode(20320))
    console.log('𠮷'.codePointAt())  // 返回utf16字符码点，十进制结果
    console.log(String.fromCodePoint(134071))
    
    // 查找匹配
    console.log('hello'.startsWith('H'))    // false
    console.log('hello'.endsWith('o'))      // true
    console.log('hello'.includes('l'))      // true
    
    // 字符复核
    console.log('重复：', 'xy'.repeat(5))
    
    // 字符填充
    console.log('x'.padStart(5, 'ab'))  // 填充后字符长度，以及填充使用材料
    console.log('x'.padEnd(5, 'ab')) 
    
    let vary = '变量——'
    console.log(`
        模板字符串，支持换行
        支持'', ""
        变量解析 ${vary}
    `)
    
    // 自动转义
    console.log(String.raw`使用\n换行`) // 必须搭配字符串模板使用，然后不用再转义了
}

// ========================================= RefExp

function refExpModule() {

    // “两种”声明方式
    var regex = new RegExp('xyz', 'i');
    var regex = new RegExp(/xyz/i);
    var regex = new RegExp(/xyz/, "i"); // ES6
    var regex = /xyz/i;
    console.log(regex.flags) // 查看修饰符
    
    console.log(/^\uD83D/u.test('\uD83D\uDC2A'), 'u修饰符用于处理全球码正则判断')
    
    // y修饰符可匹配多次结果，并且每次匹配都必须以正则表达式开始匹配
    var reg = /a+_/y
    var str = 'aaa_aa_a'
    console.log(str, reg.exec(str), reg.exec(str), reg.exec(str))
    str = 'aaa_-aa_-a_-'
    console.log(str, reg.exec(str), reg.exec(str), reg.exec(str))
    
    // 点匹配任意字符，在正则中不包括utf-16的全球码字符，以及行终止符
    // utf-16可以使用 u 修饰符，行终止符包括 \n, \r, 行分隔符, 段分隔符
    
    console.log('先行断言：x必须在y之前才匹配', /x(?=y)/)
    console.log('先行否定断言：x只有不在y前才匹配', /x(?!y)/)
    // es6新增后行断言
    console.log('后行断言：x必须在y之后才匹配(区别x不在y之前，匹配对象和y存在性不同)', /(?<=y)x/)
    console.log('后行否定断言：x只有不在y之后才匹配', /(?<!y)x/)
    
    // 每种断言的匹配区间都是不同的，并且先行和后行还取决于匹配的方向是从前还是从后
    
    // 具名组匹配，为分组匹配指定名称
    var re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
    console.log('具名组：?<name>。 1993-03-26', re.exec('1993-03-26'))
    console.log('具名组替换：$<name>', '2015-01-02'.replace(re, '$<day>/$<month>/$<year>'))
    console.log(String.raw`具名组引用：\k<name>`, /^(?<word>[a-z]+)!\k<word>$/)
}

// =========================================== Number

function numberModule() {
    console.log('二进制：0b或0B', 0b10110)
    console.log('八进制：0o或0O', 0o763)
    console.log('十进制：0x或0X', 0Xd1c349)
    console.log('转换成十进制，使用Number()方法', Number(0x4123ab))

    // 静态方法，有穷性和判断是否为有效number
    console.log(Number.isFinite(15)) // 只有有效的number返回true
    console.log(Number.isNaN('NaN')) // 所有计算结果为NaN，都会返回true

    // 迁移全局方法parseInt、parseFloat
    console.log(Number.parseInt == parseInt, Number.parseFloat == parseFloat)

    // 判断整数
    console.log('判断整数：Number.isInteger(25.0)', Number.isInteger(25.0))
    console.log('整数判断无法用于二进制位数超过53位的情况：', Number.isInteger(3.0000000000000002))

    // 最小常量，等于Math.pow(2, -52)，也是JS中的最大精度
    console.log('最小常量：Number.EPSILON=', Number.EPSILON)
    // 安全整数，JS中的最大整数，等于Math.pow(2, 53)-1
    console.log(Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1)
    console.log(Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER)
    console.log('判断是否在安全整数范围内：', Number.isSafeInteger(Number.MIN_SAFE_INTEGER))

    // Math静态方法
    console.log('Math.trunc(n)截取整数：', Math.trunc(true), parseInt(true))
    console.log('判断正负数：', Math.sign(5), Math.sign(-5), Math.sign(0), Math.sign(-0), Math.sign(NaN))
    console.log('8的立方根：', Math.cbrt(8))
    console.log('返回32位无符号二进制前0的数量：', Math.clz32(0))
    console.log('低位相乘(位运算)，用于计算超过数值上限的乘法，返回32位带符号整数：', Math.imul(0x7fffffff, 0x7fffffff))

    console.log('将64位双精度浮点数转换成32位单精度浮点数，精度降低，计算范围增加，小数精度超过24个二进制位就会返回不精确的结果：', Math.fround(0.3))

    console.log('返回所有参数平方和的平方根：', Math.hypot(3, 4))

    console.log('指数运算符，a ** b 约等价于 Math.pow(a, b)，计算顺序是右结合向左运算', 2 ** 3 ** 2) // 2 ** 9
    
}

// ======================================= Function

function funcModule() {

    // 默认参数
    function defaultParam(param = 'str', num = 0, ...otherParams) {
        // 参数变量默认声明，不能使用let、const，可以使用var
        console.log(arguments, param, num, otherParams)
    }

    // 箭头函数
    //  this指向外层且固定作用域、不可以做构造函数、不可以使用arguments、不可以使用yield
    let fn = val => val
    fn(5)

    // (提案)双冒号运算符，后面的函数将this指向前面的对象，包括箭头函数
   
    // 尾调用，是指在函数最后一步调用函数
    // 函数调用形成调用帧，保存调用位置和内部变量等信息，这样就可以不保存外层函数的调用帧，而只保留内层函数的调用帧，这样可以减少内存占用
    // 尾调用自身函数，就是尾递归，这样可以很大程度避免栈溢出
    function factorial(n, total = 1) {
        if (n === 1) return total;
        return factorial(n - 1, n * total);
      }
    
    // 尾调用模式只在严格模式下生效，严格模式禁止了arguments和caller跟踪函数，所以数据占用无法完成尾调用优化

    // 蹦床函数（trampoline）可以将递归执行转为循环执行。
    function trampoline(f) {
        while (f && f instanceof Function) {
            f = f();
        }
        return f;
    }

    // 尾递归优化
    function tco(f) {
        var value;
        var active = false;
        var accumulated = [];
      
        return function accumulator() {
          accumulated.push(arguments);
          if (!active) {
            active = true;
            while (accumulated.length) {
              value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
          }
        };
      }
      
      var sum = tco(function(x, y) {
        if (y > 0) {
          return sum(x + 1, y - 1)
        }
        else {
          return x
        }
      });
      
      sum(1, 100000)

}


// ===================================== Array

function arrayModule() {
    function fn(x, y, z) {
        console.log(x, y, z)
    }
    var args = [0, 1, 2];
    fn.apply(null, args);   // 注意ES5的写法
    fn(...args)

    console.log("['a'].concat([1], ['2'])", ['a'].concat([1], ['2']))   // 浅拷贝

    // 实现Iterator 接口的对象，都可以通过拓展运算符转换成数组


}