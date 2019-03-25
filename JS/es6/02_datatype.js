// ============================== String
// 直接输入全球码
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

// ========================================= RefExp

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
